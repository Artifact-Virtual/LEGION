# Logs API endpoints

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.api.adapters_api import adapter_manager

router = APIRouter()


@router.get("/api/logs")
async def get_all_logs(limit: int = Query(100, description="Limit logs")):
    """Get logs from all adapters"""
    return await adapter_manager.get_all_logs(limit)


@router.get("/api/logs/{adapter_name}")
async def get_adapter_logs(
    adapter_name: str,
    limit: int = Query(100, description="Limit number of logs")
):
    """Get logs from a specific adapter"""
    adapter = await adapter_manager.get_adapter(adapter_name)
    if not adapter:
        raise HTTPException(status_code=404, detail="Adapter not found")
    
    try:
        logs = await adapter.get_logs(limit)
        return {"adapter": adapter_name, "logs": logs}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get logs: {str(e)}"
        )


@router.get("/api/logs/search")
async def search_logs(
    query: Optional[str] = Query(None, description="Search query"),
    level: Optional[str] = Query(None, description="Log level filter"),
    source: Optional[str] = Query(None, description="Source filter"),
    limit: int = Query(100, description="Limit results")
):
    """Search logs across all adapters with filters"""
    # Get more logs to filter
    all_logs = await adapter_manager.get_all_logs(limit * 2)
    
    # Flatten and filter logs
    filtered_logs = []
    for adapter_name, logs in all_logs.items():
        for log in logs:
            # Apply filters
            if query and query.lower() not in str(log).lower():
                continue
            if level and log.get("level", "").lower() != level.lower():
                continue
            if source and log.get("source", "").lower() != source.lower():
                continue
            
            # Add adapter info to log
            log["adapter"] = adapter_name
            filtered_logs.append(log)
            
            if len(filtered_logs) >= limit:
                break
        
        if len(filtered_logs) >= limit:
            break
    
    return {
        "total": len(filtered_logs),
        "logs": filtered_logs[:limit]
    }
