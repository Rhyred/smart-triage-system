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
    Moon,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Tipe data untuk health data
interface HealthData {
    temperature: number;
    spo2: number;
    heartRate?: number;
    bloodPressure?: {
        systolic: number;
        diastolic: number;
    };
    respiratoryRate?: number;
    symptoms: string[];
    status: string;
    message: string;
    riskLevel: string;
    recommendations: string[];
    vision_insights?: string[];
    analysis_method?: string;
}

interface SensorData {
    suhu: number;
    spo2: number;
    masker: boolean;
    status: 'DIIZINKAN' | 'DITOLAK';
    pesan: string;
}

const TriageSystem: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<SensorData>({
        suhu: 36.5,
        spo2: 98,
        masker: true,
        status: 'DIIZINKAN',
        pesan: 'Silakan Masuk'
    });
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
            setData(prev => ({
                ...prev,
                suhu: 36.0 + Math.random() * 3, // 36-39°C
                spo2: 95 + Math.random() * 5, // 95-100%
                masker: Math.random() > 0.3 // 70% chance of wearing mask
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Camera access
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
            }
        };

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Capture image from camera
    const captureImage = (): string | null => {
        if (!videoRef.current || !canvasRef.current) return null;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        return canvas.toDataURL('image/jpeg', 0.8);
    };

    // Analyze health data
    const analyzeHealth = async () => {
        setIsAnalyzing(true);

        try {
            const imageData = captureImage();

            const requestData = {
                temperature: data.suhu,
                spo2: Math.round(data.spo2),
                heartRate: 75 + Math.floor(Math.random() * 40), // Mock heart rate
                bloodPressure: {
                    systolic: 110 + Math.floor(Math.random() * 40),
                    diastolic: 70 + Math.floor(Math.random() * 30)
                },
                respiratoryRate: 12 + Math.floor(Math.random() * 12),
                imageData: imageData
            };

            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const result = await response.json();
                setHealthData(result.healthData);

                // Update status based on analysis
                setData(prev => ({
                    ...prev,
                    status: result.healthData.riskLevel === 'CRITICAL' ? 'DITOLAK' : 'DIIZINKAN',
                    pesan: result.healthData.message
                }));
            } else {
                console.error('Analysis failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error analyzing health:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DIIZINKAN': return 'text-green-400';
            case 'DITOLAK': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'LOW': return 'text-green-400 bg-green-400/10';
            case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/10';
            case 'HIGH': return 'text-orange-400 bg-orange-400/10';
            case 'CRITICAL': return 'text-red-400 bg-red-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Kembali ke Beranda
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Smart Health Triage System
                        </h1>
                        <p className="text-slate-400">AI-Powered Health Assessment</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-slate-300">System Online</span>
                    </div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Camera Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <ScanFace className="text-cyan-400" size={24} />
                            <h2 className="text-xl font-semibold">Camera Analysis</h2>
                        </div>

                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-64 bg-slate-900 rounded-lg object-cover"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={analyzeHealth}
                                disabled={isAnalyzing}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                            >
                                {isAnalyzing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Analyzing...
                                    </div>
                                ) : (
                                    'Analyze Health'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Health Analysis Results */}
                    {healthData && (
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-4">
                                <Activity className="text-green-400" size={24} />
                                <h2 className="text-xl font-semibold">Health Analysis Results</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <div className="text-sm text-slate-400 mb-1">Risk Level</div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(healthData.riskLevel)}`}>
                                        {healthData.riskLevel}
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <div className="text-sm text-slate-400 mb-1">Analysis Method</div>
                                    <div className="text-white font-medium">
                                        {healthData.analysis_method || 'Sensor Only'}
                                    </div>
                                </div>
                            </div>

                            {healthData.symptoms.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-sm text-slate-400 mb-2">Detected Symptoms</div>
                                    <div className="flex flex-wrap gap-2">
                                        {healthData.symptoms.map((symptom, index) => (
                                            <span key={index} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                                                {symptom}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {healthData.vision_insights && healthData.vision_insights.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-sm text-slate-400 mb-2">Visual Analysis</div>
                                    <div className="space-y-2">
                                        {healthData.vision_insights.map((insight, index) => (
                                            <div key={index} className="text-cyan-400 text-sm">
                                                {insight}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="text-sm text-slate-400 mb-2">Recommendations</div>
                                <ul className="space-y-1">
                                    {healthData.recommendations.map((rec, index) => (
                                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                                            <span className="text-cyan-400 mt-1">•</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sensor Data Panel */}
                <div className="space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <Cpu className="text-blue-400" size={24} />
                            <h2 className="text-xl font-semibold">Sensor Data</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Thermometer className="text-red-400" size={20} />
                                    <span className="text-slate-300">Temperature</span>
                                </div>
                                <span className="font-mono text-lg">{data.suhu.toFixed(1)}°C</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Activity className="text-blue-400" size={20} />
                                    <span className="text-slate-300">SpO2</span>
                                </div>
                                <span className="font-mono text-lg">{Math.round(data.spo2)}%</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-green-400" size={20} />
                                    <span className="text-slate-300">Mask Status</span>
                                </div>
                                <span className={`font-medium ${data.masker ? 'text-green-400' : 'text-red-400'}`}>
                                    {data.masker ? 'Worn' : 'Not Worn'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Panel */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="text-yellow-400" size={24} />
                            <h2 className="text-xl font-semibold">Access Status</h2>
                        </div>

                        <div className="text-center">
                            <div className={`text-4xl font-bold mb-2 ${getStatusColor(data.status)}`}>
                                {data.status}
                            </div>
                            <p className="text-slate-300">{data.pesan}</p>
                        </div>

                        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                            <div className="text-sm text-slate-400 mb-1">Last Updated</div>
                            <div className="text-white font-mono">
                                {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TriageSystem;