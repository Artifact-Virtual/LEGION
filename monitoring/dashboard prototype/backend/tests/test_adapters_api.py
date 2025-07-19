# Test suite for adapters API

from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)


def test_list_adapters_empty():
    """Test listing adapters when none are registered"""
    response = client.get("/api/adapters")
    assert response.status_code == 200
    assert response.json() == []


def test_adapter_status_empty():
    """Test adapter status when none are registered"""
    response = client.get("/api/adapters/status")
    assert response.status_code == 200
    assert response.json() == {}


def test_register_adapter():
    """Test registering a new adapter"""
    adapter_config = {
        "name": "test_sqlite",
        "type": "sqlite",
        "connection": {"database": ":memory:"},
        "enabled": True,
        "refresh_interval": 30
    }
    
    response = client.post("/api/adapters", json=adapter_config)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "registered"
    assert data["name"] == "test_sqlite"


def test_unregister_adapter():
    """Test unregistering an adapter"""
    # First register an adapter
    adapter_config = {
        "name": "test_sqlite_2",
        "type": "sqlite",
        "connection": {"database": ":memory:"},
        "enabled": True
    }
    
    register_response = client.post("/api/adapters", json=adapter_config)
    assert register_response.status_code == 200
    
    # Then unregister it
    response = client.delete("/api/adapters/test_sqlite_2")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "unregistered"
    assert data["name"] == "test_sqlite_2"


def test_unregister_nonexistent_adapter():
    """Test unregistering an adapter that doesn't exist"""
    response = client.delete("/api/adapters/nonexistent")
    assert response.status_code == 404


def test_test_adapter():
    """Test testing adapter connection"""
    # Register an adapter first
    adapter_config = {
        "name": "test_sqlite_3",
        "type": "sqlite",
        "connection": {"database": ":memory:"},
        "enabled": True
    }
    
    register_response = client.post("/api/adapters", json=adapter_config)
    assert register_response.status_code == 200
    
    # Test the adapter
    response = client.get("/api/adapters/test_sqlite_3/test")
    assert response.status_code == 200
    data = response.json()
    assert data["adapter"] == "test_sqlite_3"
    assert "connected" in data


def test_test_nonexistent_adapter():
    """Test testing a non-existent adapter"""
    response = client.get("/api/adapters/nonexistent/test")
    assert response.status_code == 404
