from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from yolo_inference import analyze_health_image
from sensor_service import get_sensor_data
import base64
import cv2
import numpy as np
import time

# Import YOLO analyzer
try:
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

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    temperature: Optional[float] = None
    spo2: Optional[int] = None
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
    Analisis kesehatan REAL-TIME. 
    WAJIB HARDWARE: Jika sensor gagal, kembalikan error.
    """
    start_time = time.time()

    try:
        # === AMBIL DATA DARI SENSOR HARDWARE (WAJIB) ===
        print("📡 Reading real-time sensor data from GPIO...")
        sensor_reading = get_sensor_data()
    except RuntimeError as e:
        # Jika sensor mati, hentikan proses dan lapor ke user
        print(f"❌ HARDWARE ERROR: {str(e)}")
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=f"Hardware Sensor Error: {str(e)}")

    current_temp = sensor_reading['temperature']
    current_spo2 = sensor_reading['spo2']
    current_heart_rate = sensor_reading['heartRate']
    current_bp = sensor_reading['bloodPressure']
    current_rr = sensor_reading['respiratoryRate']

    # === ANALISIS SENSOR DATA ===
    sensor_symptoms: List[str] = []
    sensor_risk = RiskLevel.LOW

    # Logika analisis tetap sama, tapi menggunakan data REAL
    if current_temp >= 38.0:
        sensor_symptoms.append("Demam Tinggi")
        sensor_risk = RiskLevel.HIGH
    elif current_temp >= 37.5:
        sensor_symptoms.append("Demam")
        sensor_risk = RiskLevel.MEDIUM

    if current_spo2 < 90:
        sensor_symptoms.append("Hipoksemia Berat")
        sensor_risk = RiskLevel.CRITICAL
    elif current_spo2 < 95:
        sensor_symptoms.append("Hipoksemia")
        sensor_risk = RiskLevel.HIGH

    # Heart Rate analysis
    if current_heart_rate:
        if current_heart_rate > 120:
            sensor_symptoms.append("Takikardia")
            if sensor_risk == RiskLevel.LOW:
                sensor_risk = RiskLevel.MEDIUM
        elif current_heart_rate < 50:
            sensor_symptoms.append("Bradikardia")
            if sensor_risk == RiskLevel.LOW:
                sensor_risk = RiskLevel.MEDIUM

    # Blood Pressure analysis
    if current_bp:
        systolic = current_bp.get('systolic', 120)
        diastolic = current_bp.get('diastolic', 80)
        if systolic >= 180 or diastolic >= 120:
            sensor_symptoms.append("Hipertensi Kritis")
            sensor_risk = RiskLevel.CRITICAL
        elif systolic >= 140 or diastolic >= 90:
            sensor_symptoms.append("Hipertensi")
            if sensor_risk == RiskLevel.LOW:
                sensor_risk = RiskLevel.MEDIUM

    # === ANALISIS VISUAL DENGAN YOLO ===
    vision_analysis = None
    if req.imageData and YOLO_AVAILABLE:
        try:
            vision_analysis = analyze_health_image(req.imageData)
        except Exception as e:
            print(f"⚠️  YOLO analysis failed: {e}")

    # === GABUNGKAN ANALISIS SENSOR + VISUAL ===
    combined_symptoms = sensor_symptoms.copy()
    combined_risk = sensor_risk
    vision_insights = []

    if vision_analysis and vision_analysis['overall_analysis']:
        vision_data = vision_analysis['overall_analysis']
        vision_symptoms = vision_data.get('symptoms', [])
        combined_symptoms.extend(vision_symptoms)

        vision_risk_level = vision_data.get('risk_level', 'LOW')
        risk_hierarchy = {'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4}
        current_risk_value = risk_hierarchy.get(combined_risk.value, 1)
        vision_risk_value = risk_hierarchy.get(vision_risk_level, 1)

        if vision_risk_value > current_risk_value:
            combined_risk = RiskLevel(vision_risk_level)

        detected_conditions = vision_data.get('detected_conditions', [])
        if detected_conditions:
            vision_insights.append(f"Visual analysis mendeteksi: {', '.join(detected_conditions)}")

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

    if vision_analysis and vision_analysis['overall_analysis']:
        vision_recs = vision_analysis['overall_analysis'].get('recommendations', [])
        recommendations.extend(vision_recs)
        recommendations = list(set(recommendations))

    # === BUAT RESPONSE ===
    health_data = {
        "temperature": current_temp,
        "spo2": current_spo2,
        "heartRate": current_heart_rate,
        "bloodPressure": current_bp,
        "respiratoryRate": current_rr,
        "symptoms": combined_symptoms,
        "status": status.value,
        "message": message,
        "riskLevel": combined_risk.value,
        "recommendations": recommendations,
        "vision_insights": vision_insights,
        "is_simulated": sensor_reading.get('is_simulated', False),
        "analysis_method": "sensor hardware + vision" if vision_analysis else "sensor hardware only"
    }

    confidence = 0.8  # Base confidence lebih tinggi karena pakai hardware real
    if vision_analysis:
        confidence += 0.1
    
    print(f"✅ Analysis complete , {time.time() - start_time:.2f}s")

    return AnalyzeResponse(
        healthData=health_data,
        confidence=min(confidence, 0.95),
        detectedConditions=combined_symptoms,
        timestamp=int(time.time() * 1000)
    )