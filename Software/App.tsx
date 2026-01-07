import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TriageSystem from './components/TriageSystem';
import IntroScreen from './components/IntroScreen';
import LandingPage from './components/LandingPage';

function App() {
  const [stage, setStage] = useState<'intro' | 'landing' | 'triage'>('intro');

  const handleIntroComplete = () => {
    setStage('landing');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          stage === 'intro' ? (
            <IntroScreen onComplete={handleIntroComplete} />
          ) : stage === 'landing' ? (
            <LandingPage />
          ) : (
            <Navigate to="/triage" replace />
          )
        } />
        <Route path="/triage" element={<TriageSystem />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

