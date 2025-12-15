from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from yolo_inference import YOLOHealthAnalyzer
import base64
import cv2
import numpy as np
import time

# Import YOLO analyzer
try:
    from yolo_inference import analyze_health_image
    import cv2
    import numpy as np
    YOLO_AVAILABLE = True
    print("✅ YOLO Health Analyzer loaded successfully")
except ImportError as e:
    YOLO_AVAILABLE = False
    print(f"⚠️  YOLO inference tidak tersedia: {e}")
    print("   Continuing with sensor-only analysis")
except Exception as e:
    YOLO_AVAILABLE = False
    print(f"⚠️  Error initializing YOLO: {e}")
    print("   Continuing with sensor-only analysis")

app = FastAPI(title="Health AI Local Server")


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class TriageStatus(str, Enum):
    NORMAL = "NORMAL"
    WASPADA = "WASPADA"
    KRITIS = "KRITIS"
    DARURAT = "DARURAT"


class BloodPressure(BaseModel):
    systolic: int
    diastolic: int


class AnalyzeRequest(BaseModel):
    temperature: float
    spo2: int
    heartRate: Optional[int] = None
    bloodPressure: Optional[BloodPressure] = None
    respiratoryRate: Optional[int] = None
    imageData: Optional[str] = None


class AnalyzeResponse(BaseModel):
    healthData: Dict[str, Any]
    confidence: float = Field(..., ge=0.0, le=1.0)
    detectedConditions: Optional[List[str]] = None
    timestamp: int


@app.get("/")
def root():
    return {"message": "Health AI Local Server is running"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    """
    Analisis kesehatan komprehensif menggunakan sensor data + YOLO vision analysis
    """
    start_time = time.time()

    # === ANALISIS SENSOR DATA ===
    sensor_symptoms: List[str] = []
    sensor_risk = RiskLevel.LOW

    # Temperature analysis
    if req.temperature >= 38.0:
        sensor_symptoms.append("Demam Tinggi")
        sensor_risk = RiskLevel.HIGH
    elif req.temperature >= 37.5:
        sensor_symptoms.append("Demam")
        sensor_risk = RiskLevel.MEDIUM

    # SpO2 analysis
    if req.spo2 < 90:
        sensor_symptoms.append("Hipoksemia Berat")
        sensor_risk = RiskLevel.CRITICAL
    elif req.spo2 < 95:
        sensor_symptoms.append("Hipoksemia")
        if sensor_risk == RiskLevel.LOW:
            sensor_risk = RiskLevel.HIGH

    # Heart Rate analysis
    if req.heartRate:
        if req.heartRate > 120:
            sensor_symptoms.append("Takikardia")
            if sensor_risk == RiskLevel.LOW:
                sensor_risk = RiskLevel.MEDIUM
        elif req.heartRate < 50:
            sensor_symptoms.append("Bradikardia")
            if sensor_risk == RiskLevel.LOW:
                sensor_risk = RiskLevel.MEDIUM

    # Blood Pressure analysis
    if req.bloodPressure:
        systolic = req.bloodPressure.systolic
        diastolic = req.bloodPressure.diastolic
        if systolic >= 180 or diastolic >= 120:
            sensor_symptoms.append("Hipertensi Kritis")
            sensor_risk = RiskLevel.CRITICAL
        elif systolic >= 140 or diastolic >= 90:
            sensor_symptoms.append("Hipertensi")
            if sensor_risk == RiskLevel.LOW:
                sensor_risk = RiskLevel.MEDIUM

    # Respiratory Rate analysis
    if req.respiratoryRate:
        if req.respiratoryRate > 30:
            sensor_symptoms.append("Takipnea")
            if sensor_risk == RiskLevel.LOW:
                sensor_risk = RiskLevel.MEDIUM
        elif req.respiratoryRate < 12:
            sensor_symptoms.append("Bradipnea")
            if sensor_risk == RiskLevel.LOW:
                sensor_risk = RiskLevel.MEDIUM

    # === ANALISIS VISUAL DENGAN YOLO (jika tersedia) ===
    vision_analysis = None
    if req.imageData and YOLO_AVAILABLE:
        try:
            vision_analysis = analyze_health_image(req.imageData)
            print(f"✅ YOLO analysis completed in {time.time() - start_time:.2f}s")
        except Exception as e:
            print(f"⚠️  YOLO analysis failed: {e}")
            vision_analysis = None

    # === GABUNGKAN ANALISIS SENSOR + VISUAL ===
    combined_symptoms = sensor_symptoms.copy()
    combined_risk = sensor_risk
    vision_insights = []

    if vision_analysis and vision_analysis['overall_analysis']:
        vision_data = vision_analysis['overall_analysis']

        # Gabungkan symptoms
        vision_symptoms = vision_data.get('symptoms', [])
        combined_symptoms.extend(vision_symptoms)

        # Update risk level jika vision menunjukkan risiko lebih tinggi
        vision_risk_level = vision_data.get('risk_level', 'LOW')
        risk_hierarchy = {'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4}
        current_risk_value = risk_hierarchy.get(combined_risk.value, 1)
        vision_risk_value = risk_hierarchy.get(vision_risk_level, 1)

        if vision_risk_value > current_risk_value:
            combined_risk = RiskLevel(vision_risk_level)

        # Tambahkan insights dari vision
        detected_conditions = vision_data.get('detected_conditions', [])
        if detected_conditions:
            vision_insights.append(f"Visual analysis mendeteksi: {', '.join(detected_conditions)}")

    # Remove duplicate symptoms
    combined_symptoms = list(set(combined_symptoms))

    # === TENTUKAN STATUS AKHIR ===
    status = TriageStatus.NORMAL
    message = "Kondisi Dalam Batas Normal"
    recommendations: List[str] = ["Jaga pola hidup sehat", "Lakukan pemeriksaan rutin"]

    if combined_risk == RiskLevel.CRITICAL:
        status = TriageStatus.DARURAT
        message = "Perlu Penanganan Darurat Segera"
        recommendations = [
            "Segera hubungi tim medis",
            "Monitor tanda vital terus menerus",
            "Siapkan alat resusitasi jika diperlukan"
        ]
    elif combined_risk == RiskLevel.HIGH:
        status = TriageStatus.KRITIS
        message = "Perlu Perhatian Medis Segera"
        recommendations = [
            "Kunjungi unit gawat darurat",
            "Pantau kondisi secara berkala",
            "Siapkan riwayat kesehatan"
        ]
    elif combined_risk == RiskLevel.MEDIUM:
        status = TriageStatus.WASPADA
        message = "Perlu Pemantauan Kesehatan"
        recommendations = [
            "Konsultasi dengan dokter",
            "Istirahat yang cukup",
            "Monitor gejala"
        ]

    # Tambahkan rekomendasi dari vision analysis jika ada
    if vision_analysis and vision_analysis['overall_analysis']:
        vision_recs = vision_analysis['overall_analysis'].get('recommendations', [])
        recommendations.extend(vision_recs)
        recommendations = list(set(recommendations))  # Remove duplicates

    # === BUAT RESPONSE ===
    health_data = {
        "temperature": req.temperature,
        "spo2": req.spo2,
        "heartRate": req.heartRate,
        "bloodPressure": req.bloodPressure.dict() if req.bloodPressure else None,
        "respiratoryRate": req.respiratoryRate,
        "symptoms": combined_symptoms,
        "status": status.value,
        "message": message,
        "riskLevel": combined_risk.value,
        "recommendations": recommendations,
        "vision_insights": vision_insights,
        "analysis_method": "sensor + vision" if vision_analysis else "sensor only"
    }

    # Hitung confidence berdasarkan data yang tersedia
    confidence = 0.7  # Base confidence
    if vision_analysis:
        confidence += 0.2  # Bonus untuk visual analysis
    if req.heartRate and req.bloodPressure and req.respiratoryRate:
        confidence += 0.1  # Bonus untuk data sensor lengkap

    return AnalyzeResponse(
        healthData=health_data,
        confidence=min(confidence, 0.95),  # Max 95% confidence
        detectedConditions=combined_symptoms,
        timestamp=int(time.time() * 1000)
    )
