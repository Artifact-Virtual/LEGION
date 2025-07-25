#!/usr/bin/env python4
"""
Legion Enterprise System - Single Step Startup Script
- Ensures proper virtual environment setup
- Installs all dependencies (Python and Node.js)
- Initializes databases and configuration
- Starts backend API server
- Installs and starts the React dashboard from root directory
"""

import sys
import subprocess
import os
import time
import shutil
from pathlib import Path

ENTERPRISE_DIR = Path(__file__).parent.resolve()
VENV_DIR = ENTERPRISE_DIR / "venv"
PACKAGE_JSON = ENTERPRISE_DIR / "package.json"
NODE_MODULES = ENTERPRISE_DIR / "node_modules"

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


def check_node_installed():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(['node', '--version'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js found: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ Node.js not found. Please install Node.js first:")
    print("   https://nodejs.org/")
    return False


def check_npm_installed():
    """Check if npm is installed"""
    try:
        result = subprocess.run(['npm', '--version'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm found: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ npm not found. Please install npm.")
    return False


def install_python_dependencies():
    """Install Python dependencies"""
    requirements_file = ENTERPRISE_DIR / "requirements.txt"
    if requirements_file.exists():
        print("📦 Installing Python dependencies...")
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "-r", 
                str(requirements_file)
            ])
            print("✅ Python dependencies installed")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install Python dependencies: {e}")
            return False
    else:
        print("⚠️ No requirements.txt found, skipping Python deps")
        return True


def install_node_dependencies():
    """Install Node.js dependencies if package.json exists"""
    if not PACKAGE_JSON.exists():
        print("❌ package.json not found in root directory")
        return False
    
    print("📦 Installing Node.js dependencies...")
    try:
        # Remove node_modules if it exists to ensure clean install
        if NODE_MODULES.exists():
            print("🧹 Cleaning existing node_modules...")
            shutil.rmtree(NODE_MODULES)
        
        subprocess.check_call(['npm', 'install'], cwd=ENTERPRISE_DIR)
        print("✅ Node.js dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install Node.js dependencies: {e}")
        return False


def kill_existing_processes():
    """Kill processes on ports 3000 and 5001"""
    print("🔪 Cleaning up existing processes...")
    for port in ["3000", "5001"]:
        try:
            subprocess.run([
                "fuser", "-k", f"{port}/tcp"
            ], check=False, capture_output=True)
            print(f"   Cleaned port {port}")
        except (subprocess.SubprocessError, OSError):
            pass
    print("✅ Process cleanup completed")


def start_backend():
    """Start the backend API server"""
    backend_api = ENTERPRISE_DIR / "backend_api.py"
    if not backend_api.exists():
        print("❌ backend_api.py not found")
        return False
    
    print("🌐 Starting backend API server on port 5001...")
    try:
        # Start backend in background
        process = subprocess.Popen([
            sys.executable, str(backend_api)
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Give backend a moment to start
        time.sleep(3)
        
        # Check if process is still running
        if process.poll() is None:
            print("✅ Backend API server started successfully")
            return True
        else:
            stdout, stderr = process.communicate()
            print(f"❌ Backend failed to start: {stderr.decode()}")
            return False
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return False


def start_dashboard():
    """Start the React dashboard"""
    if not PACKAGE_JSON.exists():
        print("❌ package.json not found, cannot start dashboard")
        return False
    
    print("🖥️ Starting Legion Enterprise Dashboard...")
    try:
        # Start React development server
        subprocess.Popen(['npm', 'start'], cwd=ENTERPRISE_DIR)
        print("✅ Dashboard startup initiated")
        print("🌐 Dashboard will be available at: http://localhost:3000")
        return True
    except Exception as e:
        print(f"❌ Failed to start dashboard: {e}")
        return False


if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 LEGION ENTERPRISE SYSTEM STARTUP")
    print("="*50 + "\n")
    
    # Check if we're already in the correct venv
    venv_active = is_venv_active()
    in_enterprise_venv = os.environ.get('ENTERPRISE_VENV_ACTIVE') == '1'
    
    if not in_enterprise_venv:
        if venv_active:
            print("⚠️ Already running in a virtual environment!")
            print("   Please deactivate and run this script again.")
            print("   Command: deactivate")
            sys.exit(1)
        else:
            print("🔧 Setting up virtual environment...")
            create_venv()
            activate_venv_and_restart()
    
    print("✅ Running in Enterprise virtual environment")
    
    # Step 1: Clean up existing processes
    kill_existing_processes()
    
    # Step 2: Check system requirements
    print("\n📋 Checking system requirements...")
    if not check_node_installed() or not check_npm_installed():
        sys.exit(1)
    
    # Step 3: Install Python dependencies
    print("\n🐍 Setting up Python environment...")
    if not install_python_dependencies():
        print("❌ Failed to install Python dependencies")
        sys.exit(1)
    
    # Step 4: Install Node.js dependencies (check if needed)
    print("\n📦 Setting up Node.js environment...")
    if not NODE_MODULES.exists() or not (NODE_MODULES / ".bin").exists():
        print("� Node modules not found or incomplete, installing...")
        if not install_node_dependencies():
            print("❌ Failed to install Node.js dependencies")
            sys.exit(1)
    else:
        print("✅ Node.js dependencies already installed")
    
    # Step 5: Start backend API
    print("\n🌐 Starting backend services...")
    if not start_backend():
        print("❌ Failed to start backend services")
        sys.exit(1)
    
    # Step 6: Start dashboard
    print("\n🖥️ Starting dashboard...")
    if not start_dashboard():
        print("❌ Failed to start dashboard")
        sys.exit(1)
    
    print("\n" + "="*50)
    print("✅ LEGION ENTERPRISE SYSTEM STARTED SUCCESSFULLY")
    print("="*50)
    print("\n🌐 Services:")
    print("   • Backend API: http://localhost:5001")
    print("   • Dashboard:   http://localhost:3000")
    print("\n🔧 To stop all services, run: ./kill_enterprise.sh")
    print("📊 Dashboard should open automatically in your browser")
    print("\n⏳ Please wait for dashboard compilation to complete...")
    print("="*50 + "\n")
