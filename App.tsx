import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TriageSystem from './components/TriageSystem';

function App() {
  const [landingHtml, setLandingHtml] = useState<string>('');

  useEffect(() => {
    fetch('/landing.html')
      .then(res => res.text())
      .then(html => setLandingHtml(html))
      .catch(err => console.error('Error loading landing.html:', err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div dangerouslySetInnerHTML={{ __html: landingHtml }} />
        } />
        <Route path="/triage" element={<TriageSystem />} />
      </Routes>
    </Router>
  );
}

export default App;

