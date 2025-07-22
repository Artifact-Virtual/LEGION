#!/usr/bin/env python3
"""
Unified Enterprise Startup Script
- Ensures proper virtual environment setup
- Installs all dependencies (Python and Node)
- Initializes databases and config
- Starts backend_api.py and server.py
- Starts the React dashboard (npm start)
"""

import sys
import subprocess
import os
from pathlib import Path

ENTERPRISE_DIR = Path(__file__).parent.resolve()
VENV_DIR = ENTERPRISE_DIR / "venv"

def is_venv_active():
    """Check if we're currently running inside a virtual environment"""
    return hasattr(sys, 'real_prefix') or (
        hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
    )

def create_venv():
    """Create virtual environment if it doesn't exist"""
    if not VENV_DIR.exists():
        print(f"📦 Creating virtual environment at {VENV_DIR}...")
        try:
            subprocess.check_call([
                sys.executable, "-m", "venv", str(VENV_DIR)
            ])
            print("✅ Virtual environment created successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to create virtual environment: {e}")
            sys.exit(1)
    else:
        print("✅ Virtual environment already exists")

def get_venv_python():
    """Get the path to the Python executable in the venv"""
    if os.name == 'nt':  # Windows
        return VENV_DIR / "Scripts" / "python.exe"
    else:  # Unix/Linux/macOS
        return VENV_DIR / "bin" / "python"

def activate_venv_and_restart():
    """Activate virtual environment and restart the script within it"""
    venv_python = get_venv_python()
    
    if not venv_python.exists():
        print(f"❌ Virtual environment Python not found at {venv_python}")
        sys.exit(1)
    
    print(f"🔄 Restarting script in virtual environment...")
    # Set environment variable to indicate we're in venv mode
    env = os.environ.copy()
    env['ENTERPRISE_VENV_ACTIVE'] = '1'
    
    # Restart the script using the venv Python
    subprocess.check_call([
        str(venv_python), str(Path(__file__).resolve())
    ] + sys.argv[1:], env=env)
    
    # Exit the original process
    sys.exit(0)

if __name__ == "__main__":
    print("\n=== ENTERPRISE SYSTEM STARTUP ===\n")
    
    # Check if we're already in the correct venv
    venv_active = is_venv_active()
    in_enterprise_venv = os.environ.get('ENTERPRISE_VENV_ACTIVE') == '1'
    
    if not in_enterprise_venv:
        if venv_active:
            print("⚠️ Already running in a virtual environment!")
            print("   Please deactivate the current venv and run this script again.")
            print("   Command: deactivate")
            sys.exit(1)
        else:
            print("🔧 Setting up virtual environment...")
            create_venv()
            activate_venv_and_restart()
    
    print("✅ Running in Enterprise virtual environment")
    print("✅ Running in Enterprise virtual environment")
    
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
            # Use the current Python executable (which is now the venv Python)
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
