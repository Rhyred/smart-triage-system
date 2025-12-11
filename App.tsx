/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Thermometer,
  UserCheck,
  UserX,
  ShieldCheck,
  AlertTriangle,
  ScanFace,
  Cpu,
  Sun,
  Moon
} from 'lucide-react';

// Tipe data untuk simulasi
interface SensorData {
  suhu: number;
  spo2: number;
  masker: boolean;
  status: 'DIIZINKAN' | 'DITOLAK';
  pesan: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<SensorData>({
    suhu: 36.5,
    spo2: 98,
    masker: true,
    status: 'DIIZINKAN',
    pesan: 'Silakan Masuk'
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Efek Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Simulasi Data Sensor (Mocking Backend)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomize values around normal range
      const newSuhu = parseFloat((36.0 + Math.random() * 2.0).toFixed(1)); // 36.0 - 38.0
      const newSpo2 = Math.floor(93 + Math.random() * 7); // 93 - 100
      const newMasker = Math.random() > 0.3; // 70% chance wearing mask

      let status: 'DIIZINKAN' | 'DITOLAK' = 'DITOLAK';
      let pesan = 'Kondisi Tidak Aman';

      if (newMasker && newSuhu < 37.5 && newSpo2 > 95) {
        status = 'DIIZINKAN';
        pesan = 'Silakan Masuk';
      } else if (!newMasker) {
        pesan = 'Wajib Pakai Masker';
      } else if (newSuhu >= 37.5) {
        pesan = 'Suhu Tubuh Tinggi';
      } else {
        pesan = 'Saturasi Oksigen Rendah';
      }

      setData({
        suhu: newSuhu,
        spo2: newSpo2,
        masker: newMasker,
        status,
        pesan
      });
    }, 2000); // Update setiap 2 detik

    return () => clearInterval(interval);
  }, []);

  // Akses Kamera Browser untuk Simulasi
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied or not available", err);
      }
    };
    startCamera();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-500 pb-10">

      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white dark:from-indigo-950 dark:via-slate-950 dark:to-black z-0 pointer-events-none"></div>
      <div className="fixed inset-0 opacity-5 dark:opacity-20 z-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Navbar */}
      <header className="border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
              <Cpu className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
                Smart Triage <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">System</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">Raspberry Pi 4 • Flask AI</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors border border-slate-200 dark:border-white/10"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Video Feed */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black shadow-2xl shadow-indigo-500/10 group">

              {/* Header Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-start">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-red-100 tracking-wider">LIVE FEED</span>
                </div>
                <ScanFace className="w-6 h-6 text-white/50" />
              </div>

              {/* Video Element (Simulation uses webcam, Flask uses img tag) */}
              <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-80" />

                {/* Simulated Face Box */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 rounded-xl transition-colors duration-300 flex flex-col items-center justify-between py-2 ${data.masker ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10'}`}>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded ${data.masker ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'}`}>
                    {data.masker ? 'MASK DETECTED' : 'NO MASK'}
                  </span>
                  <ScanFace className={`w-8 h-8 opacity-50 ${data.masker ? 'text-emerald-500' : 'text-red-500'}`} />
                </div>
              </div>

              {/* Grid Overlay Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
            </div>

            {/* System Status Log (Decorative) */}
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 backdrop-blur-sm font-mono text-xs text-slate-500 dark:text-slate-400">
              <p>&gt; System initialized...</p>
              <p>&gt; Camera module connected.</p>
              <p>&gt; MLX90614 sensor active.</p>
              <p>&gt; MAX30102 sensor active.</p>
              <p className="animate-pulse">&gt; Waiting for subject...</p>
            </div>
          </div>

          {/* Right Column: Data Metrics */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Status Card (Big) */}
            <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-500 shadow-xl flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden ${data.status === 'DIIZINKAN'
                ? 'bg-emerald-500/10 border-emerald-500/50 dark:bg-emerald-950/30'
                : 'bg-red-500/10 border-red-500/50 dark:bg-red-950/30'
              }`}>
              <div className={`absolute inset-0 opacity-10 ${data.status === 'DIIZINKAN'
                  ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 to-transparent'
                  : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-400 to-transparent'
                }`}></div>

              <div className={`p-4 rounded-full mb-2 ${data.status === 'DIIZINKAN' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                {data.status === 'DIIZINKAN' ? <ShieldCheck className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
              </div>

              <div>
                <h2 className={`text-4xl md:text-5xl font-display font-bold tracking-tight mb-2 ${data.status === 'DIIZINKAN' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                  {data.status}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">{data.pesan}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Suhu */}
              <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suhu Tubuh</span>
                  <Thermometer className="w-5 h-5 text-amber-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-display font-bold ${data.suhu > 37.5 ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                      {data.suhu}
                    </span>
                    <span className="text-sm text-slate-400">°C</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${data.suhu > 37.5 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${((data.suhu - 35) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* SpO2 */}
              <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SpO2</span>
                  <Activity className="w-5 h-5 text-cyan-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-display font-bold ${data.spo2 < 95 ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                      {data.spo2}
                    </span>
                    <span className="text-sm text-slate-400">%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${data.spo2 < 95 ? 'bg-red-500' : 'bg-cyan-500'}`}
                      style={{ width: `${data.spo2}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Masker Status (Full Width in Grid) */}
              <div className="col-span-2 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${data.masker ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                    {data.masker ? <UserCheck className="w-6 h-6" /> : <UserX className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Deteksi Masker</span>
                    <span className={`text-xl font-bold ${data.masker ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {data.masker ? 'Terdeteksi' : 'Tidak Terdeteksi'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Info Box */}
            <div className="mt-auto bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-500/20 p-4 rounded-2xl">
              <h4 className="text-indigo-900 dark:text-indigo-200 font-bold text-sm mb-1">Mode Simulasi</h4>
              <p className="text-indigo-700 dark:text-indigo-400 text-xs leading-relaxed">
                Tampilan ini adalah preview React. Gunakan file <code>app.py</code> dan <code>templates/index.html</code> yang telah digenerate untuk menjalankan sistem asli di Raspberry Pi Anda.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;