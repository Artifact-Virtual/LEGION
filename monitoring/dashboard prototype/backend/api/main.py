# Main entry point for the backend API server

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.registry import registry_api
from backend.api import (adapters_api, metrics_api, logs_api,
                         reports_api, automation_api, system_api)

app = FastAPI(title="Dashboard Prototype Backend", version="0.1.0")

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


# Include all routers
app.include_router(registry_api.router)
app.include_router(adapters_api.router)
app.include_router(metrics_api.router)
app.include_router(logs_api.router)
app.include_router(reports_api.router)
app.include_router(automation_api.router)
app.include_router(system_api.router)
