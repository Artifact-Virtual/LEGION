# API Registry (Prototype)

from typing import List, Dict, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class APIConfig(BaseModel):
    name: str
    url: str
    enabled: bool = True
    standby: bool = False
    config: Optional[dict] = None

# In-memory registry for prototype
api_registry: Dict[str, APIConfig] = {}

@router.get("/api/registry", response_model=List[APIConfig])
def list_apis():
    return list(api_registry.values())

@router.post("/api/registry", response_model=APIConfig)
def add_api(api: APIConfig):
    if api.name in api_registry:
        raise HTTPException(status_code=400, detail="API already exists")
    api_registry[api.name] = api
    return api

@router.put("/api/registry/{name}", response_model=APIConfig)
def update_api(name: str, api: APIConfig):
    if name not in api_registry:
        raise HTTPException(status_code=404, detail="API not found")
    api_registry[name] = api
    return api

@router.delete("/api/registry/{name}")
def remove_api(name: str):
    if name not in api_registry:
        raise HTTPException(status_code=404, detail="API not found")
    del api_registry[name]
    return {"status": "removed"}

@router.post("/api/registry/{name}/standby")
def standby_api(name: str):
    if name not in api_registry:
        raise HTTPException(status_code=404, detail="API not found")
    api = api_registry[name]
    api.standby = True
    api.enabled = False
    api_registry[name] = api
    return api

@router.post("/api/registry/{name}/enable")
def enable_api(name: str):
    if name not in api_registry:
        raise HTTPException(status_code=404, detail="API not found")
    api = api_registry[name]
    api.standby = False
    api.enabled = True
    api_registry[name] = api
    return api
