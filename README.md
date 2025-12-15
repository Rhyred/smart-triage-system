<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Smart Health Triage System

AI-powered comprehensive health screening system using custom machine learning models for general health triage, not limited to COVID-19 screening.

## ✨ Features

- **🏥 Comprehensive Vital Signs Monitoring**: Temperature, SpO2, Heart Rate, Blood Pressure, Respiratory Rate
- **🤖 Custom AI Analysis**: Uses your own trained ML models instead of external APIs
- **⚡ Real-time Triage**: Automatic health status assessment (NORMAL, WASPADA, KRITIS, DARURAT)
- **📹 Visual Analysis**: Camera integration with YOLOv11 for additional health indicators
- **🎨 Modern UI**: Responsive design with landing page and dark/light mode support
- **🔄 Multi-Page Application**: Landing page + Triage system with React Router

## 🚀 Run Locally

**Prerequisites:** Node.js, Python 3.8+

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   Access at: http://localhost:3000

### Backend Setup (Optional - for AI Analysis)
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## 📁 Project Structure

```
smart-triage-system/
├── components/           # React components
│   ├── LandingPage.tsx   # Landing page component
│   └── TriageSystem.tsx  # Main triage system
├── server/              # Python FastAPI backend
│   ├── main.py         # FastAPI server with YOLO integration
│   ├── yolo_inference.py # YOLOv11 health analyzer
│   ├── train_yolo.py   # YOLO training script
│   └── requirements.txt # Python dependencies
├── templates/          # Static HTML templates
├── public/             # Static assets
├── App.tsx            # Main React app with routing
├── index.html         # Vite entry point
└── package.json       # Node.js dependencies
```

## 🎯 How It Works

1. **Landing Page** (`/`): Introduction and project overview
2. **Triage System** (`/triage`): Full health screening interface
3. **AI Analysis**: Combines sensor data with YOLO visual analysis
4. **Risk Assessment**: Multi-level triage (Normal → Waspada → Kritis → Darurat)

## 🔧 Configuration

### Environment Variables
Create `.env` file in root directory:
```env
# AI API Configuration (optional)
AI_API_ENDPOINT=http://localhost:8000/analyze

# Development
VITE_API_BASE_URL=http://localhost:8000
```

### YOLO Model Setup
1. Prepare health condition dataset
2. Run training: `python server/train_yolo.py`
3. Models saved in `server/models/` directory

## 📊 API Endpoints

### POST `/analyze`
Analyze health data with sensor + vision analysis.

**Request:**
```json
{
  "temperature": 37.2,
  "spo2": 98,
  "heartRate": 75,
  "bloodPressure": {"systolic": 120, "diastolic": 80},
  "respiratoryRate": 16,
  "imageData": "base64_encoded_image"
}
```

**Response:**
```json
{
  "healthData": {
    "status": "NORMAL",
    "riskLevel": "LOW",
    "symptoms": [],
    "recommendations": ["Jaga pola hidup sehat"],
    "analysis_method": "sensor + vision"
  },
  "confidence": 0.85,
  "detectedConditions": []
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 👥 Team

**Error 404** - Informatics Students
- Ahmad Fauzi - AI/ML Engineer
- Budi Santoso - IoT Developer
- Citra Dewi - Frontend Developer
- Dedi Rahman - Backend Developer

---

<div align="center">
Made with ❤️ by Team Error 404
</div>
