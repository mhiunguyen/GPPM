from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
from backend_app.main import app
from io import BytesIO
import json

client = TestClient(app)


def test_analyze_success_and_logging(monkeypatch):
    """Test /api/v1/analyze proxies to AI service and logs result."""
    
    # Mock httpx.AsyncClient context manager and post method
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "risk": "THẤP 🟢",
        "reason": "Test reason",
        "cv_scores": {"melanoma": 0.05}
    }
    mock_response.raise_for_status = MagicMock()
    
    mock_client = MagicMock()
    mock_client.post = AsyncMock(return_value=mock_response)
    
    # Mock the AsyncClient constructor to return our mock in an async context manager
    mock_async_client_class = MagicMock()
    mock_async_client_class.return_value.__aenter__ = AsyncMock(return_value=mock_client)
    mock_async_client_class.return_value.__aexit__ = AsyncMock(return_value=None)
    
    # Mock DB session
    mock_db = MagicMock()
    
    def override_get_db():
        yield mock_db
    
    from backend_app.database import get_db
    from backend_app.main import app as test_app
    
    # DEBUG: list routes
    print("Registered routes:")
    for route in test_app.routes:
        print(f"  {route.path}")
    
    test_app.dependency_overrides[get_db] = override_get_db
    
    with patch("httpx.AsyncClient", new=mock_async_client_class):
        fake_image = BytesIO(b"fake")
        files = {"image": ("test.jpg", fake_image, "image/jpeg")}
        data = {"symptoms_selected": "ngứa"}
        
        resp = client.post("/api/v1/analyze", files=files, data=data)
        
        print("Response status:", resp.status_code)
        print("Response body:", resp.text)
        
        assert resp.status_code == 200
        body = resp.json()
        assert body["risk"] == "THẤP 🟢"
        
        # Verify DB add was called
        assert mock_db.add.called
        assert mock_db.commit.called
    
    test_app.dependency_overrides.clear()
