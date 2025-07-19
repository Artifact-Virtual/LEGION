# Test suite for system API

from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)


def test_system_status():
    """Test getting system status"""
    response = client.get("/api/system/status")
    assert response.status_code == 200
    data = response.json()
    assert "timestamp" in data
    assert "status" in data
    assert "health_score" in data
    assert "adapters" in data
    assert "data" in data


def test_system_info():
    """Test getting system information"""
    response = client.get("/api/system/info")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Enterprise Monitoring Dashboard"
    assert data["version"] == "1.0.0"
    assert "endpoints" in data
    assert "features" in data


def test_health_check():
    """Test basic health check"""
    response = client.get("/api/system/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "timestamp" in data


def test_system_metrics():
    """Test getting system metrics"""
    response = client.get("/api/system/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "timestamp" in data
    assert "adapters" in data
    assert "metrics_per_adapter" in data
    assert "system_load" in data
