from fastapi.testclient import TestClient
from ai_app.main import app
from io import BytesIO
import json

client = TestClient(app)


def test_analyze_with_structured_json_symptoms():
    fake_image = BytesIO(b"img")
    files = {"image": ("test.jpg", fake_image, "image/jpeg")}
    payload = {
        "symptoms_selected": ["ngứa"],
        "duration": "1-2 tuần",
    }
    data = {
        "symptoms_json": json.dumps(payload)
    }
    resp = client.post("/analyze", files=files, data=data)
    assert resp.status_code == 200
    body = resp.json()
    assert "risk" in body and "reason" in body and "cv_scores" in body
