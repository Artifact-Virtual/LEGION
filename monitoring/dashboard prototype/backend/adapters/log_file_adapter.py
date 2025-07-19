# Log File Adapter

import os
import aiofiles
from typing import Any, Dict, List
from datetime import datetime
import json
import re
from .base import BaseAdapter, DataPoint


class LogFileAdapter(BaseAdapter):
    def __init__(self, config):
        super().__init__(config)
        self.file_path = config.connection.get('path')
        self.format = config.connection.get('format', 'text')  # text, json
        self.pattern = config.connection.get('pattern', None)  # regex pattern

    async def connect(self) -> bool:
        try:
            if not self.file_path or not os.path.exists(self.file_path):
                self._connected = False
                return False
            self._connected = True
            return True
        except Exception as e:
            print(f"Log file connection failed: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        self._connected = False

    async def test_connection(self) -> bool:
        return self._connected and os.path.exists(self.file_path)

    async def get_metrics(self) -> List[DataPoint]:
        """Extract metrics from log files"""
        metrics = []
        if not self._connected:
            return metrics

        try:
            # File size metric
            file_size = os.path.getsize(self.file_path)
            metrics.append(DataPoint(
                timestamp=datetime.now().isoformat(),
                source=self.config.name,
                metric="file_size_bytes",
                value=file_size,
                metadata={"file": self.file_path}
            ))

            # Line count metric
            async with aiofiles.open(self.file_path, 'r') as f:
                line_count = 0
                async for line in f:
                    line_count += 1

            metrics.append(DataPoint(
                timestamp=datetime.now().isoformat(),
                source=self.config.name,
                metric="line_count",
                value=line_count,
                metadata={"file": self.file_path}
            ))

            # Error count metric (if pattern specified)
            if self.pattern:
                error_count = 0
                pattern = re.compile(self.pattern)
                async with aiofiles.open(self.file_path, 'r') as f:
                    async for line in f:
                        if pattern.search(line):
                            error_count += 1

                metrics.append(DataPoint(
                    timestamp=datetime.now().isoformat(),
                    source=self.config.name,
                    metric="pattern_matches",
                    value=error_count,
                    metadata={"file": self.file_path, "pattern": self.pattern}
                ))

        except Exception as e:
            print(f"Error getting log file metrics: {e}")

        return metrics

    async def get_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Extract logs from log files"""
        logs = []
        if not self._connected:
            return logs

        try:
            lines = []
            async with aiofiles.open(self.file_path, 'r') as f:
                async for line in f:
                    lines.append(line.strip())

            # Get last N lines
            recent_lines = lines[-limit:] if len(lines) > limit else lines

            for i, line in enumerate(recent_lines):
                if not line:
                    continue

                log_entry = {
                    "source": self.config.name,
                    "timestamp": datetime.now().isoformat(),
                    "line_number": len(lines) - len(recent_lines) + i + 1
                }

                if self.format == 'json':
                    try:
                        parsed = json.loads(line)
                        log_entry["data"] = parsed
                    except json.JSONDecodeError:
                        log_entry["data"] = {"raw": line}
                else:
                    # Try to extract timestamp and level from text logs
                    timestamp_pattern = r'(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2})'
                    level_pattern = r'\b(DEBUG|INFO|WARN|ERROR|FATAL)\b'
                    
                    timestamp_match = re.search(timestamp_pattern, line)
                    level_match = re.search(level_pattern, line)
                    
                    log_entry["data"] = {
                        "raw": line,
                        "extracted_timestamp": timestamp_match.group(1) if timestamp_match else None,
                        "level": level_match.group(1) if level_match else None
                    }

                logs.append(log_entry)

        except Exception as e:
            print(f"Error getting log file logs: {e}")

        return logs
