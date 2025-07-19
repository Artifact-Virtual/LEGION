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
    # Kill any process using port 5001 before starting
    print("🔪 Killing any process using port 5001...")
    try:
        subprocess.run(["fuser", "-k", "5001/tcp"], check=False)
    except Exception as e:
        print(f"⚠️ Could not kill port 5001: {e}")
    print("\n=== ENTERPRISE SYSTEM STARTUP ===\n")
    # 1. Run install.py (handles all dependency installation and dashboard setup)
    install_py = ENTERPRISE_DIR / "install.py"
    if install_py.exists():
        print("🛠️ Running install.py for setup...")
        subprocess.check_call([sys.executable, str(install_py)])
    else:
        print("⚠️ install.py not found, skipping setup")

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
    social_service = ENTERPRISE_DIR / "communication" / "social_media_service.py"
    if social_service.exists():
        print("📱 Starting Social Media Automation Service...")
        subprocess.Popen([sys.executable, str(social_service)])
    else:
        print("⚠️ social_media_service.py not found in communication/, skipping social media automation")

    # 5. Start dashboard (npm start in reporting/dashboards)
    dashboards_dir = ENTERPRISE_DIR / "reporting" / "dashboards"
    print(f"🖥️ Starting React dashboard (npm start in {dashboards_dir})...")
    subprocess.Popen(["npm", "start"], cwd=dashboards_dir)

    print("\n✅ All systems started. See logs and dashboard for status.\n")
