#!/usr/bin/env python3
"""
AI-Powered Intelligent Instrumentation Strategy
Enterprise Legion Monitoring System
"""

import asyncio
import logging
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
import numpy as np
import pandas as pd
from collections import deque, defaultdict
import sqlite3
import threading
import psutil
import GPUtil
from pathlib import Path

# AI/ML imports
try:
    import torch
    import torch.nn as nn
    from sklearn.preprocessing import StandardScaler
    from sklearn.ensemble import IsolationForest
    from sklearn.cluster import DBSCAN
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    print("Warning: PyTorch/sklearn not available. AI features will be limited.")

@dataclass
class MetricData:
    """Core metric data structure"""
    timestamp: datetime
    agent_id: str
    metric_name: str
    value: float
    metadata: Dict[str, Any] = field(default_factory=dict)
    tags: List[str] = field(default_factory=list)

@dataclass
class AlertRule:
    """Intelligent alert rule structure"""
    rule_id: str
    metric_pattern: str
    threshold_type: str  # 'static', 'dynamic', 'ml_based'
    threshold_value: Optional[float]
    ai_confidence_threshold: float = 0.8
    severity: str = 'medium'
    cooldown_seconds: int = 300

@dataclass
class SystemHealth:
    """System health snapshot"""
    timestamp: datetime
    overall_score: float  # 0-100
    agent_health_scores: Dict[str, float]
    resource_utilization: Dict[str, float]
    network_latency: Dict[str, float]
    anomaly_scores: Dict[str, float]
    predictions: Dict[str, Any]

class AnomalyDetectionModel:
    """Advanced AI-based anomaly detection"""
    
    def __init__(self, window_size: int = 100, contamination: float = 0.1):
        self.window_size = window_size
        self.contamination = contamination
        self.isolation_forest = IsolationForest(contamination=contamination, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_buffer = deque(maxlen=window_size)
        
    def add_data_point(self, features: np.ndarray) -> Tuple[bool, float]:
        """Add data point and detect anomaly"""
        self.feature_buffer.append(features)
        
        if len(self.feature_buffer) < self.window_size:
            return False, 0.0
            
        if not self.is_trained:
            self._train_model()
            return False, 0.0
            
        # Normalize features
        normalized_features = self.scaler.transform([features])
        
        # Predict anomaly
        anomaly_score = self.isolation_forest.decision_function(normalized_features)[0]
        is_anomaly = self.isolation_forest.predict(normalized_features)[0] == -1
        
        # Convert to confidence score (0-1)
        confidence = (anomaly_score + 0.5) * 2  # Rough conversion
        confidence = max(0, min(1, confidence))
        
        return is_anomaly, confidence
        
    def _train_model(self):
        """Train the anomaly detection model"""
        if len(self.feature_buffer) < self.window_size:
            return
            
        data = np.array(list(self.feature_buffer))
        self.scaler.fit(data)
        normalized_data = self.scaler.transform(data)
        self.isolation_forest.fit(normalized_data)
        self.is_trained = True

class PredictiveAnalytics:
    """Predictive analytics for resource planning"""
    
    def __init__(self, history_size: int = 1000):
        self.history_size = history_size
        self.time_series_data = defaultdict(lambda: deque(maxlen=history_size))
        
    def add_metric(self, metric_name: str, value: float, timestamp: datetime):
        """Add metric for time series analysis"""
        self.time_series_data[metric_name].append((timestamp, value))
        
    def predict_trend(self, metric_name: str, forecast_hours: int = 24) -> Dict[str, Any]:
        """Predict metric trend using simple linear regression"""
        if metric_name not in self.time_series_data:
            return {"error": "No data available for metric"}
            
        data = list(self.time_series_data[metric_name])
        if len(data) < 10:
            return {"error": "Insufficient data for prediction"}
            
        # Extract timestamps and values
        timestamps = [d[0] for d in data]
        values = [d[1] for d in data]
        
        # Convert timestamps to numeric (hours since first timestamp)
        base_time = timestamps[0]
        x = [(t - base_time).total_seconds() / 3600 for t in timestamps]
        y = values
        
        # Simple linear regression
        x_arr = np.array(x)
        y_arr = np.array(y)
        
        # Calculate slope and intercept
        slope = np.sum((x_arr - np.mean(x_arr)) * (y_arr - np.mean(y_arr))) / np.sum((x_arr - np.mean(x_arr))**2)
        intercept = np.mean(y_arr) - slope * np.mean(x_arr)
        
        # Predict future values
        future_x = x[-1] + forecast_hours
        predicted_value = slope * future_x + intercept
        
        # Calculate trend direction
        trend = "increasing" if slope > 0.01 else "decreasing" if slope < -0.01 else "stable"
        
        return {
            "predicted_value": predicted_value,
            "trend": trend,
            "slope": slope,
            "confidence": min(0.9, len(data) / 100),  # Higher confidence with more data
            "forecast_horizon_hours": forecast_hours
        }

class IntelligentInstrumentationEngine:
    """Core AI-powered instrumentation engine"""
    
    def __init__(self, config_path: str = "monitoring_config.json"):
        self.config_path = config_path
        self.config = self._load_config()
        
        # Core components
        self.anomaly_detector = AnomalyDetectionModel()
        self.predictive_analytics = PredictiveAnalytics()
        self.metric_buffer = deque(maxlen=10000)
        self.alert_rules = {}
        self.system_health_history = deque(maxlen=1000)
        
        # Threading and async
        self.running = False
        self.collection_thread = None
        self.analysis_thread = None
        
        # Databases
        self.db_path = Path("monitoring_data.db")
        self._init_database()
        
        # Logging
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO)
        
    def _load_config(self) -> Dict[str, Any]:
        """Load monitoring configuration"""
        default_config = {
            "collection_interval": 1.0,  # seconds
            "analysis_interval": 5.0,    # seconds
            "alert_thresholds": {
                "cpu_usage": 80.0,
                "memory_usage": 85.0,
                "disk_usage": 90.0,
                "agent_response_time": 5.0
            },
            "ai_settings": {
                "anomaly_detection_enabled": True,
                "predictive_analytics_enabled": True,
                "ml_threshold_adjustment": True
            }
        }
        
        try:
            with open(self.config_path, 'r') as f:
                config = json.load(f)
                # Merge with defaults
                for key, value in default_config.items():
                    if key not in config:
                        config[key] = value
                return config
        except FileNotFoundError:
            return default_config
            
    def _init_database(self):
        """Initialize monitoring database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Metrics table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME,
                agent_id TEXT,
                metric_name TEXT,
                value REAL,
                metadata TEXT,
                tags TEXT
            )
        """)
        
        # Alerts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME,
                alert_type TEXT,
                severity TEXT,
                message TEXT,
                agent_id TEXT,
                metric_name TEXT,
                value REAL,
                threshold REAL,
                resolved BOOLEAN DEFAULT FALSE
            )
        """)
        
        # System health table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS system_health (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME,
                overall_score REAL,
                agent_health_scores TEXT,
                resource_utilization TEXT,
                anomaly_scores TEXT
            )
        """)
        
        conn.commit()
        conn.close()
        
    def start_monitoring(self):
        """Start the monitoring system"""
        self.running = True
        
        # Start collection thread
        self.collection_thread = threading.Thread(target=self._collection_loop)
        self.collection_thread.daemon = True
        self.collection_thread.start()
        
        # Start analysis thread
        self.analysis_thread = threading.Thread(target=self._analysis_loop)
        self.analysis_thread.daemon = True
        self.analysis_thread.start()
        
        self.logger.info("Intelligent monitoring system started")
        
    def stop_monitoring(self):
        """Stop the monitoring system"""
        self.running = False
        if self.collection_thread:
            self.collection_thread.join()
        if self.analysis_thread:
            self.analysis_thread.join()
        self.logger.info("Monitoring system stopped")
        
    def _collection_loop(self):
        """Main metric collection loop"""
        while self.running:
            try:
                # Collect system metrics
                system_metrics = self._collect_system_metrics()
                
                # Collect agent metrics (simulated for now)
                agent_metrics = self._collect_agent_metrics()
                
                # Store metrics
                all_metrics = system_metrics + agent_metrics
                for metric in all_metrics:
                    self.metric_buffer.append(metric)
                    self._store_metric(metric)
                    
                time.sleep(self.config["collection_interval"])
                
            except Exception as e:
                self.logger.error(f"Error in collection loop: {e}")
                time.sleep(1)
                
    def _analysis_loop(self):
        """Main AI analysis loop"""
        while self.running:
            try:
                if len(self.metric_buffer) > 0:
                    # Perform anomaly detection
                    anomalies = self._detect_anomalies()
                    
                    # Generate predictions
                    predictions = self._generate_predictions()
                    
                    # Calculate system health
                    health_score = self._calculate_system_health()
                    
                    # Check alert conditions
                    self._check_alert_conditions()
                    
                time.sleep(self.config["analysis_interval"])
                
            except Exception as e:
                self.logger.error(f"Error in analysis loop: {e}")
                time.sleep(1)
                
    def _collect_system_metrics(self) -> List[MetricData]:
        """Collect system-level metrics"""
        metrics = []
        current_time = datetime.now()
        
        # CPU metrics
        cpu_percent = psutil.cpu_percent(interval=0.1)
        metrics.append(MetricData(
            timestamp=current_time,
            agent_id="system",
            metric_name="cpu_usage_percent",
            value=cpu_percent,
            tags=["system", "cpu"]
        ))
        
        # Memory metrics
        memory = psutil.virtual_memory()
        metrics.append(MetricData(
            timestamp=current_time,
            agent_id="system",
            metric_name="memory_usage_percent",
            value=memory.percent,
            metadata={"available_gb": memory.available / (1024**3)},
            tags=["system", "memory"]
        ))
        
        # Disk metrics
        disk = psutil.disk_usage('/')
        metrics.append(MetricData(
            timestamp=current_time,
            agent_id="system",
            metric_name="disk_usage_percent",
            value=disk.percent,
            metadata={"free_gb": disk.free / (1024**3)},
            tags=["system", "disk"]
        ))
        
        # Network metrics
        network = psutil.net_io_counters()
        metrics.append(MetricData(
            timestamp=current_time,
            agent_id="system",
            metric_name="network_bytes_sent",
            value=network.bytes_sent,
            tags=["system", "network"]
        ))
        
        # GPU metrics (if available)
        try:
            gpus = GPUtil.getGPUs()
            for i, gpu in enumerate(gpus):
                metrics.append(MetricData(
                    timestamp=current_time,
                    agent_id=f"gpu_{i}",
                    metric_name="gpu_usage_percent",
                    value=gpu.load * 100,
                    metadata={"temperature": gpu.temperature, "memory_used": gpu.memoryUsed},
                    tags=["system", "gpu"]
                ))
        except:
            pass  # GPU monitoring optional
            
        return metrics
        
    def _collect_agent_metrics(self) -> List[MetricData]:
        """Collect agent-specific metrics"""
        metrics = []
        current_time = datetime.now()
        
        # Simulated agent metrics (replace with actual agent monitoring)
        agent_names = [
            "task_scheduler", "workflow_orchestrator", "resource_optimizer",
            "financial_analyst", "financial_modeler", "quality_assurance",
            "report_generator", "content_writer", "social_media_monitor",
            "compliance_checker", "calendar_manager", "analytics_engine",
            "analytics_specialist", "market_analyst", "research_specialist",
            "strategic_planner", "integration_manager", "enhanced_integration"
        ]
        
        for agent_name in agent_names:
            # Simulate realistic metrics with some variance
            base_response_time = np.random.normal(1.5, 0.3)
            response_time = max(0.1, base_response_time)
            
            metrics.append(MetricData(
                timestamp=current_time,
                agent_id=agent_name,
                metric_name="response_time_ms",
                value=response_time * 1000,
                tags=["agent", "performance"]
            ))
            
            # Task queue depth
            queue_depth = max(0, int(np.random.normal(5, 2)))
            metrics.append(MetricData(
                timestamp=current_time,
                agent_id=agent_name,
                metric_name="task_queue_depth",
                value=queue_depth,
                tags=["agent", "queue"]
            ))
            
            # Success rate
            success_rate = min(100, max(70, np.random.normal(95, 3)))
            metrics.append(MetricData(
                timestamp=current_time,
                agent_id=agent_name,
                metric_name="success_rate_percent",
                value=success_rate,
                tags=["agent", "reliability"]
            ))
            
        return metrics
        
    def _detect_anomalies(self) -> Dict[str, Any]:
        """Detect anomalies using AI models"""
        if not self.config["ai_settings"]["anomaly_detection_enabled"]:
            return {}
            
        anomalies = {}
        
        # Group metrics by agent and metric type
        recent_metrics = list(self.metric_buffer)[-100:]  # Last 100 metrics
        
        for metric in recent_metrics:
            feature_vector = np.array([
                metric.value,
                hash(metric.metric_name) % 1000,  # Metric type encoding
                (metric.timestamp.hour * 60 + metric.timestamp.minute) / 1440  # Time of day
            ])
            
            is_anomaly, confidence = self.anomaly_detector.add_data_point(feature_vector)
            
            if is_anomaly and confidence > 0.7:
                key = f"{metric.agent_id}_{metric.metric_name}"
                anomalies[key] = {
                    "metric": metric,
                    "confidence": confidence,
                    "timestamp": metric.timestamp
                }
                
                # Generate alert
                self._generate_alert(
                    alert_type="anomaly",
                    severity="medium" if confidence < 0.9 else "high",
                    message=f"Anomaly detected in {metric.metric_name} for {metric.agent_id}",
                    agent_id=metric.agent_id,
                    metric_name=metric.metric_name,
                    value=metric.value
                )
                
        return anomalies
        
    def _generate_predictions(self) -> Dict[str, Any]:
        """Generate predictive analytics"""
        if not self.config["ai_settings"]["predictive_analytics_enabled"]:
            return {}
            
        predictions = {}
        
        # Add recent metrics to predictive analytics
        recent_metrics = list(self.metric_buffer)[-50:]
        for metric in recent_metrics:
            self.predictive_analytics.add_metric(
                f"{metric.agent_id}_{metric.metric_name}",
                metric.value,
                metric.timestamp
            )
            
        # Generate predictions for key metrics
        key_metrics = [
            "system_cpu_usage_percent",
            "system_memory_usage_percent",
            "system_disk_usage_percent"
        ]
        
        for metric_name in key_metrics:
            prediction = self.predictive_analytics.predict_trend(metric_name, forecast_hours=6)
            if "error" not in prediction:
                predictions[metric_name] = prediction
                
        return predictions
        
    def _calculate_system_health(self) -> SystemHealth:
        """Calculate overall system health score"""
        current_time = datetime.now()
        
        # Get recent metrics
        recent_metrics = [m for m in self.metric_buffer if (current_time - m.timestamp).seconds < 60]
        
        if not recent_metrics:
            return SystemHealth(
                timestamp=current_time,
                overall_score=0,
                agent_health_scores={},
                resource_utilization={},
                network_latency={},
                anomaly_scores={},
                predictions={}
            )
            
        # Calculate agent health scores
        agent_health_scores = {}
        agent_metrics = defaultdict(list)
        
        for metric in recent_metrics:
            agent_metrics[metric.agent_id].append(metric)
            
        for agent_id, metrics in agent_metrics.items():
            if agent_id == "system":
                continue
                
            # Calculate health based on response time and success rate
            response_times = [m.value for m in metrics if "response_time" in m.metric_name]
            success_rates = [m.value for m in metrics if "success_rate" in m.metric_name]
            
            health_score = 100
            if response_times:
                avg_response = np.mean(response_times)
                if avg_response > 5000:  # 5 seconds
                    health_score -= 30
                elif avg_response > 2000:  # 2 seconds
                    health_score -= 15
                    
            if success_rates:
                avg_success = np.mean(success_rates)
                health_score = health_score * (avg_success / 100)
                
            agent_health_scores[agent_id] = max(0, health_score)
            
        # Calculate resource utilization
        resource_utilization = {}
        system_metrics = [m for m in recent_metrics if m.agent_id == "system"]
        
        for metric in system_metrics:
            if "usage_percent" in metric.metric_name:
                resource_utilization[metric.metric_name] = metric.value
                
        # Calculate overall score
        overall_score = 100
        
        # Penalize high resource usage
        for metric_name, value in resource_utilization.items():
            if value > 90:
                overall_score -= 20
            elif value > 80:
                overall_score -= 10
                
        # Factor in agent health
        if agent_health_scores:
            avg_agent_health = np.mean(list(agent_health_scores.values()))
            overall_score = (overall_score + avg_agent_health) / 2
            
        health = SystemHealth(
            timestamp=current_time,
            overall_score=max(0, overall_score),
            agent_health_scores=agent_health_scores,
            resource_utilization=resource_utilization,
            network_latency={},
            anomaly_scores={},
            predictions={}
        )
        
        self.system_health_history.append(health)
        self._store_system_health(health)
        
        return health
        
    def _check_alert_conditions(self):
        """Check for alert conditions"""
        recent_metrics = list(self.metric_buffer)[-10:]
        
        for metric in recent_metrics:
            # Check static thresholds
            threshold_key = metric.metric_name.replace("_percent", "")
            if threshold_key in self.config["alert_thresholds"]:
                threshold = self.config["alert_thresholds"][threshold_key]
                
                if metric.value > threshold:
                    self._generate_alert(
                        alert_type="threshold",
                        severity="high" if metric.value > threshold * 1.2 else "medium",
                        message=f"{metric.metric_name} exceeded threshold: {metric.value:.2f} > {threshold}",
                        agent_id=metric.agent_id,
                        metric_name=metric.metric_name,
                        value=metric.value,
                        threshold=threshold
                    )
                    
    def _generate_alert(self, alert_type: str, severity: str, message: str, 
                       agent_id: str, metric_name: str, value: float, threshold: float = None):
        """Generate and store an alert"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO alerts (timestamp, alert_type, severity, message, agent_id, metric_name, value, threshold)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (datetime.now(), alert_type, severity, message, agent_id, metric_name, value, threshold))
        
        conn.commit()
        conn.close()
        
        self.logger.warning(f"ALERT [{severity.upper()}]: {message}")
        
    def _store_metric(self, metric: MetricData):
        """Store metric in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO metrics (timestamp, agent_id, metric_name, value, metadata, tags)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            metric.timestamp,
            metric.agent_id,
            metric.metric_name,
            metric.value,
            json.dumps(metric.metadata),
            json.dumps(metric.tags)
        ))
        
        conn.commit()
        conn.close()
        
    def _store_system_health(self, health: SystemHealth):
        """Store system health in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO system_health (timestamp, overall_score, agent_health_scores, resource_utilization, anomaly_scores)
            VALUES (?, ?, ?, ?, ?)
        """, (
            health.timestamp,
            health.overall_score,
            json.dumps(health.agent_health_scores),
            json.dumps(health.resource_utilization),
            json.dumps(health.anomaly_scores)
        ))
        
        conn.commit()
        conn.close()
        
    def get_system_status(self) -> Dict[str, Any]:
        """Get current system status"""
        if not self.system_health_history:
            return {"error": "No health data available"}
            
        latest_health = self.system_health_history[-1]
        
        return {
            "timestamp": latest_health.timestamp.isoformat(),
            "overall_score": latest_health.overall_score,
            "status": "healthy" if latest_health.overall_score > 80 else "warning" if latest_health.overall_score > 60 else "critical",
            "agent_count": len(latest_health.agent_health_scores),
            "agents_healthy": sum(1 for score in latest_health.agent_health_scores.values() if score > 80),
            "resource_utilization": latest_health.resource_utilization,
            "monitoring_active": self.running
        }
        
    def get_agent_metrics(self, agent_id: str, hours: int = 24) -> Dict[str, Any]:
        """Get metrics for specific agent"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        since_time = datetime.now() - timedelta(hours=hours)
        
        cursor.execute("""
            SELECT timestamp, metric_name, value, metadata, tags
            FROM metrics
            WHERE agent_id = ? AND timestamp > ?
            ORDER BY timestamp DESC
        """, (agent_id, since_time))
        
        rows = cursor.fetchall()
        conn.close()
        
        metrics = []
        for row in rows:
            metrics.append({
                "timestamp": row[0],
                "metric_name": row[1],
                "value": row[2],
                "metadata": json.loads(row[3]) if row[3] else {},
                "tags": json.loads(row[4]) if row[4] else []
            })
            
        return {"agent_id": agent_id, "metrics": metrics, "count": len(metrics)}

# Example usage and testing
if __name__ == "__main__":
    # Initialize the intelligent monitoring system
    monitoring = IntelligentInstrumentationEngine()
    
    try:
        # Start monitoring
        monitoring.start_monitoring()
        
        print("Intelligent monitoring system started...")
        print("Collecting metrics and running AI analysis...")
        
        # Run for a demo period
        for i in range(60):  # Run for 1 minute
            time.sleep(1)
            
            if i % 10 == 0:  # Every 10 seconds
                status = monitoring.get_system_status()
                print(f"\nSystem Status (t+{i}s):")
                print(f"  Overall Score: {status.get('overall_score', 0):.1f}")
                print(f"  Status: {status.get('status', 'unknown')}")
                print(f"  Healthy Agents: {status.get('agents_healthy', 0)}/{status.get('agent_count', 0)}")
                
        print("\nDemo completed. Stopping monitoring...")
        
    except KeyboardInterrupt:
        print("\nStopping monitoring system...")
        
    finally:
        monitoring.stop_monitoring()
        print("Monitoring system stopped.")
