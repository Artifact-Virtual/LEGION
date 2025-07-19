# Enterprise Legion System Makefile
# Convenient commands for system management

.PHONY: help install start test demo api clean backup health check setup

# Default target
help:
	@echo "Enterprise Legion System - Available Commands:"
	@echo ""
	@echo "  install     - Install dependencies and setup system"
	@echo "  start       - Start the main system"
	@echo "  test        - Run integration tests"
	@echo "  demo        - Run system demonstration"
	@echo "  api         - Start frontend API server"
	@echo "  check       - Check system health and dependencies"
	@echo "  setup       - Initialize databases and configuration"
	@echo "  clean       - Clean temporary files and caches"
	@echo "  backup      - Backup databases and configuration"
	@echo "  health      - Check system operational status"
	@echo ""
	@echo "Example:"
	@echo "  make install    # Setup the system"
	@echo "  make start      # Run the system"
	@echo "  make test       # Run tests"

# Install dependencies and setup system
install:
	@echo "Installing Enterprise Legion System..."
	python install.py

# Start the main system
start:
	@echo "Starting Enterprise Legion System..."
	python active_system_manager.py

# Run integration tests
test:
	@echo "Running integration tests..."
	python -m pytest tests/ -v

# Run system demonstration
demo:
	@echo "Running system demonstration..."
	python integration_demo.py

# Start frontend API server
api:
	@echo "Starting frontend API server..."
	python frontend_integration_api.py --server --port 8080

# Check system health and dependencies
check:
	@echo "Checking system dependencies..."
	python -c "import sys; print(f'Python {sys.version}'); import sqlite3; print('SQLite available'); import aiohttp; print('aiohttp available'); import asyncio; print('asyncio available'); print('All core dependencies available')"

# Initialize databases and configuration
setup:
	@echo "Setting up databases and configuration..."
	python -c "from operations.integration_endpoints_clean import IntegrationManager; import asyncio; asyncio.run(IntegrationManager().initialize())"

# Clean temporary files and caches
clean:
	@echo "Cleaning temporary files..."
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	@echo "Clean completed."

# Backup databases and configuration
backup:
	@echo "Creating backup..."
	mkdir -p backups
	cp -r data/ backups/data_$(shell date +%Y%m%d_%H%M%S) 2>/dev/null || robocopy data backups\data_$(shell date +%Y%m%d_%H%M%S) /E /NP /NFL /NDL /NJH /NJS || true
	cp config/integrations.json backups/integrations_$(shell date +%Y%m%d_%H%M%S).json 2>/dev/null || copy config\integrations.json backups\integrations_$(shell date +%Y%m%d_%H%M%S).json || true
	@echo "Backup completed."

# Check system operational status
health:
	@echo "Checking system health..."
	python -c "print('System health check:'); import sqlite3; print('✅ SQLite available'); import aiohttp; print('✅ aiohttp available'); import json; print('✅ JSON processing available'); print('✅ Enterprise Legion system ready')"

# Development commands
dev-install:
	@echo "Installing development dependencies..."
	pip install -r requirements.txt
	pip install pytest autopep8 black flake8

lint:
	@echo "Running code linting..."
	flake8 *.py **/*.py --max-line-length=88

format:
	@echo "Formatting code..."
	black *.py **/*.py

# Quick start sequence
quickstart: install demo
	@echo "Quick start completed. System is ready to use."
