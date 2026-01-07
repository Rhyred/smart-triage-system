import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, ArrowRight, PlayCircle, CheckCircle, 
  Scan, ThermometerSun, Activity, BellRing, 
  ShieldCheck
} from 'lucide-react';

declare global {
  interface Window {
    AOS: any;
  }
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load AOS library for scroll animations
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
    script.async = true;
    script.onload = () => {
      if (window.AOS) {
        window.AOS.init({
          duration: 800,
          once: true,
          offset: 100,
          easing: 'ease-out-cubic'
        });
      }
    };
    document.body.appendChild(script);

    // Smooth scroll for anchors
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#')) {
        const id = target.href.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  type Member = {
    name: string;
    initials: string;
    photo: string;
    role: string;
  };

  const teamMembers: Member[] = [
    { name: 'Moch. Riezky Dwi Kuswanto', initials: 'MR', photo: 'public/riezky.jpg', role: 'AI/ML' },
    { name: 'Robi Rizki Permana', initials: 'RR', photo: '/public/rr.jpg', role: 'Team Manager Developers' },
    { name: 'Dila Amelisa Sapitri', initials: 'DA', photo: '/public/da.jpg', role: 'Backend' },
    { name: 'Ratu Syifa Nur Felisha', initials: 'RS', photo: '/public/rs.jpg', role: 'Frontend' },
    { name: 'Mochammad Sayyid A.', initials: 'MS', photo: '/public//ms.jpg', role: 'IoT Specialist' },
  ];

  const handleDemo = () => {
    navigate('/triage');
  };

  return (
    <div className="bg-slate-950 text-slate-200 antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background FX */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-black z-0 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none brightness-100 contrast-150"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 p-2 rounded-lg">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">Smart Triage</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">Tentang</a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">Fitur</a>
            <a href="#team" className="hover:text-cyan-400 transition-colors">Tim Kami</a>
          </div>

          <button 
            onClick={handleDemo}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2">
            <span>Buka Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <div data-aos="fade-down" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-cyan-400 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Project Akhir • Error 404
        </div>
        
        <h1 data-aos="fade-up" data-aos-delay="100" className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 text-white max-w-4xl">
          Skrining Kesehatan <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            Otomatis & Tanpa Kontak
          </span>
        </h1>
        
        <p data-aos="fade-up" data-aos-delay="200" className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Inovasi sistem triase cerdas berbasis AI dan IoT menggunakan Raspberry Pi 4. Mendeteksi masker, suhu tubuh, dan SpO2 secara real-time untuk keamanan fasilitas kesehatan.
        </p>
        
        <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleDemo}
            className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Lihat Demo Langsung
          </button>
          <a href="#about" className="px-8 py-4 bg-slate-800/50 text-white font-medium border border-white/10 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center">
            Pelajari Lebih Lanjut
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900/30 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Mengapa <span className="text-cyan-400">Smart Triage?</span>
            </h2>
            <div className="space-y-6 text-slate-400">
              <p className="leading-relaxed">
                Triase manual konvensional memiliki risiko tinggi penularan penyakit menular dan memakan waktu tenaga medis. Kontak fisik langsung saat pengecekan suhu dan oksigen seringkali tidak terhindarkan.
              </p>
              <p className="leading-relaxed">
                Solusi kami mengintegrasikan <strong className="text-slate-200">Computer Vision</strong> dan <strong className="text-slate-200">Sensor IoT</strong> untuk melakukan skrining awal secara mandiri. Sistem ini secara otomatis memberikan status "DIIZINKAN" atau "DITOLAK" berdasarkan parameter kesehatan vital pengunjung.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Mengurangi kontak fisik (Contactless)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Respon cepat &lt; 2 detik</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Akurasi tinggi dengan Sensor Medis</span>
                </li>
              </ul>
            </div>
          </div>
          <div data-aos="fade-left" className="relative">
            {/* Abstract Illustration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl text-center">
                  <ThermometerSun className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">36.5°C</div>
                  <div className="text-xs text-slate-500">Suhu Normal</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl text-center border border-emerald-500/30">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-emerald-400">OK</div>
                  <div className="text-xs text-slate-500">Akses Diterima</div>
                </div>
                <div className="col-span-2 bg-slate-950/50 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                    <Scan className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">AI Face Mask Detection</div>
                    <div className="text-xs text-slate-500">OpenCV + Haar Cascade</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div data-aos="fade-up" className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Fitur Utama</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Sistem terintegrasi yang menggabungkan hardware dan software untuk hasil yang presisi.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div data-aos="fade-up" data-aos-delay="0" className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
              <Scan className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Mask Detection</h3>
            <p className="text-sm text-slate-400">Mendeteksi penggunaan masker pada wajah menggunakan algoritma Computer Vision secara real-time.</p>
          </div>

          {/* Feature 2 */}
          <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
              <ThermometerSun className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">IR Thermometer</h3>
            <p className="text-sm text-slate-400">Pengukuran suhu tubuh tanpa kontak menggunakan sensor MLX90614 dengan akurasi medis.</p>
          </div>

          {/* Feature 3 */}
          <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">SpO2 Monitor</h3>
            <p className="text-sm text-slate-400">Memantau tingkat saturasi oksigen dalam darah menggunakan sensor MAX30102.</p>
          </div>

          {/* Feature 4 */}
          <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-rose-500/30 transition-colors">
            <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mb-4">
              <BellRing className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Alert</h3>
            <p className="text-sm text-slate-400">Notifikasi visual dan suara buzzer otomatis jika parameter kesehatan tidak normal.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-slate-900/30 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div data-aos="fade-up" className="mb-16">
            <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase mb-2 block">Developers</span>
            <h2 className="font-display text-4xl font-bold text-white">
              Tim <span className="text-red-500 font-mono">&lt;Error 404/&gt;</span>
            </h2>
            <p className="text-slate-400 mt-4">Institut Teknologi Nasional Bandung</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {teamMembers.map((member, idx) => (
              <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 100} className="group flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-slate-700 group-hover:border-cyan-500 transition-colors overflow-hidden mb-4 relative shadow-xl bg-slate-800">
<img
  src={member.photo}
  alt={member.name}
  loading="lazy"
  onError={(e) => {
    const img = e.currentTarget as HTMLImageElement;
    if (!img.dataset.fallback) {
      img.dataset.fallback = 'true';
      img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        member.initials
      )}&background=0f172a&color=22d3ee`;
    }
  }}
  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
/>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight w-40">
                  {member.name}
                </h3>
                <span className="text-xs text-cyan-500 uppercase tracking-wider mt-1 font-medium">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-slate-500" />
            <span className="text-slate-300 font-display font-bold">Smart Triage System</span>
          </div>
          
          <div className="text-slate-500 text-sm text-center md:text-right">
            <p>&copy; 2025 Tim Error 404.</p>
            <p>Institut Teknologi Nasional Bandung</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
