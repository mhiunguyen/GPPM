import argparse
import os
from pathlib import Path
from typing import Tuple

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models
from tqdm import tqdm


CLASSES = ["melanoma", "nevus", "eczema", "acne"]


def build_dataloaders(data_dir: str, batch_size: int, img_size: int = 224, val_split: float = 0.2, num_workers: int = 4) -> Tuple[DataLoader, DataLoader, list]:
    transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),  # 0..1 range to match service preprocessing
    ])

    ds = datasets.ImageFolder(root=data_dir, transform=transform)

    # Validate class order matches expected; otherwise warn
    class_to_idx = ds.class_to_idx
    classes_by_idx = [None] * len(class_to_idx)
    for cls, idx in class_to_idx.items():
        classes_by_idx[idx] = cls

    # Ensure we have exactly the classes expected
    if sorted(classes_by_idx) != sorted(CLASSES):
        raise ValueError(f"Dataset classes {classes_by_idx} do not match required {CLASSES}. Please name folders accordingly.")

    n_total = len(ds)
    n_val = int(n_total * val_split)
    n_train = n_total - n_val
    train_ds, val_ds = random_split(ds, [n_train, n_val])

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=num_workers, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=num_workers, pin_memory=True)

    return train_loader, val_loader, classes_by_idx


def build_model(num_classes: int) -> nn.Module:
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model


def evaluate(model: nn.Module, loader: DataLoader, device: torch.device) -> float:
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in loader:
            images = images.to(device)
            labels = labels.to(device)
            outputs = model(images)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
    return correct / max(1, total)


def train(args):
    device = torch.device("cuda" if torch.cuda.is_available() and not args.cpu else "cpu")
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    train_loader, val_loader, classes = build_dataloaders(
        data_dir=args.data,
        batch_size=args.batch_size,
        img_size=args.img_size,
        val_split=args.val_split,
        num_workers=args.workers,
    )

    # Persist class order
    (out_dir / "classes.txt").write_text("\n".join(classes))

    model = build_model(num_classes=len(classes)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    lr_scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)

    best_acc = 0.0
    for epoch in range(args.epochs):
        model.train()
        pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{args.epochs}")
        running_loss = 0.0
        for images, labels in pbar:
            images = images.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * labels.size(0)
            pbar.set_postfix(loss=loss.item())

        val_acc = evaluate(model, val_loader, device)
        lr_scheduler.step()

        avg_loss = running_loss / max(1, len(train_loader.dataset))
        print(f"Epoch {epoch+1}: loss={avg_loss:.4f}, val_acc={val_acc:.4f}")

        # Save last
        last_path = out_dir / "last.pt"
        torch.save({
            "model_state": model.state_dict(),
            "classes": classes,
            "img_size": args.img_size,
        }, last_path)

        # Save best
        if val_acc > best_acc:
            best_acc = val_acc
            best_path = out_dir / "best.pt"
            torch.save({
                "model_state": model.state_dict(),
                "classes": classes,
                "img_size": args.img_size,
            }, best_path)
            print(f"Saved new best to {best_path} (acc={best_acc:.4f})")


def parse_args():
    p = argparse.ArgumentParser(description="Train MobileNetV3 on skin condition dataset")
    p.add_argument("--data", type=str, required=True, help="Path to ImageFolder dataset root")
    p.add_argument("--out", type=str, default="./models", help="Output directory for checkpoints")
    p.add_argument("--epochs", type=int, default=10)
    p.add_argument("--batch-size", type=int, default=32)
    p.add_argument("--lr", type=float, default=3e-4)
    p.add_argument("--img-size", type=int, default=224)
    p.add_argument("--val-split", type=float, default=0.2)
    p.add_argument("--workers", type=int, default=4)
    p.add_argument("--cpu", action="store_true", help="Force CPU even if CUDA is available")
    return p.parse_args()


if __name__ == "__main__":
    args = parse_args()
    train(args)
