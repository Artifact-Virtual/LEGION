# SQLite Database Adapter

import sqlite3
import aiosqlite
from typing import Any, Dict, List
from datetime import datetime
from .base import BaseAdapter, DataPoint


class SQLiteAdapter(BaseAdapter):
    def __init__(self, config):
        super().__init__(config)
        self.db_path = config.connection.get(
            'database', 
            config.connection.get('path', ':memory:')
        )

    async def connect(self) -> bool:
        try:
            self.connection = await aiosqlite.connect(self.db_path)
            self._connected = True
            return True
        except Exception as e:
            print(f"SQLite connection failed: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        if hasattr(self, 'connection'):
            await self.connection.close()
        self._connected = False

    async def test_connection(self) -> bool:
        if not self._connected:
            return False
        try:
            async with self.connection.execute("SELECT 1") as cursor:
                result = await cursor.fetchone()
                return result is not None
        except Exception:
            return False

    async def get_metrics(self) -> List[DataPoint]:
        """Extract metrics from SQLite database"""
        metrics = []
        try:
            # Example: Count rows in various tables as metrics
            cursor = await self.connection.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            )
            tables = await cursor.fetchall()
            
            for table in tables:
                table_name = table[0]
                count_cursor = await self.connection.execute(
                    f"SELECT COUNT(*) FROM {table_name}"
                )
                count = await count_cursor.fetchone()
                
                metrics.append(DataPoint(
                    timestamp=datetime.now().isoformat(),
                    source=self.config.name,
                    metric=f"table_{table_name}_count",
                    value=count[0] if count else 0,
                    metadata={"table": table_name}
                ))
        except Exception as e:
            print(f"Error getting SQLite metrics: {e}")
        
        return metrics

    async def get_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Extract logs from SQLite database"""
        logs = []
        try:
            # Look for common log table patterns
            cursor = await self.connection.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND "
                "(name LIKE '%log%' OR name LIKE '%audit%' OR name LIKE '%event%')"
            )
            log_tables = await cursor.fetchall()
            
            for table in log_tables:
                table_name = table[0]
                log_cursor = await self.connection.execute(
                    f"SELECT * FROM {table_name} ORDER BY rowid DESC LIMIT {limit}"
                )
                rows = await log_cursor.fetchall()
                
                # Get column names
                columns = [description[0] for description in log_cursor.description]
                
                for row in rows:
                    logs.append({
                        "source": f"{self.config.name}.{table_name}",
                        "timestamp": datetime.now().isoformat(),
                        "data": dict(zip(columns, row))
                    })
        except Exception as e:
            print(f"Error getting SQLite logs: {e}")
        
        return logs
