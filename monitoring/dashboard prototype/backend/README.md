# Enterprise Monitoring Dashboard - Backend

A comprehensive, modular, and extensible monitoring dashboard backend built with FastAPI. This system provides dynamic API/data source management, real-time metrics collection, log aggregation, automated reporting, and task automation capabilities.

## Features

### Core Components

- **Dynamic Adapter Management**: Register, manage, and monitor data sources dynamically
- **Real-time Metrics Collection**: Collect and aggregate metrics from multiple sources
- **Log Aggregation & Search**: Centralized log collection with powerful search capabilities
- **Automated Reporting**: Generate system health, performance, and custom reports
- **Task Automation**: Schedule and execute automation tasks with background processing
- **Health Monitoring**: Comprehensive system health monitoring and status reporting

## Running the Server

### Option 1: Using the startup script
```bash
python start_server.py
```

### Option 2: Direct uvicorn
```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### Server Endpoints
- **API Server**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

## API Endpoints Overview

- **System APIs** (`/api/system/`) - System status, health, and information
- **Adapter Management** (`/api/adapters/`) - Dynamic data source management
- **Metrics Collection** (`/api/metrics/`) - Real-time metrics from all sources
- **Log Management** (`/api/logs/`) - Centralized log aggregation and search
- **Reporting** (`/api/reports/`) - Automated report generation
- **Automation** (`/api/automation/`) - Task scheduling and execution
- **Registry Management** (`/api/registry/`) - API registry operations

See the full API documentation at http://localhost:8000/docs when running.
