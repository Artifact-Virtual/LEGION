# API Registry Tests (Prototype)

import pytest
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def test_add_and_list_api():
    api = {
        "name": "testapi",
        "url": "http://localhost:8000/api/test",
        "enabled": True,
        "standby": False,
        "config": {"key": "value"}
    }
    # Add API
    resp = client.post("/api/registry", json=api)
    assert resp.status_code == 200
    # List APIs
    resp = client.get("/api/registry")
    assert resp.status_code == 200
    apis = resp.json()
    assert any(a["name"] == "testapi" for a in apis)

def test_remove_api():
    api = {
        "name": "removeapi",
        "url": "http://localhost:8000/api/remove",
        "enabled": True,
        "standby": False
    }
    client.post("/api/registry", json=api)
    resp = client.delete("/api/registry/removeapi")
    assert resp.status_code == 200
    # Should not be in list
    resp = client.get("/api/registry")
    apis = resp.json()
    assert not any(a["name"] == "removeapi" for a in apis)
