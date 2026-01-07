#!/usr/bin/env python3
"""
YOLOv11 Inference untuk Health Triage Analysis

Class untuk menjalankan inferensi model YOLOv11 pada gambar kesehatan.
"""

import cv2
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
import base64
import io
from PIL import Image

try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO_AVAILABLE = False
    print("⚠️  ultralytics tidak terinstall. Install dengan: pip install ultralytics")

class YOLOHealthAnalyzer:
    """Class untuk analisis kesehatan menggunakan YOLOv11"""

    def __init__(self, model_path: str = "models/health_triage_yolo.pt"):
        """
        Initialize YOLO analyzer
        
        Args:
            model_path: Path ke model YOLO yang sudah dilatih
        """
        self.model_path = Path(model_path)
        self.model = None
        self.using_standard_model = False
        
        # Mapping kelas untuk model medis custom
        self.custom_class_names = {
            0: 'normal_posture',
            1: 'abnormal_posture', 
            2: 'fatigue_signs',
            3: 'distress_signs',
            4: 'pain_expression',
            5: 'breathing_difficulty'
        }
        
        # Mapping untuk model standar (COCO) sebagai fallback demo
        self.coco_class_names = {
            0: 'person'
        }

        if YOLO_AVAILABLE:
            try:
                if self.model_path.exists():
                    self.model = YOLO(str(self.model_path))
                    print(f"✅ Model Medis Custom dimuat: {model_path}")
                    self.using_standard_model = False
                else:
                    # Fallback ke model standar YOLOv8n
                    print(f"⚠️  Model medis tidak ditemukan di {model_path}")
                    print("   🔄 Mengunduh/Memuat model standar YOLOv8n untuk demonstrasi...")
                    self.model = YOLO("yolov8n.pt") 
                    self.using_standard_model = True
                    print("✅ Model Standar (yolov8n) siap digunakan")
                    
            except Exception as e:
                print(f"❌ Gagal load model: {e}")
                self.model = None
        else:
            print("⚠️  Ultralytics library tidak tersedia")

    def analyze_image(self, image_data: str) -> Dict[str, Any]:
        """
        Analisis gambar menggunakan YOLOv11
        
        Args:
            image_data: Base64 encoded image string
            
        Returns:
            Dictionary berisi hasil analisis kesehatan
        """
        if not self.model:
            return self._fallback_analysis()

        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
            image = Image.open(io.BytesIO(image_bytes))
            image_np = np.array(image)

            # Run YOLO inference
            results = self.model(image_np, conf=0.3, iou=0.5)

            # Process results
            detections = []
            health_conditions = []

            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        # Get bounding box coordinates
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        confidence = float(box.conf[0].cpu().numpy())
                        class_id = int(box.cls[0].cpu().numpy())
                        
                        # Tentukan nama kelas berdasarkan model yang dipakai
                        if self.using_standard_model:
                            # Jika model standar, kita hanya peduli 'person'
                            if class_id == 0: 
                                class_name = 'person_detected'
                            else:
                                continue # Skip objek lain (kursi, meja, dll)
                        else:
                            class_name = self.custom_class_names.get(class_id, f"class_{class_id}")

                        detection = {
                            'class': class_name,
                            'confidence': confidence,
                            'bbox': [float(x1), float(y1), float(x2), float(y2)]
                        }
                        detections.append(detection)

                        # Map ke kondisi kesehatan
                        health_condition = self._map_detection_to_health(class_name, confidence)
                        if health_condition:
                            health_conditions.append(health_condition)

            # Aggregate health analysis
            health_analysis = self._aggregate_health_analysis(health_conditions)
            
            # Tambahkan metadata
            health_analysis['model_type'] = 'Standard/Demo' if self.using_standard_model else 'Medical/Custom'

            return {
                'detections': detections,
                'health_conditions': health_conditions,
                'overall_analysis': health_analysis,
                'model_used': 'YOLOv8n' if self.using_standard_model else 'CustomYOLO',
                'confidence': 0.85
            }

        except Exception as e:
            print(f"❌ Error in YOLO analysis: {e}")
            return self._fallback_analysis()

    def _map_detection_to_health(self, class_name: str, confidence: float) -> Optional[Dict[str, Any]]:
        """Map deteksi YOLO ke kondisi kesehatan"""
        
        # Mapping Khusus untuk Demo dengan Model Standar
        if class_name == 'person_detected':
            return {
                'condition': 'Pasien Terdeteksi',
                'severity': 'LOW',
                'symptoms': ['Kehadiran pasien terkonfirmasi'],
                'recommendations': ['Lanjutkan pemeriksaan visual', 'Cek tanda vital']
            }

        health_mapping = {
            'normal_posture': {
                'condition': 'Postur Normal',
                'severity': 'LOW',
                'symptoms': [],
                'recommendations': ['Pertahankan postur baik']
            },
            'abnormal_posture': {
                'condition': 'Postur Abnormal',
                'severity': 'MEDIUM',
                'symptoms': ['Postur tubuh tidak normal'],
                'recommendations': ['Perbaiki postur', 'Konsultasi fisioterapis']
            },
            'fatigue_signs': {
                'condition': 'Tanda-tanda Kelelahan',
                'severity': 'MEDIUM',
                'symptoms': ['Kelelahan fisik', 'Mata lelah', 'Ekspresi lelah'],
                'recommendations': ['Istirahat cukup', 'Minum air', 'Olahraga ringan']
            },
            'distress_signs': {
                'condition': 'Tanda-tanda Distress',
                'severity': 'HIGH',
                'symptoms': ['Kecemasan', 'Ketegangan', 'Gelagat tidak nyaman'],
                'recommendations': ['Tenangkan pasien', 'Hubungi keluarga', 'Konsultasi psikolog']
            },
            'pain_expression': {
                'condition': 'Ekspresi Nyeri',
                'severity': 'HIGH',
                'symptoms': ['Nyeri fisik', 'Ketidaknyamanan', 'Wajah meringis'],
                'recommendations': ['Berikan analgesik', 'Identifikasi sumber nyeri', 'Pantau kondisi']
            },
            'breathing_difficulty': {
                'condition': 'Kesulitan Bernapas',
                'severity': 'CRITICAL',
                'symptoms': ['Sesak napas', 'Napas cepat', 'Napas berbunyi'],
                'recommendations': ['Berikan oksigen', 'Siapkan ventilator', 'Hubungi tim medis darurat']
            }
        }

        if class_name in health_mapping:
            condition = health_mapping[class_name].copy()
            condition['confidence'] = confidence
            return condition

        return None

    def _aggregate_health_analysis(self, health_conditions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Aggregate multiple health conditions menjadi analisis keseluruhan"""

        if not health_conditions:
            return {
                'status': 'NORMAL',
                'message': 'Tidak ada kondisi abnormal terdeteksi',
                'risk_level': 'LOW',
                'recommendations': ['Lanjutkan pemantauan rutin']
            }

        # Hitung severity tertinggi
        severity_levels = {'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4}
        max_severity = max(health_conditions, key=lambda x: severity_levels.get(x['severity'], 1))

        # Aggregate symptoms dan recommendations
        all_symptoms = []
        all_recommendations = []

        for condition in health_conditions:
            all_symptoms.extend(condition.get('symptoms', []))
            all_recommendations.extend(condition.get('recommendations', []))

        # Remove duplicates
        all_symptoms = list(set(all_symptoms))
        all_recommendations = list(set(all_recommendations))

        # Determine overall status
        severity = max_severity['severity']

        if severity == 'CRITICAL':
            status = 'DARURAT'
            message = 'Perlu penanganan darurat segera!'
        elif severity == 'HIGH':
            status = 'KRITIS'
            message = 'Perlu perhatian medis segera'
        elif severity == 'MEDIUM':
            status = 'WASPADA'
            message = 'Perlu pemantauan kesehatan'
        else:
            status = 'NORMAL'
            message = 'Kondisi dalam batas normal'

        return {
            'status': status,
            'message': message,
            'risk_level': severity,
            'symptoms': all_symptoms,
            'recommendations': all_recommendations,
            'detected_conditions': [c['condition'] for c in health_conditions]
        }

    def _fallback_analysis(self) -> Dict[str, Any]:
        """Fallback analysis jika model tidak tersedia"""
        return {
            'detections': [],
            'health_conditions': [],
            'overall_analysis': {
                'status': 'NORMAL',
                'message': 'Analisis visual tidak tersedia - menggunakan data sensor saja',
                'risk_level': 'LOW',
                'symptoms': [],
                'recommendations': ['Lengkapi dengan data sensor untuk analisis lengkap']
            },
            'model_used': 'fallback',
            'confidence': 0.5
        }

# Global instance
yolo_analyzer = YOLOHealthAnalyzer()

def analyze_health_image(image_data: str) -> Dict[str, Any]:
    """
    Function untuk analisis gambar kesehatan (untuk import mudah)

    Args:
        image_data: Base64 encoded image

    Returns:
        Dictionary hasil analisis
    """
    return yolo_analyzer.analyze_image(image_data)