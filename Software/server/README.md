# Local AI Server (FastAPI)

This folder contains a minimal FastAPI skeleton to run a local AI analysis endpoint for the Smart Health Triage System.

Endpoints:
- `GET /` : health check
- `POST /analyze` : accepts JSON sensor data and returns `AIAnalysisResult`-like response

Run locally:

```bash
cd server
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 5001
```

Replace the rule-based logic in `main.py` with your own model inference code. Place model files under a `models/` folder and use `AI_MODEL_PATH` from the root `.env.local`.
