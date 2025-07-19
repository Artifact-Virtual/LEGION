# Base Adapter Interface

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class AdapterConfig(BaseModel):
    name: str
    type: str  # database, api, log, file
    connection: Dict[str, Any]
    enabled: bool = True
    refresh_interval: int = 30  # seconds


class DataPoint(BaseModel):
    timestamp: str
    source: str
    metric: str
    value: Any
    metadata: Optional[Dict[str, Any]] = None


class BaseAdapter(ABC):
    def __init__(self, config: AdapterConfig):
        self.config = config
        self._connected = False

    @abstractmethod
    async def connect(self) -> bool:
        """Establish connection to data source"""
        pass

    @abstractmethod
    async def disconnect(self) -> None:
        """Close connection to data source"""
        pass

    @abstractmethod
    async def test_connection(self) -> bool:
        """Test if connection is working"""
        pass

    @abstractmethod
    async def get_metrics(self) -> List[DataPoint]:
        """Retrieve metrics from data source"""
        pass

    @abstractmethod
    async def get_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Retrieve logs from data source"""
        pass

    @property
    def is_connected(self) -> bool:
        return self._connected
