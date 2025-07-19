# REST API Adapter

import aiohttp
from typing import Any, Dict, List
from datetime import datetime
from .base import BaseAdapter, DataPoint


class RESTAPIAdapter(BaseAdapter):
    def __init__(self, config):
        super().__init__(config)
        self.base_url = config.connection.get('url')
        self.headers = config.connection.get('headers', {})
        self.auth = config.connection.get('auth', {})
        self.session = None

    async def connect(self) -> bool:
        try:
            self.session = aiohttp.ClientSession(
                headers=self.headers,
                timeout=aiohttp.ClientTimeout(total=30)
            )
            self._connected = True
            return True
        except Exception as e:
            print(f"REST API connection failed: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        if self.session:
            await self.session.close()
        self._connected = False

    async def test_connection(self) -> bool:
        if not self._connected or not self.session:
            return False
        try:
            health_endpoint = f"{self.base_url}/health"
            async with self.session.get(health_endpoint) as response:
                return response.status == 200
        except Exception:
            # Try base URL if health endpoint doesn't exist
            try:
                async with self.session.get(self.base_url) as response:
                    return response.status in [200, 401, 403]  # Connection OK
            except Exception:
                return False

    async def get_metrics(self) -> List[DataPoint]:
        """Extract metrics from REST API"""
        metrics = []
        if not self._connected or not self.session:
            return metrics

        try:
            # Try common metrics endpoints
            endpoints = ['/metrics', '/api/metrics', '/stats', '/api/stats']
            
            for endpoint in endpoints:
                try:
                    url = f"{self.base_url.rstrip('/')}{endpoint}"
                    async with self.session.get(url) as response:
                        if response.status == 200:
                            data = await response.json()
                            
                            # Parse different metric formats
                            if isinstance(data, dict):
                                for key, value in data.items():
                                    if isinstance(value, (int, float)):
                                        metrics.append(DataPoint(
                                            timestamp=datetime.now().isoformat(),
                                            source=self.config.name,
                                            metric=key,
                                            value=value,
                                            metadata={"endpoint": endpoint}
                                        ))
                            break  # Stop after first successful endpoint
                except Exception:
                    continue
                    
        except Exception as e:
            print(f"Error getting REST API metrics: {e}")
        
        return metrics

    async def get_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Extract logs from REST API"""
        logs = []
        if not self._connected or not self.session:
            return logs

        try:
            # Try common log endpoints
            endpoints = ['/logs', '/api/logs', '/events', '/api/events']
            
            for endpoint in endpoints:
                try:
                    url = f"{self.base_url.rstrip('/')}{endpoint}"
                    params = {'limit': limit} if limit else {}
                    
                    async with self.session.get(url, params=params) as response:
                        if response.status == 200:
                            data = await response.json()
                            
                            # Handle different log formats
                            if isinstance(data, list):
                                for item in data[:limit]:
                                    logs.append({
                                        "source": f"{self.config.name}{endpoint}",
                                        "timestamp": item.get('timestamp', 
                                                            datetime.now().isoformat()),
                                        "data": item
                                    })
                            elif isinstance(data, dict) and 'logs' in data:
                                for item in data['logs'][:limit]:
                                    logs.append({
                                        "source": f"{self.config.name}{endpoint}",
                                        "timestamp": item.get('timestamp',
                                                            datetime.now().isoformat()),
                                        "data": item
                                    })
                            break  # Stop after first successful endpoint
                except Exception:
                    continue
                    
        except Exception as e:
            print(f"Error getting REST API logs: {e}")
        
        return logs
