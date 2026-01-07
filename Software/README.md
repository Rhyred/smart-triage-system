<div align="center">
<img width="1200" height="475" alt="GHBanner" src="/public/banner.jpg" />
</div>

# Smart Health Triage System

Sistem deteksi kesehatan cerdas pakai AI — skrining cepat tanpa kontak. Cocok penelitian atau prototipe fasilitas kesehatan.

## ✨ Fitur Utama

- 🏥 Pemantauan tanda vital: Suhu tubuh, SpO2, Heart Rate, Tekanan Darah, Respiratory Rate
- 🤖 Analisis AI kustom: Bisa pakai model ML sendiri (opsional)
- ⚡ Triase real-time: Hasil cepat dan otomatis (NORMAL, WASPADA, KRITIS, DARURAT)
- 📹 Analisis visual: Integrasi kamera + YOLO untuk deteksi masker atau tanda visual lain
- 🎨 UI modern: Landing page responsif + mode gelap/terang

## 🚀 Jalankan Secara Lokal

Sebelum mulai: pastikan `Node.js` dan `Python 3.8+` tersedia.

### Frontend

1. Install dependensi:

```bash
npm install
```

2. Jalankan dev server:

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

### Backend (opsional — untuk AI/analisis)

1. Masuk ke folder server:

```bash
cd server
```

2. Install dependensi Python:

```bash
pip install -r requirements.txt
```

3. Jalankan server FastAPI (contoh):

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Server backend biasanya tersedia di `http://localhost:8000`.

## 📁 Struktur Proyek (singkat)

```
smart-triage-system/
├── components/        # Komponen React (Landing, Triage, dll.)
├── server/            # Backend FastAPI + skrip YOLO
├── public/            # Asset statis
├── templates/         # Template HTML referensi
├── index.html         # Entry Vite
├── index.tsx          # Boot React app
└── package.json
```

## 🎯 Cara Kerjanya (ringkas)

1. Halaman utama (`/`) — landing page & info project
2. `/triage` — antarmuka skrining kesehatan (kamera + sensor)
3. Backend (opsional) menggabungkan sensor + analisis visual untuk keputusan triase

## 🔧 Konfigurasi

Tambahkan file `.env` di root kalau perlu:

```env
# Contoh endpoint AI (opsional)
AI_API_ENDPOINT=http://localhost:8000/analyze

# Basis API frontend saat dev
VITE_API_BASE_URL=http://localhost:8000
```

### YOLO (opsional)

Kalau mau pakai deteksi visual dengan YOLO:

1. Siapkan dataset
2. Latih model: `python server/train_yolo.py`
3. Model akan tersimpan di `server/models/`

## 📊 Endpoint Contoh

### POST `/analyze`
Contoh payload untuk analisis gabungan sensor + gambar:

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

Contoh respons (ringkas):

```json
{
   "healthData": { "status": "NORMAL", "riskLevel": "LOW" },
   "confidence": 0.85,
   "detectedConditions": []
}
```


## 👥 Tim

Tim Error 404 — mahasiswa/kontributor:
- Robi Rizki Permana — Team Manager Depelovers
- Ratu Syifa Nur Felisha — Frontend
- Moch. Riezky Dwi Kuswanto — AI/ML
- Dila Amelisa Sapitri — Backend
- Mochammad Sayyid A. — IoT

---

Made with ❤️ oleh Tim Error 404

