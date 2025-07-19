# Reports API endpoints

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime
from backend.api.adapters_api import adapter_manager

router = APIRouter()


@router.get("/api/reports/system-health")
async def get_system_health():
    """Generate system health report"""
    adapters_status = await adapter_manager.get_adapter_status()
    metrics = await adapter_manager.get_all_metrics()
    
    # Count active/inactive adapters
    active_adapters = sum(
        1 for status in adapters_status.values()
        if status.get("connected", False)
    )
    total_adapters = len(adapters_status)
    
    # Count total metrics
    total_metrics = sum(
        len(adapter_metrics)
        for adapter_metrics in metrics.values()
    )
    
    return {
        "timestamp": datetime.now().isoformat(),
        "adapters": {
            "total": total_adapters,
            "active": active_adapters,
            "inactive": total_adapters - active_adapters
        },
        "metrics": {
            "total_count": total_metrics,
            "sources": list(metrics.keys())
        },
        "health_score": (
            (active_adapters / total_adapters * 100)
            if total_adapters > 0 else 0
        )
    }


@router.get("/api/reports/metrics-summary")
async def get_metrics_summary(
    hours: int = Query(24, description="Hours to include in summary")
):
    """Generate metrics summary report"""
    metrics = await adapter_manager.get_all_metrics()
    
    summary = {}
    for adapter_name, adapter_metrics in metrics.items():
        # Group metrics by name
        metric_groups = {}
        for metric in adapter_metrics:
            metric_name = metric.metric
            if metric_name not in metric_groups:
                metric_groups[metric_name] = []
            metric_groups[metric_name].append(metric.value)
        
        # Calculate statistics for each metric
        adapter_summary = {}
        for metric_name, values in metric_groups.items():
            numeric_values = [v for v in values if isinstance(v, (int, float))]
            if numeric_values:
                adapter_summary[metric_name] = {
                    "count": len(numeric_values),
                    "avg": sum(numeric_values) / len(numeric_values),
                    "min": min(numeric_values),
                    "max": max(numeric_values)
                }
            else:
                adapter_summary[metric_name] = {
                    "count": len(values),
                    "type": "non-numeric"
                }
        
        summary[adapter_name] = adapter_summary
    
    return {
        "timestamp": datetime.now().isoformat(),
        "period_hours": hours,
        "summary": summary
    }


@router.get("/api/reports/adapter-performance")
async def get_adapter_performance():
    """Generate adapter performance report"""
    adapters_status = await adapter_manager.get_adapter_status()
    metrics = await adapter_manager.get_all_metrics()
    
    performance = {}
    for name, status in adapters_status.items():
        adapter_metrics = metrics.get(name, [])
        performance[name] = {
            "status": status,
            "metrics_count": len(adapter_metrics),
            "last_update": datetime.now().isoformat(),
            "performance_score": 100 if status.get("connected", False) else 0
        }
    
    return {
        "timestamp": datetime.now().isoformat(),
        "adapters": performance
    }


@router.get("/api/reports/custom")
async def generate_custom_report(
    report_type: str = Query(..., description="Type of custom report"),
    filters: Optional[str] = Query(None, description="JSON filters")
):
    """Generate custom report based on parameters"""
    if report_type == "error-analysis":
        logs = await adapter_manager.get_all_logs(1000)
        error_count = 0
        error_sources = {}
        
        for adapter_name, adapter_logs in logs.items():
            for log in adapter_logs:
                if (isinstance(log, dict) and
                        log.get("level", "").lower() in ["error", "critical"]):
                    error_count += 1
                    source = log.get("source", "unknown")
                    error_sources[source] = error_sources.get(source, 0) + 1
        
        return {
            "report_type": "error-analysis",
            "timestamp": datetime.now().isoformat(),
            "total_errors": error_count,
            "error_sources": error_sources
        }
    
    elif report_type == "capacity-planning":
        metrics = await adapter_manager.get_all_metrics()
        capacity_metrics = {}
        
        for adapter_name, adapter_metrics in metrics.items():
            for metric in adapter_metrics:
                capacity_keywords = ["cpu", "memory", "disk", "usage"]
                if any(keyword in metric.metric.lower()
                       for keyword in capacity_keywords):
                    if adapter_name not in capacity_metrics:
                        capacity_metrics[adapter_name] = []
                    capacity_metrics[adapter_name].append({
                        "metric": metric.metric,
                        "value": metric.value,
                        "timestamp": metric.timestamp
                    })
        
        return {
            "report_type": "capacity-planning",
            "timestamp": datetime.now().isoformat(),
            "capacity_metrics": capacity_metrics
        }
    
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown report type: {report_type}"
        )
