'use client';

import { useState, useEffect, useCallback } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import DiagnosisStudio from './components/DiagnosisStudio';
import OutbreakHeatmap from './components/OutbreakHeatmap';
import YieldCalculator from './components/YieldCalculator';
import ArchitecturePipeline from './components/ArchitecturePipeline';
import EscalationModal from './components/EscalationModal';
import Footer from './components/Footer';

export default function Home() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [modalOpen, setModalOpen] = useState(false);
  const [escalatedDisease, setEscalatedDisease] = useState(null);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('cropshield-theme');
    if (saved) setTheme(saved);
  }, []);

  // Apply theme to DOM and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cropshield-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleEscalate = (disease) => {
    setEscalatedDisease(disease);
    setModalOpen(true);
  };

  return (
    <main className="min-h-screen transition-colors duration-500">
      <AnnouncementBar />
      <Header language={language} setLanguage={setLanguage} theme={theme} toggleTheme={toggleTheme} />
      <HeroSection />
      <DiagnosisStudio language={language} onEscalate={handleEscalate} />
      <OutbreakHeatmap />
      <YieldCalculator />
      <ArchitecturePipeline />
      <Footer />
      <EscalationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        disease={escalatedDisease}
      />
    </main>
  );
}
