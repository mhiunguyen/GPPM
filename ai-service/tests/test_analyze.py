from fastapi.testclient import TestClient
from ai_app.main import app
from io import BytesIO

client = TestClient(app)


def test_analyze_default_low_risk():
    # create a tiny fake image payload
    fake_image = BytesIO(b"not-really-an-image")
    files = {"image": ("test.jpg", fake_image, "image/jpeg")}
    resp = client.post("/analyze", files=files, data={"symptoms_selected": ""})
    assert resp.status_code == 200
    data = resp.json()
    assert "risk" in data and "reason" in data
    assert data["risk"] in ["THẤP 🟢", "TRUNG BÌNH 🟡", "CAO 🔴"]
