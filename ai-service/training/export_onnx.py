import argparse
from pathlib import Path
import torch
import torch.nn as nn
from torchvision import models


def build_model(num_classes: int) -> nn.Module:
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model


def export(checkpoint: str, out_path: str, opset: int = 17):
    ckpt = torch.load(checkpoint, map_location="cpu")
    classes = ckpt.get("classes")
    img_size = int(ckpt.get("img_size", 224))

    model = build_model(num_classes=len(classes))
    model.load_state_dict(ckpt["model_state"])
    model.eval()

    dummy = torch.randn(1, 3, img_size, img_size)

    out_path = str(out_path)
    torch.onnx.export(
        model,
        dummy,
        out_path,
        input_names=["input"],
        output_names=["logits"],
        dynamic_axes={"input": {0: "batch"}, "logits": {0: "batch"}},
        opset_version=opset,
    )
    print(f"Exported ONNX to {out_path} with opset {opset}.")


def parse_args():
    p = argparse.ArgumentParser(description="Export PyTorch checkpoint to ONNX")
    p.add_argument("--checkpoint", type=str, required=True)
    p.add_argument("--out", type=str, required=True)
    p.add_argument("--opset", type=int, default=17)
    return p.parse_args()


if __name__ == "__main__":
    args = parse_args()
    export(args.checkpoint, args.out, args.opset)
