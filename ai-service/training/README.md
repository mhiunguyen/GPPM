DermaSafe-AI — CV Training Guide

This folder contains minimal, production-friendly scaffolding to train a lightweight image classification model and export it to ONNX for the AI service.

Target classes (order matters and must match the service):
- melanoma
- nevus
- eczema
- acne

The AI service maps model outputs to these class names in `app/model.py`.

1) Prepare dataset

Expected folder structure using ImageFolder format:

/path/to/data/
  melanoma/
    img001.jpg
    ...
  nevus/
    ...
  eczema/
    ...
  acne/
    ...

Notes:
- Folder names must exactly match the class names above.
- Split into train/val if you prefer, else the script will create a random split.
- Images should be reasonably sized; the pipeline resizes to 224x224.

2) Create a Python environment (recommended)

You can use a virtualenv or conda. Then install training dependencies:

pip install -r ai-service/training/requirements.txt

These packages are separate from the service runtime to keep the Docker image small.

3) Train a model

Run the trainer with your dataset path and output directory:

python ai-service/training/train.py \
  --data /path/to/data \
  --out ./models \
  --epochs 10 \
  --batch-size 32 \
  --lr 3e-4

Artifacts produced in `--out`:
- best.pt — best PyTorch checkpoint (by validation accuracy)
- last.pt — last epoch checkpoint
- classes.txt — class order used

4) Export to ONNX

Export the best checkpoint to ONNX for use in the service:

python ai-service/training/export_onnx.py \
  --checkpoint ./models/best.pt \
  --out ./models/dermasafe.onnx

This creates `dermasafe.onnx` compatible with `onnxruntime` and our service.

5) Plug into the AI service

Option A — via environment variables (recommended):
- Place `dermasafe.onnx` somewhere accessible (e.g., `./models/dermasafe.onnx`).
- Set env for the AI service:

USE_MODEL=true
MODEL_PATH=/absolute/path/to/models/dermasafe.onnx

Option B — Docker Compose volume:
- Add a volume mount for the AI service and reference `/models/dermasafe.onnx` as `MODEL_PATH`.

6) Sanity check locally

With the service running and `USE_MODEL=true`, send a test request:
- You should receive `cv_scores` populated by the model and risk classification from `app/logic/rules.py`.

Tips
- Start small (MobileNetV3 Small) and iterate. If accuracy is low, consider data quality, augmentation, and training time.
- Keep preprocessing consistent: RGB, resize 224, normalization (in-export we keep 0..1 like the service expects).
- If you change class set/order, update both the training script and `app/model.py` consistently.
