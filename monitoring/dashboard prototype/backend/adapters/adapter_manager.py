# Adapter Manager for the monitoring dashboard

from typing import Dict, List, Optional, Any
from backend.adapters.base import BaseAdapter, AdapterConfig, DataPoint
from backend.adapters.sqlite_adapter import SQLiteAdapter
from backend.adapters.rest_api_adapter import RESTAPIAdapter
from backend.adapters.log_file_adapter import LogFileAdapter


class AdapterManager:
    def __init__(self):
        self.adapters: Dict[str, BaseAdapter] = {}
        self.adapter_types = {
            "sqlite": SQLiteAdapter,
            "rest_api": RESTAPIAdapter,
            "log_file": LogFileAdapter
        }

    async def register_adapter(self, config: AdapterConfig) -> bool:
        """Register and initialize a new adapter"""
        try:
            if config.type not in self.adapter_types:
                raise ValueError(f"Unsupported adapter type: {config.type}")
            
            adapter_class = self.adapter_types[config.type]
            adapter = adapter_class(config)
            
            # Test connection
            if await adapter.test_connection():
                await adapter.connect()
                self.adapters[config.name] = adapter
                return True
            return False
        except Exception as e:
            print(f"Failed to register adapter {config.name}: {e}")
            return False

    async def unregister_adapter(self, name: str) -> bool:
        """Unregister and disconnect an adapter"""
        if name in self.adapters:
            await self.adapters[name].disconnect()
            del self.adapters[name]
            return True
        return False

    async def get_adapter(self, name: str) -> Optional[BaseAdapter]:
        """Get adapter by name"""
        return self.adapters.get(name)

    async def list_adapters(self) -> List[str]:
        """List all registered adapter names"""
        return list(self.adapters.keys())

    async def get_all_metrics(self) -> Dict[str, List[DataPoint]]:
        """Get metrics from all adapters"""
        results = {}
        for name, adapter in self.adapters.items():
            if adapter.config.enabled:
                try:
                    metrics = await adapter.get_metrics()
                    results[name] = metrics
                except Exception as e:
                    print(f"Error getting metrics from {name}: {e}")
                    results[name] = []
        return results

    async def get_all_logs(self, limit: int = 100) -> Dict[str, List[Dict]]:
        """Get logs from all adapters"""
        results = {}
        for name, adapter in self.adapters.items():
            if adapter.config.enabled:
                try:
                    logs = await adapter.get_logs(limit)
                    results[name] = logs
                except Exception as e:
                    print(f"Error getting logs from {name}: {e}")
                    results[name] = []
        return results

    async def get_adapter_status(self) -> Dict[str, Dict[str, Any]]:
        """Get status of all adapters"""
        status = {}
        for name, adapter in self.adapters.items():
            try:
                is_connected = await adapter.test_connection()
                status[name] = {
                    "name": name,
                    "type": adapter.config.type,
                    "enabled": adapter.config.enabled,
                    "connected": is_connected,
                    "refresh_interval": adapter.config.refresh_interval
                }
            except Exception as e:
                status[name] = {
                    "name": name,
                    "type": adapter.config.type,
                    "enabled": adapter.config.enabled,
                    "connected": False,
                    "error": str(e)
                }
        return status
