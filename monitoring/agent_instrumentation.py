#!/usr/bin/env python3
"""
Agent Instrumentation Module
Integrates monitoring capabilities into Enterprise Legion agents
"""

import asyncio
import time
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
import socket
import threading
import websockets
import ssl
from pathlib import Path

@dataclass
class AgentMetric:
    """Individual agent metric"""
    agent_id: str
    metric_name: str
    value: float
    timestamp: datetime
    metadata: Dict[str, Any] = field(default_factory=dict)
    tags: List[str] = field(default_factory=list)

@dataclass
class TaskExecution:
    """Task execution tracking"""
    task_id: str
    task_type: str
    agent_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str = 'running'  # 'running', 'completed', 'failed'
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

class MetricsCollector:
    """Collects and buffers metrics from agents"""
    
    def __init__(self, buffer_size: int = 1000):
        self.metrics_buffer: List[AgentMetric] = []
        self.buffer_size = buffer_size
        self.lock = threading.Lock()
        
    def add_metric(self, metric: AgentMetric):
        """Add metric to buffer"""
        with self.lock:
            self.metrics_buffer.append(metric)
            if len(self.metrics_buffer) > self.buffer_size:
                # Remove oldest metrics
                self.metrics_buffer = self.metrics_buffer[-self.buffer_size:]
                
    def get_metrics(self, agent_id: Optional[str] = None) -> List[AgentMetric]:
        """Get metrics from buffer"""
        with self.lock:
            if agent_id:
                return [m for m in self.metrics_buffer if m.agent_id == agent_id]
            return list(self.metrics_buffer)
    
    def clear_buffer(self):
        """Clear metrics buffer"""
        with self.lock:
            self.metrics_buffer.clear()

class AgentMonitor:
    """Main monitoring class to be integrated into each agent"""
    
    def __init__(self, agent_id: str, department: str, 
                 monitoring_server: str = "localhost:8765"):
        self.agent_id = agent_id
        self.department = department
        self.monitoring_server = monitoring_server
        
        # Metrics collection
        self.metrics_collector = MetricsCollector()
        self.active_tasks: Dict[str, TaskExecution] = {}
        
        # Performance tracking
        self.start_time = datetime.now()
        self.task_counter = 0
        self.message_counter = 0
        self.error_counter = 0
        
        # Connection management
        self.websocket = None
        self.connected = False
        self.connection_task = None
        
        # Logging
        self.logger = logging.getLogger(f"monitor.{agent_id}")
        
        # Start background tasks
        asyncio.create_task(self._start_monitoring())
        
    async def _start_monitoring(self):
        """Start monitoring background tasks"""
        try:
            # Start metrics collection
            asyncio.create_task(self._metrics_collection_loop())
            
            # Start connection to monitoring server
            asyncio.create_task(self._connect_to_server())
            
            self.logger.info(f"Monitoring started for agent {self.agent_id}")
            
        except Exception as e:
            self.logger.error(f"Failed to start monitoring: {e}")
    
    async def _connect_to_server(self):
        """Connect to monitoring server via WebSocket"""
        while True:
            try:
                uri = f"ws://{self.monitoring_server}/agent"
                
                # Use SSL in production
                ssl_context = None
                if self.monitoring_server.startswith('wss://'):
                    ssl_context = ssl.create_default_context()
                
                async with websockets.connect(uri, ssl=ssl_context) as websocket:
                    self.websocket = websocket
                    self.connected = True
                    
                    # Send agent registration
                    await self._register_agent()
                    
                    # Listen for commands
                    async for message in websocket:
                        await self._handle_server_message(message)
                        
            except Exception as e:
                self.logger.warning(f"Connection to monitoring server failed: {e}")
                self.connected = False
                await asyncio.sleep(5)  # Retry after 5 seconds
    
    async def _register_agent(self):
        """Register agent with monitoring server"""
        registration = {
            "type": "agent_registration",
            "agent_id": self.agent_id,
            "department": self.department,
            "timestamp": datetime.now().isoformat(),
            "capabilities": [],  # Will be populated by actual agent
            "metadata": {
                "start_time": self.start_time.isoformat(),
                "version": "1.0.0"
            }
        }
        
        if self.websocket:
            await self.websocket.send(json.dumps(registration))
    
    async def _handle_server_message(self, message: str):
        """Handle messages from monitoring server"""
        try:
            data = json.loads(message)
            message_type = data.get("type")
            
            if message_type == "ping":
                await self._send_pong()
            elif message_type == "request_metrics":
                await self._send_metrics()
            elif message_type == "health_check":
                await self._send_health_status()
            else:
                self.logger.warning(f"Unknown message type: {message_type}")
                
        except Exception as e:
            self.logger.error(f"Error handling server message: {e}")
    
    async def _send_pong(self):
        """Send pong response"""
        pong = {
            "type": "pong",
            "agent_id": self.agent_id,
            "timestamp": datetime.now().isoformat()
        }
        
        if self.websocket:
            await self.websocket.send(json.dumps(pong))
    
    async def _send_metrics(self):
        """Send current metrics to server"""
        metrics = self.metrics_collector.get_metrics()
        
        metrics_data = {
            "type": "metrics_data",
            "agent_id": self.agent_id,
            "timestamp": datetime.now().isoformat(),
            "metrics": [
                {
                    "metric_name": m.metric_name,
                    "value": m.value,
                    "timestamp": m.timestamp.isoformat(),
                    "metadata": m.metadata,
                    "tags": m.tags
                } for m in metrics[-50:]  # Send last 50 metrics
            ]
        }
        
        if self.websocket:
            await self.websocket.send(json.dumps(metrics_data))
    
    async def _send_health_status(self):
        """Send agent health status"""
        uptime = (datetime.now() - self.start_time).total_seconds()
        
        health_data = {
            "type": "health_status",
            "agent_id": self.agent_id,
            "timestamp": datetime.now().isoformat(),
            "status": "healthy",  # Could be dynamic based on metrics
            "uptime_seconds": uptime,
            "metrics": {
                "total_tasks": self.task_counter,
                "total_messages": self.message_counter,
                "total_errors": self.error_counter,
                "active_tasks": len(self.active_tasks),
                "tasks_per_minute": self.task_counter / max(1, uptime / 60),
                "error_rate": self.error_counter / max(1, self.task_counter)
            }
        }
        
        if self.websocket:
            await self.websocket.send(json.dumps(health_data))
    
    async def _metrics_collection_loop(self):
        """Background loop for collecting system metrics"""
        while True:
            try:
                # Collect CPU and memory usage for this agent
                import psutil
                process = psutil.Process()
                
                # CPU usage
                cpu_percent = process.cpu_percent()
                self.record_metric("cpu_usage_percent", cpu_percent, tags=["system"])
                
                # Memory usage
                memory_info = process.memory_info()
                memory_percent = process.memory_percent()
                self.record_metric("memory_usage_percent", memory_percent, tags=["system"])
                self.record_metric("memory_rss_bytes", memory_info.rss, tags=["system"])
                
                # Task queue metrics
                self.record_metric("active_tasks_count", len(self.active_tasks), tags=["tasks"])
                
                # Connection status
                self.record_metric("monitoring_connected", 1 if self.connected else 0, tags=["connection"])
                
                await asyncio.sleep(5)  # Collect every 5 seconds
                
            except Exception as e:
                self.logger.error(f"Error in metrics collection: {e}")
                await asyncio.sleep(10)
    
    def record_metric(self, metric_name: str, value: float, 
                     metadata: Optional[Dict[str, Any]] = None,
                     tags: Optional[List[str]] = None):
        """Record a metric for this agent"""
        metric = AgentMetric(
            agent_id=self.agent_id,
            metric_name=metric_name,
            value=value,
            timestamp=datetime.now(),
            metadata=metadata or {},
            tags=tags or []
        )
        
        self.metrics_collector.add_metric(metric)
    
    @asynccontextmanager
    async def track_task(self, task_type: str, task_id: Optional[str] = None):
        """Context manager for tracking task execution"""
        if task_id is None:
            task_id = f"{task_type}_{int(time.time() * 1000)}"
        
        task_execution = TaskExecution(
            task_id=task_id,
            task_type=task_type,
            agent_id=self.agent_id,
            start_time=datetime.now()
        )
        
        self.active_tasks[task_id] = task_execution
        self.task_counter += 1
        
        start_time = time.time()
        
        try:
            self.record_metric(f"task_started", 1, 
                             metadata={"task_type": task_type, "task_id": task_id},
                             tags=["task", "start"])
            
            yield task_execution
            
            # Task completed successfully
            end_time = time.time()
            execution_time = end_time - start_time
            
            task_execution.end_time = datetime.now()
            task_execution.status = 'completed'
            
            self.record_metric(f"task_execution_time_seconds", execution_time,
                             metadata={"task_type": task_type, "task_id": task_id},
                             tags=["task", "completed"])
            
            self.record_metric(f"task_completed", 1,
                             metadata={"task_type": task_type, "task_id": task_id},
                             tags=["task", "success"])
            
        except Exception as e:
            # Task failed
            end_time = time.time()
            execution_time = end_time - start_time
            
            task_execution.end_time = datetime.now()
            task_execution.status = 'failed'
            task_execution.error_message = str(e)
            
            self.error_counter += 1
            
            self.record_metric(f"task_execution_time_seconds", execution_time,
                             metadata={"task_type": task_type, "task_id": task_id, "error": str(e)},
                             tags=["task", "failed"])
            
            self.record_metric(f"task_failed", 1,
                             metadata={"task_type": task_type, "task_id": task_id, "error": str(e)},
                             tags=["task", "error"])
            
            raise
        
        finally:
            # Clean up
            if task_id in self.active_tasks:
                del self.active_tasks[task_id]
    
    def track_message_sent(self, message: Dict[str, Any]):
        """Track outgoing message"""
        self.message_counter += 1
        
        self.record_metric("message_sent", 1,
                         metadata={
                             "message_type": message.get("message_type", "unknown"),
                             "recipient": message.get("recipient_id", "unknown")
                         },
                         tags=["message", "outbound"])
    
    def track_message_received(self, message: Dict[str, Any]):
        """Track incoming message"""
        self.record_metric("message_received", 1,
                         metadata={
                             "message_type": message.get("message_type", "unknown"),
                             "sender": message.get("sender_id", "unknown")
                         },
                         tags=["message", "inbound"])
    
    def track_response_time(self, operation: str, response_time_ms: float):
        """Track operation response time"""
        self.record_metric(f"{operation}_response_time_ms", response_time_ms,
                         metadata={"operation": operation},
                         tags=["performance", "response_time"])
    
    def track_success_rate(self, operation: str, success: bool):
        """Track operation success rate"""
        self.record_metric(f"{operation}_success", 1 if success else 0,
                         metadata={"operation": operation},
                         tags=["performance", "success_rate"])
    
    def get_status(self) -> Dict[str, Any]:
        """Get current monitoring status"""
        uptime = (datetime.now() - self.start_time).total_seconds()
        
        return {
            "agent_id": self.agent_id,
            "department": self.department,
            "monitoring_enabled": True,
            "connected_to_server": self.connected,
            "uptime_seconds": uptime,
            "metrics_collected": len(self.metrics_collector.get_metrics()),
            "active_tasks": len(self.active_tasks),
            "counters": {
                "total_tasks": self.task_counter,
                "total_messages": self.message_counter,
                "total_errors": self.error_counter
            }
        }

# Decorator for automatic task tracking
def monitor_task(task_type: str):
    """Decorator for automatically monitoring task execution"""
    def decorator(func):
        async def wrapper(self, *args, **kwargs):
            if hasattr(self, 'monitor') and isinstance(self.monitor, AgentMonitor):
                async with self.monitor.track_task(task_type):
                    return await func(self, *args, **kwargs)
            else:
                return await func(self, *args, **kwargs)
        return wrapper
    return decorator

# Example integration with Enterprise Agent
"""
# Add to your agent class:

from monitoring.agent_instrumentation import AgentMonitor, monitor_task

class YourEnterpriseAgent(EnterpriseAgent):
    def __init__(self, agent_id: str, ...):
        super().__init__(agent_id, ...)
        
        # Initialize monitoring
        self.monitor = AgentMonitor(agent_id, self.department)
    
    @monitor_task("process_task")
    async def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        # Your task processing logic
        result = await self._process_task_internal(task)
        return result
    
    @monitor_task("send_message")
    async def send_message(self, message: AgentMessage):
        # Track message sending
        self.monitor.track_message_sent(message.to_dict())
        return await super().send_message(message)
    
    async def handle_message(self, message: AgentMessage):
        # Track message receiving
        self.monitor.track_message_received(message.to_dict())
        return await super().handle_message(message)
"""
