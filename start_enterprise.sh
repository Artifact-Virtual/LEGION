#!/bin/bash
# 
# Unified Enterprise Startup Script (Bash Version)
# - Ensures proper virtual environment setup
# - Installs all dependencies (Python and Node)
# - Initializes databases and config
# - Starts backend_api.py and server.py
# - Starts the React dashboard (npm start)
#

set -e  # Exit on any error

ENTERPRISE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$ENTERPRISE_DIR/venv"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}🔧${NC} $1"
}

# Check if we're in a virtual environment
is_venv_active() {
    if [[ -n "$VIRTUAL_ENV" ]] || [[ -n "$CONDA_DEFAULT_ENV" ]]; then
        return 0  # True - in venv
    else
        return 1  # False - not in venv
    fi
}

# Create virtual environment if it doesn't exist
create_venv() {
    if [[ ! -d "$VENV_DIR" ]]; then
        echo -e "${BLUE}📦${NC} Creating virtual environment at $VENV_DIR..."
        python3 -m venv "$VENV_DIR"
        if [[ $? -eq 0 ]]; then
            print_status "Virtual environment created successfully"
        else
            print_error "Failed to create virtual environment"
            exit 1
        fi
    else
        print_status "Virtual environment already exists"
    fi
}

# Activate virtual environment and restart script
activate_venv_and_restart() {
    local venv_python="$VENV_DIR/bin/python"
    
    if [[ ! -f "$venv_python" ]]; then
        print_error "Virtual environment Python not found at $venv_python"
        exit 1
    fi
    
    echo -e "${BLUE}🔄${NC} Restarting script in virtual environment..."
    
    # Set environment variable and restart with venv Python
    export ENTERPRISE_VENV_ACTIVE=1
    exec "$venv_python" "$ENTERPRISE_DIR/start_enterprise.py" "$@"
}

# Kill processes on specific ports
kill_port_processes() {
    local port=$1
    echo "   Killing processes on port $port..."
    
    # Try different methods to kill processes on the port
    if command -v fuser &> /dev/null; then
        fuser -k "${port}/tcp" 2>/dev/null || true
    elif command -v lsof &> /dev/null; then
        local pid=$(lsof -ti tcp:$port 2>/dev/null)
        if [[ -n "$pid" ]]; then
            kill -9 $pid 2>/dev/null || true
        fi
    elif command -v netstat &> /dev/null; then
        local pid=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1)
        if [[ -n "$pid" ]] && [[ "$pid" != "-" ]]; then
            kill -9 $pid 2>/dev/null || true
        fi
    fi
}

# Main execution
main() {
    echo
    echo "=== ENTERPRISE SYSTEM STARTUP ==="
    echo
    
    # Check if we're already in the correct venv
    if [[ "$ENTERPRISE_VENV_ACTIVE" != "1" ]]; then
        if is_venv_active; then
            print_warning "Already running in a virtual environment!"
            echo "   Please deactivate the current venv and run this script again."
            echo "   Command: deactivate"
            exit 1
        else
            print_info "Setting up virtual environment..."
            create_venv
            activate_venv_and_restart "$@"
        fi
    fi
    
    print_status "Running in Enterprise virtual environment"
    
    # Kill processes on ports 5001 and 3000 before starting
    echo -e "${RED}🔪${NC} Killing processes on ports 5001 and 3000..."
    kill_port_processes "5001"
    kill_port_processes "3000"
    print_status "Port cleanup completed"
    echo
    
    # Activate the virtual environment for the rest of the script
    source "$VENV_DIR/bin/activate"
    
    # 1. Run install.py (handles all dependency installation and dashboard setup)
    local install_py="$ENTERPRISE_DIR/install.py"
    if [[ -f "$install_py" ]]; then
        echo -e "${BLUE}🛠️${NC} Running install.py for full environment and dashboard setup..."
        if python "$install_py"; then
            print_status "Installation completed successfully"
        else
            print_error "install.py failed"
            exit 1
        fi
    else
        print_error "install.py not found. Cannot continue startup."
        exit 1
    fi
    
    # 2. Start backend_api.py
    local backend_api="$ENTERPRISE_DIR/backend_api.py"
    if [[ -f "$backend_api" ]]; then
        echo -e "${BLUE}🌐${NC} Starting backend_api.py on port 5001..."
        python "$backend_api" &
        print_status "Backend API started"
    else
        print_warning "backend_api.py not found, skipping API backend"
    fi
    
    # 3. Start server.py
    local server_py="$ENTERPRISE_DIR/server.py"
    if [[ -f "$server_py" ]]; then
        echo -e "${BLUE}🚀${NC} Starting server.py..."
        python "$server_py" &
        print_status "Server started"
    else
        print_warning "server.py not found, skipping server"
    fi
    
    # 4. Start social media automation service (optional)
    local social_service="$ENTERPRISE_DIR/communication/social_media_service.py"
    if [[ -f "$social_service" ]]; then
        echo -e "${BLUE}📱${NC} Starting Social Media Automation Service..."
        python "$social_service" &
        print_status "Social Media Service started"
    else
        print_warning "social_media_service.py not found in communication/, skipping social media automation"
    fi
    
    # 5. Start dashboard (npm start in reporting/dashboards)
    local dashboards_dir="$ENTERPRISE_DIR/reporting/dashboards"
    if [[ -d "$dashboards_dir" ]]; then
        echo -e "${BLUE}🖥️${NC} Starting React dashboard (npm start in $dashboards_dir)..."
        cd "$dashboards_dir"
        npm start &
        cd "$ENTERPRISE_DIR"
        print_status "Dashboard started"
    else
        print_warning "Dashboard directory not found, skipping React dashboard"
    fi
    
    echo
    print_status "All systems started. See logs and dashboard for status."
    echo
    
    # Keep the script running and show status
    echo "Press Ctrl+C to stop all services..."
    
    # Wait for user input or signals
    trap 'echo; echo "Stopping all services..."; kill $(jobs -p) 2>/dev/null || true; exit 0' SIGINT SIGTERM
    
    # Monitor services
    while true; do
        sleep 30
        echo "$(date): Enterprise services running... (Press Ctrl+C to stop)"
    done
}

# Run main function with all arguments
main "$@"
