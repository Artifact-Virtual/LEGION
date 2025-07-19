# System-wide API endpoints

from fastapi import APIRouter, HTTPException
from datetime import datetime
from backend.api.adapters_api import adapter_manager

router = APIRouter()


@router.get("/api/system/status")
async def get_system_status():
    """Get overall system status"""
    try:
        # Get adapter status
        adapters_status = await adapter_manager.get_adapter_status()
        active_adapters = sum(
            1 for status in adapters_status.values()
            if status.get("connected", False)
        )
        total_adapters = len(adapters_status)
        
        # Get data counts
        metrics = await adapter_manager.get_all_metrics()
        logs = await adapter_manager.get_all_logs(10)
        
        total_metrics = sum(
            len(adapter_metrics)
            for adapter_metrics in metrics.values()
        )
        total_logs = sum(
            len(adapter_logs)
            for adapter_logs in logs.values()
        )
        
        # Calculate health score
        adapter_health = ((active_adapters / total_adapters * 100)
                          if total_adapters > 0 else 0)
        data_health = min(100, (total_metrics + total_logs) / 10 * 100)
        overall_health = (adapter_health + data_health) / 2
        
        status = ("healthy" if overall_health > 75 else
                  "warning" if overall_health > 50 else "critical")
        
        return {
            "timestamp": datetime.now().isoformat(),
            "status": status,
            "health_score": round(overall_health, 2),
            "adapters": {
                "total": total_adapters,
                "active": active_adapters,
                "health": round(adapter_health, 2)
            },
            "data": {
                "metrics_count": total_metrics,
                "logs_count": total_logs,
                "health": round(data_health, 2)
            }
        }
    except Exception as e:
        return {
            "timestamp": datetime.now().isoformat(),
            "status": "error",
            "error": str(e)
        }


@router.get("/api/system/info")
async def get_system_info():
    """Get system information"""
    return {
        "name": "Enterprise Monitoring Dashboard",
        "version": "1.0.0",
        "description": "Next-generation monitoring and automation platform",
        "api_version": "v1",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "adapters": "/api/adapters",
            "metrics": "/api/metrics",
            "logs": "/api/logs",
            "reports": "/api/reports",
            "automation": "/api/automation",
            "registry": "/api/registry"
        },
        "features": [
            "Dynamic adapter management",
            "Real-time metrics collection",
            "Log aggregation and search",
            "Automated reporting",
            "Task automation and scheduling",
            "Health monitoring"
        ]
    }


@router.get("/api/system/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "uptime": "running"
    }


@router.get("/api/system/metrics")
async def get_system_metrics():
    """Get system-level metrics"""
    try:
        adapters_status = await adapter_manager.get_adapter_status()
        metrics = await adapter_manager.get_all_metrics()
        
        # Calculate various system metrics
        adapter_counts = {
            "total": len(adapters_status),
            "connected": sum(1 for s in adapters_status.values() 
                           if s.get("connected", False)),
            "enabled": sum(1 for s in adapters_status.values() 
                         if s.get("enabled", False))
        }
        
        metric_counts = {}
        for adapter_name, adapter_metrics in metrics.items():
            metric_counts[adapter_name] = len(adapter_metrics)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "adapters": adapter_counts,
            "metrics_per_adapter": metric_counts,
            "total_metrics": sum(metric_counts.values()),
            "system_load": {
                "adapters_utilization": (
                    adapter_counts["connected"] / 
                    max(adapter_counts["total"], 1) * 100
                ),
                "data_flow": sum(metric_counts.values())
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, 
                          detail=f"Failed to get system metrics: {str(e)}")
