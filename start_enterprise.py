#!/usr/bin/env python3
"""
Unified Enterprise Startup Script
- Installs all dependencies (Python and Node)
- Initializes databases and config
- Starts backend_api.py and server.py
- Starts the React dashboard (npm start)
"""

import sys
import subprocess
from pathlib import Path

ENTERPRISE_DIR = Path(__file__).parent.resolve()

if __name__ == "__main__":
    print("\n=== ENTERPRISE SYSTEM STARTUP ===\n")
    
    # Kill processes on ports 5001 and 3000 before starting
    print("🔪 Killing processes on ports 5001 and 3000...")
    for port in ["5001", "3000"]:
        try:
            print(f"   Killing processes on port {port}...")
            subprocess.run([
                "fuser", "-k", f"{port}/tcp"
            ], check=False, capture_output=True)
        except (subprocess.SubprocessError, OSError):
            pass  # Silently continue if port is not in use
    print("✅ Port cleanup completed\n")
    # 1. Run install.py (handles all dependency installation and dashboard setup)
    install_py = ENTERPRISE_DIR / "install.py"
    if install_py.exists():
        print("🛠️ Running install.py for full environment and dashboard setup...")
        try:
            subprocess.check_call([
                sys.executable, str(install_py)
            ])
        except subprocess.CalledProcessError as e:
            print(f"❌ install.py failed: {e}")
            sys.exit(1)
    else:
        print("❌ install.py not found. Cannot continue startup.")
        sys.exit(1)

    # 2. Start backend_api.py
    backend_api = ENTERPRISE_DIR / "backend_api.py"
    if backend_api.exists():
        print("🌐 Starting backend_api.py on port 5001...")
        subprocess.Popen([sys.executable, str(backend_api)])
    else:
        print("⚠️ backend_api.py not found, skipping API backend")

    # 3. Start server.py
    server_py = ENTERPRISE_DIR / "server.py"
    if server_py.exists():
        print("🚀 Starting server.py...")
        subprocess.Popen([sys.executable, str(server_py)])
    else:
        print("⚠️ server.py not found, skipping server")

    # 4. Start social media automation service (optional)
    social_service = (
        ENTERPRISE_DIR / "communication" / "social_media_service.py"
    )
    if social_service.exists():
        print("📱 Starting Social Media Automation Service...")
        subprocess.Popen([sys.executable, str(social_service)])
    else:
        print(
            "⚠️ social_media_service.py not found in communication/, "
            "skipping social media automation"
        )

    # 5. Start dashboard (npm start in reporting/dashboards)
    dashboards_dir = ENTERPRISE_DIR / "reporting" / "dashboards"
    print(f"🖥️ Starting React dashboard (npm start in {dashboards_dir})...")
    subprocess.Popen(["npm", "start"], cwd=dashboards_dir)

    print("\n✅ All systems started. See logs and dashboard for status.\n")
