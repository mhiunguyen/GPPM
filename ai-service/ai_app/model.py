import os
from typing import Dict, Any, List
import numpy as np
from PIL import Image
import io
import onnxruntime as ort


class CVModel:
    def __init__(self, model_path: str | None = None):
        self.model_path = model_path
        self._loaded = False
        self._model = None
        self._session: ort.InferenceSession | None = None

    def load(self) -> None:
        if self._loaded:
            return
        if not self.model_path or not os.path.exists(self.model_path):
            raise FileNotFoundError(f"MODEL_PATH not found: {self.model_path}")

        # Create ONNXRuntime session
        providers = ['CPUExecutionProvider']
        self._session = ort.InferenceSession(self.model_path, providers=providers)
        self._loaded = True

    def predict(self, image_bytes: bytes) -> Dict[str, float]:
        if not self._loaded:
            self.load()
        assert self._session is not None

        # Preprocess image to model input (example: 224x224 RGB, normalize 0-1)
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB').resize((224, 224))
        x = np.asarray(img, dtype=np.float32) / 255.0  # HWC
        x = np.transpose(x, (2, 0, 1))  # CHW
        x = np.expand_dims(x, axis=0)   # NCHW

        # Assume single input and output
        input_name = self._session.get_inputs()[0].name
        outputs = self._session.run(None, {input_name: x})
        logits = outputs[0].squeeze()

        # Softmax to probabilities
        exp = np.exp(logits - np.max(logits))
        probs = exp / np.sum(exp)

        # Map to known classes (ensure order matches training)
        classes: List[str] = ["melanoma", "nevus", "eczema", "acne"]
        # If model has different number of outputs, fallback safe defaults
        if probs.shape[0] != len(classes):
            return {
                "melanoma": float(probs[0]) if probs.shape[0] > 0 else 0.05,
                "nevus": float(probs[1]) if probs.shape[0] > 1 else 0.7,
                "eczema": float(probs[2]) if probs.shape[0] > 2 else 0.2,
                "acne": float(probs[3]) if probs.shape[0] > 3 else 0.05,
            }

        return {cls: float(p) for cls, p in zip(classes, probs)}


def create_model_from_env() -> CVModel | None:
    use_model = os.getenv("USE_MODEL", "false").lower() in {"1", "true", "yes"}
    if not use_model:
        return None
    model_path = os.getenv("MODEL_PATH")
    return CVModel(model_path=model_path)
