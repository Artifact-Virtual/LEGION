#!/usr/bin/env python3
"""
Backend server startup script for the Enterprise Monitoring Dashboard
"""

import os
import sys
import subprocess


def start_server():
    """Start the FastAPI server with uvicorn"""
    try:
        # Change to backend directory
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(backend_dir)
        
        # Start uvicorn server
        cmd = [
            sys.executable, "-m", "uvicorn",
            "api.main:app",
            "--reload",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--log-level", "info"
        ]
        
        print("Starting Enterprise Monitoring Dashboard Backend...")
        print(f"Command: {' '.join(cmd)}")
        print("Server will be available at: http://localhost:8000")
        print("API Documentation at: http://localhost:8000/docs")
        print("Press Ctrl+C to stop the server")
        
        subprocess.run(cmd, check=False)
        
    except KeyboardInterrupt:
        print("\nShutting down server...")
    except subprocess.SubprocessError as e:
        print(f"Error starting server: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(start_server())
