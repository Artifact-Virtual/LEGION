# Automation API endpoints

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter()

# In-memory task storage for prototype
tasks: Dict[str, Dict[str, Any]] = {}


class AutomationTask(BaseModel):
    name: str
    type: str  # "script", "command", "alert", "maintenance"
    parameters: Dict[str, Any]
    schedule: Optional[str] = None  # cron-like schedule
    enabled: bool = True


class TaskExecution(BaseModel):
    task_id: str
    status: str  # "pending", "running", "completed", "failed"
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


# Task executions storage
executions: Dict[str, TaskExecution] = {}


@router.get("/api/automation/tasks")
async def list_tasks():
    """List all automation tasks"""
    return list(tasks.values())


@router.post("/api/automation/tasks")
async def create_task(task: AutomationTask):
    """Create a new automation task"""
    task_id = str(uuid.uuid4())
    task_data = task.model_dump()
    task_data["id"] = task_id
    task_data["created_at"] = datetime.now().isoformat()
    tasks[task_id] = task_data
    return task_data


@router.get("/api/automation/tasks/{task_id}")
async def get_task(task_id: str):
    """Get a specific automation task"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]


@router.put("/api/automation/tasks/{task_id}")
async def update_task(task_id: str, task: AutomationTask):
    """Update an automation task"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_data = task.model_dump()
    task_data["id"] = task_id
    task_data["updated_at"] = datetime.now().isoformat()
    tasks[task_id] = {**tasks[task_id], **task_data}
    return tasks[task_id]


@router.delete("/api/automation/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete an automation task"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    del tasks[task_id]
    return {"status": "deleted", "task_id": task_id}


@router.post("/api/automation/tasks/{task_id}/execute")
async def execute_task(task_id: str, background_tasks: BackgroundTasks):
    """Execute an automation task"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[task_id]
    if not task.get("enabled", False):
        raise HTTPException(status_code=400, detail="Task is disabled")
    
    execution_id = str(uuid.uuid4())
    execution = TaskExecution(
        task_id=task_id,
        status="pending",
        started_at=datetime.now().isoformat()
    )
    executions[execution_id] = execution
    
    # Add background task
    background_tasks.add_task(run_task_background, task, execution_id)
    
    return {"execution_id": execution_id, "status": "started"}


@router.get("/api/automation/executions")
async def list_executions():
    """List all task executions"""
    return [{"id": k, **v.model_dump()} for k, v in executions.items()]


@router.get("/api/automation/executions/{execution_id}")
async def get_execution(execution_id: str):
    """Get execution status and results"""
    if execution_id not in executions:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    execution = executions[execution_id]
    return {"id": execution_id, **execution.model_dump()}


async def run_task_background(task: Dict[str, Any], execution_id: str):
    """Background task runner"""
    execution = executions[execution_id]
    execution.status = "running"
    
    try:
        # Simulate task execution based on type
        task_type = task.get("type", "script")
        parameters = task.get("parameters", {})
        
        if task_type == "script":
            result = await execute_script_task(parameters)
        elif task_type == "command":
            result = await execute_command_task(parameters)
        elif task_type == "alert":
            result = await execute_alert_task(parameters)
        elif task_type == "maintenance":
            result = await execute_maintenance_task(parameters)
        else:
            raise ValueError(f"Unknown task type: {task_type}")
        
        execution.status = "completed"
        execution.result = result
        execution.completed_at = datetime.now().isoformat()
        
    except Exception as e:
        execution.status = "failed"
        execution.error = str(e)
        execution.completed_at = datetime.now().isoformat()


async def execute_script_task(parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a script-type task"""
    script = parameters.get("script", "")
    args = parameters.get("args", [])
    
    # Simulate script execution
    return {
        "script": script,
        "args": args,
        "output": f"Script '{script}' executed successfully",
        "exit_code": 0
    }


async def execute_command_task(parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a command-type task"""
    command = parameters.get("command", "")
    
    # Simulate command execution
    return {
        "command": command,
        "output": f"Command '{command}' executed successfully",
        "exit_code": 0
    }


async def execute_alert_task(parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute an alert-type task"""
    alert_type = parameters.get("alert_type", "email")
    message = parameters.get("message", "Alert triggered")
    recipients = parameters.get("recipients", [])
    
    # Simulate alert sending
    return {
        "alert_type": alert_type,
        "message": message,
        "recipients": recipients,
        "sent": True,
        "timestamp": datetime.now().isoformat()
    }


async def execute_maintenance_task(parameters: Dict[str, Any]) -> Dict:
    """Execute a maintenance-type task"""
    maintenance_type = parameters.get("maintenance_type", "cleanup")
    target = parameters.get("target", "system")
    
    # Simulate maintenance execution
    if maintenance_type == "cleanup":
        return {
            "maintenance_type": maintenance_type,
            "target": target,
            "cleaned_items": 42,
            "space_freed": "150MB"
        }
    elif maintenance_type == "restart":
        return {
            "maintenance_type": maintenance_type,
            "target": target,
            "restart_time": datetime.now().isoformat(),
            "status": "restarted"
        }
    else:
        return {
            "maintenance_type": maintenance_type,
            "target": target,
            "status": "completed"
        }


@router.get("/api/automation/health-check")
async def automation_health_check():
    """Check automation system health"""
    total_tasks = len(tasks)
    enabled_tasks = sum(
        1 for task in tasks.values()
        if task.get("enabled", False)
    )
    recent_executions = len([
        e for e in executions.values()
        if e.status in ["completed", "failed"]
    ])
    
    return {
        "timestamp": datetime.now().isoformat(),
        "total_tasks": total_tasks,
        "enabled_tasks": enabled_tasks,
        "recent_executions": recent_executions,
        "system_status": "healthy" if enabled_tasks > 0 else "idle"
    }
