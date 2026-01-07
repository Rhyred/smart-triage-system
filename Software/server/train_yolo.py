#!/usr/bin/env python3
"""
YOLOv11 Training Script untuk Health Triage Analysis

Script ini akan melatih model YOLOv11 untuk mendeteksi kondisi kesehatan
dari gambar/video kamera.
"""

import os
import yaml
from pathlib import Path
import torch
from ultralytics import YOLO

def create_dataset_structure():
    """Membuat struktur folder dataset jika belum ada"""
    base_path = Path("datasets")
    folders = [
        "images/train", "images/val", "images/test",
        "labels/train", "labels/val", "labels/test"
    ]

    for folder in folders:
        (base_path / folder).mkdir(parents=True, exist_ok=True)

    print("Struktur dataset dibuat")

def create_data_yaml():
    """Membuat file data.yaml untuk konfigurasi YOLO"""
    data_config = {
        'path': './datasets',
        'train': 'images/train',
        'val': 'images/val',
        'test': 'images/test',
        'names': {
            0: 'normal_posture',
            1: 'abnormal_posture',
            2: 'fatigue_signs',
            3: 'distress_signs',
            4: 'pain_expression',
            5: 'breathing_difficulty'
        },
        'nc': 6  # number of classes
    }

    with open('datasets/data.yaml', 'w') as f:
        yaml.dump(data_config, f, default_flow_style=False)

    print(" File data.yaml dibuat")

def create_synthetic_dataset():
    """Membuat dataset sintetis untuk demo (opsional)"""
    print("   Untuk production, gunakan dataset real dengan gambar kesehatan")
    print("   Contoh: gambar pasien dengan berbagai kondisi kesehatan")
    print("   Format: YOLO annotation (.txt) dengan koordinat bounding box")

def train_yolo_model():
    """Melatih model YOLOv11"""
    print("🚀 Memulai training YOLOv11...")

    # Cek apakah CUDA tersedia
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f" Menggunakan device: {device}")

    # Load model YOLOv11
    model = YOLO('yolo11n.pt')  # Menggunakan model nano untuk efisiensi

    # Training configuration
    training_config = {
        'data': 'datasets/data.yaml',
        'epochs': 50,
        'batch': 16,
        'imgsz': 640,
        'device': device,
        'project': 'models',
        'name': 'health_triage_yolo',
        'save': True,
        'save_period': 10,
        'cache': True,
        'workers': 4,
        'patience': 20,  # Early stopping
        'cos_lr': True,   # Cosine learning rate
        'optimizer': 'AdamW',
        'lr0': 0.001,
        'lrf': 0.01,
        'momentum': 0.937,
        'weight_decay': 0.0005,
        'warmup_epochs': 3.0,
        'warmup_momentum': 0.8,
        'warmup_bias_lr': 0.1
    }

    # Mulai training
    try:
        results = model.train(**training_config)
        print("✅ Training selesai!")

        # Simpan model terbaik
        model.save('models/health_triage_yolo.pt')
        print(" Model disimpan sebagai: models/health_triage_yolo.pt")

        return results

    except Exception as e:
        print(f" Error during training: {e}")
        print(" Pastikan dataset sudah ada di folder datasets/")
        return None

def main():
    """Main function"""
    print(" YOLOv11 Health Triage Training Script")
    print("=" * 50)

    # Setup
    create_dataset_structure()
    create_data_yaml()

    # Check if dataset exists
    train_images = list(Path("datasets/images/train").glob("*.jpg"))
    if not train_images:
        print("  Tidak ada gambar training ditemukan!")
        create_synthetic_dataset()
        print(" Training dibatalkan. Silakan siapkan dataset terlebih dahulu.")
        return

    print(f" Ditemukan {len(train_images)} gambar training")

    # Train model
    results = train_yolo_model()

    if results:
        print("\n🎉 Training berhasil!")
        print(" Hasil training tersimpan di folder 'models/'")
        print(" Model siap digunakan untuk inferensi kesehatan")
    else:
        print("\n Training gagal. Periksa dataset dan konfigurasi.")

if __name__ == "__main__":
    main()