#!/usr/bin/env python3
"""
Artifact Virtual - Build Automation System
Military-grade build pipeline and deployment automation
"""

import json
import asyncio
import logging
import shutil
import tarfile
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
import sqlite3
import yaml


class BuildStatus(Enum):
    """Build status enumeration"""

    PENDING = "pending"
    BUILDING = "building"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"


class DeploymentTarget(Enum):
    """Deployment target environments"""

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"


@dataclass
class BuildConfiguration:
    """Build configuration data structure"""

    project_name: str
    version: str
    build_type: str
    source_path: Path
    output_path: Path
    dependencies: List[str]
    build_steps: List[Dict[str, Any]]
    deployment_targets: List[DeploymentTarget]
    environment_variables: Dict[str, str]
    artifacts: List[str]


@dataclass
class BuildResult:
    """Build result data structure"""

    build_id: str
    project_name: str
    version: str
    status: BuildStatus
    start_time: datetime
    end_time: Optional[datetime]
    duration: Optional[float]
    artifacts: List[str]
    logs: str
    error_message: Optional[str]

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "build_id": self.build_id,
            "project_name": self.project_name,
            "version": self.version,
            "status": self.status.value,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "duration": self.duration,
            "artifacts": self.artifacts,
            "logs": self.logs,
            "error_message": self.error_message,
        }


class BuildAutomationSystem:
    """Advanced build automation and deployment system"""

    def __init__(self, workspace_root: Optional[Path] = None):
        self.workspace_root = workspace_root or Path("w:/artifactvirtual")
        self.build_dir = self.workspace_root / "workshop" / "_build"
        self.build_dir.mkdir(parents=True, exist_ok=True)

        # Build directories
        self.artifacts_dir = self.build_dir / "artifacts"
        self.logs_dir = self.build_dir / "logs"
        self.cache_dir = self.build_dir / "cache"
        self.temp_dir = self.build_dir / "temp"

        for dir_path in [
            self.artifacts_dir,
            self.logs_dir,
            self.cache_dir,
            self.temp_dir,
        ]:
            dir_path.mkdir(exist_ok=True)

        self.db_path = self.build_dir / "builds.db"
        self.logger = self._setup_logging()

        # Build templates
        self.build_templates = {
            "python": {
                "dependencies": ["pip", "setuptools", "wheel"],
                "build_steps": [
                    {
                        "name": "install_dependencies",
                        "command": "pip install -r requirements.txt",
                    },
                    {"name": "run_tests", "command": "python -m pytest"},
                    {
                        "name": "build_package",
                        "command": "python setup.py sdist bdist_wheel",
                    },
                    {"name": "security_scan", "command": "bandit -r src/"},
                ],
                "artifacts": ["dist/*.whl", "dist/*.tar.gz"],
            },
            "javascript": {
                "dependencies": ["npm"],
                "build_steps": [
                    {"name": "install_dependencies", "command": "npm install"},
                    {"name": "run_linting", "command": "npm run lint"},
                    {"name": "run_tests", "command": "npm test"},
                    {"name": "build_production", "command": "npm run build"},
                ],
                "artifacts": ["dist/*", "build/*"],
            },
            "docker": {
                "dependencies": ["docker"],
                "build_steps": [
                    {
                        "name": "build_image",
                        "command": "docker build -t {project_name}:{version} .",
                    },
                    {
                        "name": "security_scan",
                        "command": "docker scan {project_name}:{version}",
                    },
                    {
                        "name": "push_image",
                        "command": "docker push {project_name}:{version}",
                    },
                ],
                "artifacts": ["docker_image"],
            },
        }

        self._init_database()

    def _setup_logging(self) -> logging.Logger:
        """Setup build system logging"""
        logger = logging.getLogger("BuildAutomation")
        logger.setLevel(logging.INFO)

        handler = logging.FileHandler(self.logs_dir / "build_system.log")
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        return logger

    def _init_database(self):
        """Initialize build database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS builds (
                build_id TEXT PRIMARY KEY,
                project_name TEXT NOT NULL,
                version TEXT NOT NULL,
                build_type TEXT,
                status TEXT NOT NULL,
                start_time TIMESTAMP,
                end_time TIMESTAMP,
                duration REAL,
                artifacts TEXT,
                logs TEXT,
                error_message TEXT,
                configuration TEXT
            )
        """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS deployments (
                deployment_id TEXT PRIMARY KEY,
                build_id TEXT NOT NULL,
                target_environment TEXT NOT NULL,
                deployment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT NOT NULL,
                deployment_url TEXT,
                rollback_info TEXT,
                FOREIGN KEY (build_id) REFERENCES builds (build_id)
            )
        """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS build_cache (
                cache_key TEXT PRIMARY KEY,
                cache_value TEXT,
                created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expiry_time TIMESTAMP
            )
        """
        )

        conn.commit()
        conn.close()

    async def create_build_configuration(
        self, project_spec: Dict[str, Any]
    ) -> BuildConfiguration:
        """Create build configuration from project specification"""
        project_name = project_spec["name"]
        version = project_spec.get("version", "1.0.0")
        build_type = project_spec.get("build_type", "python")

        source_path = self.workspace_root / project_spec.get("source_path", ".")
        output_path = self.artifacts_dir / project_name / version
        output_path.mkdir(parents=True, exist_ok=True)

        # Get template for build type
        template = self.build_templates.get(build_type, self.build_templates["python"])

        # Customize build steps
        build_steps = []
        for step in template["build_steps"]:
            customized_step = {
                "name": step["name"],
                "command": step["command"].format(
                    project_name=project_name, version=version
                ),
            }
            build_steps.append(customized_step)

        # Parse deployment targets
        deployment_targets = []
        for target in project_spec.get("deployment_targets", ["development"]):
            deployment_targets.append(DeploymentTarget(target))

        return BuildConfiguration(
            project_name=project_name,
            version=version,
            build_type=build_type,
            source_path=source_path,
            output_path=output_path,
            dependencies=template["dependencies"],
            build_steps=build_steps,
            deployment_targets=deployment_targets,
            environment_variables=project_spec.get("environment_variables", {}),
            artifacts=template["artifacts"],
        )

    async def execute_build(self, configuration: BuildConfiguration) -> BuildResult:
        """Execute build pipeline"""
        import uuid

        build_id = str(uuid.uuid4())
        start_time = datetime.now()

        self.logger.info(f"Starting build {build_id} for {configuration.project_name}")

        # Create build-specific log file
        build_log_file = self.logs_dir / f"build_{build_id}.log"
        build_logs = []

        try:
            # Setup build environment
            await self._setup_build_environment(configuration, build_logs)

            # Execute build steps
            for step in configuration.build_steps:
                step_result = await self._execute_build_step(
                    step, configuration, build_logs
                )

                if not step_result["success"]:
                    raise Exception(
                        f"Build step '{step['name']}' failed: {step_result['error']}"
                    )

            # Collect artifacts
            artifacts = await self._collect_artifacts(configuration, build_logs)

            # Create build archive
            archive_path = await self._create_build_archive(
                configuration, artifacts, build_id
            )

            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()

            # Store build logs
            with open(build_log_file, "w") as f:
                f.write("\n".join(build_logs))

            build_result = BuildResult(
                build_id=build_id,
                project_name=configuration.project_name,
                version=configuration.version,
                status=BuildStatus.SUCCESS,
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                artifacts=[str(archive_path)] + artifacts,
                logs="\n".join(build_logs),
                error_message=None,
            )

            # Store in database
            self._store_build_result(build_result, configuration)

            self.logger.info(f"Build {build_id} completed successfully")

            return build_result

        except Exception as e:
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()

            error_message = str(e)
            build_logs.append(f"BUILD FAILED: {error_message}")

            # Store build logs
            with open(build_log_file, "w") as f:
                f.write("\n".join(build_logs))

            build_result = BuildResult(
                build_id=build_id,
                project_name=configuration.project_name,
                version=configuration.version,
                status=BuildStatus.FAILED,
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                artifacts=[],
                logs="\n".join(build_logs),
                error_message=error_message,
            )

            # Store in database
            self._store_build_result(build_result, configuration)

            self.logger.error(f"Build {build_id} failed: {error_message}")

            return build_result

    async def _setup_build_environment(
        self, configuration: BuildConfiguration, build_logs: List[str]
    ):
        """Setup build environment"""
        build_logs.append("=== Setting up build environment ===")

        # Set environment variables
        import os

        for key, value in configuration.environment_variables.items():
            os.environ[key] = value
            build_logs.append(f"Set environment variable: {key}")

        # Create temporary working directory
        work_dir = self.temp_dir / configuration.project_name
        if work_dir.exists():
            shutil.rmtree(work_dir)

        # Copy source files
        shutil.copytree(configuration.source_path, work_dir)
        build_logs.append(f"Copied source files to {work_dir}")

        # Change to working directory
        os.chdir(work_dir)
        build_logs.append(f"Changed working directory to {work_dir}")

    async def _execute_build_step(
        self,
        step: Dict[str, Any],
        configuration: BuildConfiguration,
        build_logs: List[str],
    ) -> Dict[str, Any]:
        """Execute a single build step"""
        step_name = step["name"]
        command = step["command"]

        build_logs.append(f"=== Executing step: {step_name} ===")
        build_logs.append(f"Command: {command}")

        try:
            # Execute command
            process = await asyncio.create_subprocess_shell(
                command, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await process.communicate()

            # Log output
            if stdout:
                build_logs.append("STDOUT:")
                build_logs.append(stdout.decode("utf-8"))

            if stderr:
                build_logs.append("STDERR:")
                build_logs.append(stderr.decode("utf-8"))

            if process.returncode == 0:
                build_logs.append(f"Step {step_name} completed successfully")
                return {"success": True}
            else:
                error_msg = (
                    f"Step {step_name} failed with return code {process.returncode}"
                )
                build_logs.append(error_msg)
                return {"success": False, "error": error_msg}

        except Exception as e:
            error_msg = f"Exception in step {step_name}: {str(e)}"
            build_logs.append(error_msg)
            return {"success": False, "error": error_msg}

    async def _collect_artifacts(
        self, configuration: BuildConfiguration, build_logs: List[str]
    ) -> List[str]:
        """Collect build artifacts"""
        build_logs.append("=== Collecting artifacts ===")

        artifacts = []
        current_dir = Path.cwd()

        for artifact_pattern in configuration.artifacts:
            matching_files = list(current_dir.glob(artifact_pattern))

            for file_path in matching_files:
                if file_path.is_file():
                    # Copy to artifacts directory
                    dest_path = configuration.output_path / file_path.name
                    shutil.copy2(file_path, dest_path)
                    artifacts.append(str(dest_path))
                    build_logs.append(f"Collected artifact: {file_path.name}")

        build_logs.append(f"Total artifacts collected: {len(artifacts)}")
        return artifacts

    async def _create_build_archive(
        self, configuration: BuildConfiguration, artifacts: List[str], build_id: str
    ) -> Path:
        """Create build archive with all artifacts"""
        archive_name = (
            f"{configuration.project_name}-{configuration.version}-{build_id}.tar.gz"
        )
        archive_path = self.artifacts_dir / archive_name

        with tarfile.open(archive_path, "w:gz") as tar:
            # Add artifacts
            for artifact in artifacts:
                artifact_path = Path(artifact)
                if artifact_path.exists():
                    tar.add(artifact_path, arcname=artifact_path.name)

            # Add metadata
            metadata = {
                "build_id": build_id,
                "project_name": configuration.project_name,
                "version": configuration.version,
                "build_time": datetime.now().isoformat(),
                "artifacts": [Path(a).name for a in artifacts],
            }

            metadata_file = self.temp_dir / "build_metadata.json"
            with open(metadata_file, "w") as f:
                json.dump(metadata, f, indent=2)

            tar.add(metadata_file, arcname="build_metadata.json")

        return archive_path

    def _store_build_result(
        self, result: BuildResult, configuration: BuildConfiguration
    ):
        """Store build result in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO builds 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                result.build_id,
                result.project_name,
                result.version,
                configuration.build_type,
                result.status.value,
                result.start_time.isoformat(),
                result.end_time.isoformat() if result.end_time else None,
                result.duration,
                json.dumps(result.artifacts),
                result.logs,
                result.error_message,
                json.dumps(
                    {
                        "source_path": str(configuration.source_path),
                        "output_path": str(configuration.output_path),
                        "build_steps": configuration.build_steps,
                        "dependencies": configuration.dependencies,
                    }
                ),
            ),
        )

        conn.commit()
        conn.close()

    async def deploy_build(
        self, build_id: str, target: DeploymentTarget
    ) -> Dict[str, Any]:
        """Deploy build to target environment"""
        import uuid

        deployment_id = str(uuid.uuid4())

        self.logger.info(f"Deploying build {build_id} to {target.value}")

        try:
            # Get build information
            build_info = self._get_build_info(build_id)

            if not build_info:
                raise Exception(f"Build {build_id} not found")

            if build_info["status"] != BuildStatus.SUCCESS.value:
                raise Exception(f"Cannot deploy failed build {build_id}")

            # Execute deployment based on target
            deployment_result = await self._execute_deployment(
                build_info, target, deployment_id
            )

            # Store deployment record
            self._store_deployment_result(
                deployment_id, build_id, target, deployment_result
            )

            self.logger.info(f"Deployment {deployment_id} completed successfully")

            return {
                "deployment_id": deployment_id,
                "build_id": build_id,
                "target": target.value,
                "status": "success",
                "deployment_url": deployment_result.get("url"),
                "timestamp": datetime.now().isoformat(),
            }

        except Exception as e:
            error_message = str(e)

            # Store failed deployment record
            self._store_deployment_result(
                deployment_id,
                build_id,
                target,
                {"status": "failed", "error": error_message},
            )

            self.logger.error(f"Deployment {deployment_id} failed: {error_message}")

            return {
                "deployment_id": deployment_id,
                "build_id": build_id,
                "target": target.value,
                "status": "failed",
                "error": error_message,
                "timestamp": datetime.now().isoformat(),
            }

    async def _execute_deployment(
        self, build_info: Dict[str, Any], target: DeploymentTarget, deployment_id: str
    ) -> Dict[str, Any]:
        """Execute deployment to specific target"""
        if target == DeploymentTarget.DEVELOPMENT:
            return await self._deploy_to_development(build_info, deployment_id)
        elif target == DeploymentTarget.STAGING:
            return await self._deploy_to_staging(build_info, deployment_id)
        elif target == DeploymentTarget.PRODUCTION:
            return await self._deploy_to_production(build_info, deployment_id)
        else:
            raise Exception(f"Unsupported deployment target: {target.value}")

    async def _deploy_to_development(
        self, build_info: Dict[str, Any], deployment_id: str
    ) -> Dict[str, Any]:
        """Deploy to development environment"""
        # Simulate development deployment
        await asyncio.sleep(2)

        return {
            "status": "success",
            "url": f"http://dev.artifact.local/{build_info['project_name']}",
            "environment": "development",
        }

    async def _deploy_to_staging(
        self, build_info: Dict[str, Any], deployment_id: str
    ) -> Dict[str, Any]:
        """Deploy to staging environment"""
        # Simulate staging deployment
        await asyncio.sleep(5)

        return {
            "status": "success",
            "url": f"https://staging.artifact.com/{build_info['project_name']}",
            "environment": "staging",
        }

    async def _deploy_to_production(
        self, build_info: Dict[str, Any], deployment_id: str
    ) -> Dict[str, Any]:
        """Deploy to production environment"""
        # Simulate production deployment with additional checks
        await asyncio.sleep(10)

        # Production deployment would include:
        # - Blue-green deployment
        # - Health checks
        # - Monitoring setup
        # - Rollback preparation

        return {
            "status": "success",
            "url": f"https://artifact.com/{build_info['project_name']}",
            "environment": "production",
            "rollback_info": {
                "previous_version": "1.0.0",
                "rollback_command": f"kubectl rollout undo deployment/{build_info['project_name']}",
            },
        }

    def _get_build_info(self, build_id: str) -> Optional[Dict[str, Any]]:
        """Get build information from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM builds WHERE build_id = ?", (build_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            return {
                "build_id": row[0],
                "project_name": row[1],
                "version": row[2],
                "build_type": row[3],
                "status": row[4],
                "artifacts": json.loads(row[8]) if row[8] else [],
            }

        return None

    def _store_deployment_result(
        self,
        deployment_id: str,
        build_id: str,
        target: DeploymentTarget,
        result: Dict[str, Any],
    ):
        """Store deployment result in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO deployments 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
            (
                deployment_id,
                build_id,
                target.value,
                datetime.now().isoformat(),
                result.get("status", "unknown"),
                result.get("url"),
                json.dumps(result.get("rollback_info", {})),
            ),
        )

        conn.commit()
        conn.close()

    def get_build_history(
        self, project_name: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get build history"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        if project_name:
            cursor.execute(
                """
                SELECT * FROM builds 
                WHERE project_name = ? 
                ORDER BY start_time DESC LIMIT 20
            """,
                (project_name,),
            )
        else:
            cursor.execute(
                """
                SELECT * FROM builds 
                ORDER BY start_time DESC LIMIT 20
            """
            )

        builds = []
        for row in cursor.fetchall():
            builds.append(
                {
                    "build_id": row[0],
                    "project_name": row[1],
                    "version": row[2],
                    "build_type": row[3],
                    "status": row[4],
                    "start_time": row[5],
                    "duration": row[7],
                    "artifacts_count": len(json.loads(row[8])) if row[8] else 0,
                }
            )

        conn.close()
        return builds


# CLI Interface
async def main():
    """CLI interface for build automation system"""
    import sys

    build_system = BuildAutomationSystem()

    if len(sys.argv) < 2:
        print("Usage: python build_automation.py [build|deploy|history]")
        return

    command = sys.argv[1]

    if command == "build":
        # Example build configuration
        project_spec = {
            "name": "example_project",
            "version": "1.0.0",
            "build_type": "python",
            "source_path": ".",
            "deployment_targets": ["development", "staging"],
            "environment_variables": {"ENVIRONMENT": "build", "DEBUG": "false"},
        }

        config = await build_system.create_build_configuration(project_spec)
        result = await build_system.execute_build(config)

        print(json.dumps(result.to_dict(), indent=2))

    elif command == "deploy":
        if len(sys.argv) < 4:
            print("Usage: python build_automation.py deploy <build_id> <target>")
            return

        build_id = sys.argv[2]
        target = DeploymentTarget(sys.argv[3])

        result = await build_system.deploy_build(build_id, target)
        print(json.dumps(result, indent=2))

    elif command == "history":
        project_name = sys.argv[2] if len(sys.argv) > 2 else None
        history = build_system.get_build_history(project_name)

        print("Build History:")
        for build in history:
            print(
                f"  {build['build_id'][:8]} - {build['project_name']} v{build['version']} - {build['status']}"
            )

    else:
        print(f"Unknown command: {command}")


if __name__ == "__main__":
    asyncio.run(main())
