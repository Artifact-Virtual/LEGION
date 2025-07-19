# Metrics API endpoints

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.api.adapters_api import adapter_manager

router = APIRouter()


@router.get("/api/metrics")
async def get_all_metrics():
    """Get metrics from all adapters"""
    return await adapter_manager.get_all_metrics()


@router.get("/api/metrics/{adapter_name}")
async def get_adapter_metrics(adapter_name: str):
    """Get metrics from a specific adapter"""
    adapter = await adapter_manager.get_adapter(adapter_name)
    if not adapter:
        raise HTTPException(status_code=404, detail="Adapter not found")
    
    try:
        metrics = await adapter.get_metrics()
        return {"adapter": adapter_name, "metrics": metrics}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get metrics: {str(e)}"
        )


@router.get("/api/metrics/search")
async def search_metrics(
    metric_name: Optional[str] = Query(None, 
                                     description="Filter by metric name"),
    source: Optional[str] = Query(None, description="Filter by source"),
    limit: int = Query(100, description="Limit number of results")
):
    """Search metrics across all adapters with filters"""
    all_metrics = await adapter_manager.get_all_metrics()
    
    # Flatten and filter metrics
    filtered_metrics = []
    for adapter_name, metrics in all_metrics.items():
        for metric in metrics:
            # Apply filters
            if metric_name and metric_name.lower() not in \
               metric.metric.lower():
                continue
            if source and source.lower() not in metric.source.lower():
                continue
            
            # Add adapter info to metric
            metric_dict = metric.model_dump()
            metric_dict["adapter"] = adapter_name
            filtered_metrics.append(metric_dict)
            
            if len(filtered_metrics) >= limit:
                break
        
        if len(filtered_metrics) >= limit:
            break
    
    return {
        "total": len(filtered_metrics),
        "metrics": filtered_metrics[:limit]
    }
