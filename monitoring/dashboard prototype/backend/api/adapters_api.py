# Adapter API endpoints for the monitoring dashboard

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.adapters.adapter_manager import AdapterManager
from backend.adapters.base import AdapterConfig

router = APIRouter()

# Global adapter manager instance
adapter_manager = AdapterManager()


@router.get("/api/adapters", response_model=List[str])
async def list_adapters():
    """List all registered adapter names"""
    return await adapter_manager.list_adapters()


@router.get("/api/adapters/status", response_model=Dict[str, Dict[str, Any]])
async def get_adapters_status():
    """Get status of all adapters"""
    return await adapter_manager.get_adapter_status()


@router.post("/api/adapters", response_model=dict)
async def register_adapter(config: AdapterConfig):
    """Register a new adapter"""
    success = await adapter_manager.register_adapter(config)
    if not success:
        raise HTTPException(
            status_code=400,
            detail="Failed to register adapter"
        )
    return {"status": "registered", "name": config.name}


@router.delete("/api/adapters/{name}")
async def unregister_adapter(name: str):
    """Unregister an adapter"""
    success = await adapter_manager.unregister_adapter(name)
    if not success:
        raise HTTPException(status_code=404, detail="Adapter not found")
    return {"status": "unregistered", "name": name}


@router.get("/api/adapters/{name}/test")
async def test_adapter(name: str):
    """Test adapter connection"""
    adapter = await adapter_manager.get_adapter(name)
    if not adapter:
        raise HTTPException(status_code=404, detail="Adapter not found")
    
    try:
        result = await adapter.test_connection()
        return {"adapter": name, "connected": result}
    except Exception as e:
        return {"adapter": name, "connected": False, "error": str(e)}
