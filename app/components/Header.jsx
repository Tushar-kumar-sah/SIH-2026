'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'AI Diagnosis Studio', href: '#diagnosis' },
  { label: 'Outbreak Heatmap', href: '#heatmap' },
  { label: 'Yield Savings', href: '#yield' },
  { label: 'System Architecture', href: '#architecture' },
];

export default function Header({ language, setLanguage, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-deep/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-slate-100">
                CropShield <span className="gradient-text-blue">IQ</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-saffron/20 text-saffron border border-saffron/30">
                SIH 2026
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Bar */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="hidden sm:block bg-white/[0.05] border border-white/[0.1] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neon-blue/50 cursor-pointer"
            >
              <option value="en" className="bg-slate-900">🌐 English</option>
              <option value="hi" className="bg-slate-900">🇮🇳 हिंदी</option>
              <option value="mr" className="bg-slate-900">🇮🇳 मराठी</option>
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center hover:bg-white/[0.1] transition-all duration-300 group"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </motion.div>
            </button>

            {/* Scan CTA */}
            <button
              onClick={() => scrollTo('#diagnosis')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-saffron to-orange-500 text-white text-sm font-semibold shadow-lg shadow-saffron/25 hover:shadow-saffron/40 hover:scale-105 transition-all duration-300"
            >
              <span>⚡</span>
              <span className="hidden sm:inline">Scan Leaf Now</span>
              <span className="sm:hidden">Scan</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-white/[0.06] bg-deep/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="sm:hidden w-full mt-2 bg-white/[0.05] border border-white/[0.1] text-slate-300 text-xs rounded-lg px-3 py-2"
              >
                <option value="en" className="bg-slate-900">🌐 English</option>
                <option value="hi" className="bg-slate-900">🇮🇳 हिंदी</option>
                <option value="mr" className="bg-slate-900">🇮🇳 मराठी</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
