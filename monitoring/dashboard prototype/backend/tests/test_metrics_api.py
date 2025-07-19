# Test suite for metrics API

from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)


def test_get_all_metrics_empty():
    """Test getting all metrics when no adapters are registered"""
    response = client.get("/api/metrics")
    assert response.status_code == 200
    assert response.json() == {}


def test_get_adapter_metrics_not_found():
    """Test getting metrics from non-existent adapter"""
    response = client.get("/api/metrics/nonexistent")
    assert response.status_code == 404


def test_search_metrics_empty():
    """Test searching metrics when no data exists"""
    response = client.get("/api/metrics/search")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["metrics"] == []


def test_search_metrics_with_filters():
    """Test searching metrics with filters"""
    response = client.get("/api/metrics/search?metric_name=cpu&limit=50")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "metrics" in data
