'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  { value: '98.4%', label: 'AI Diagnostic Accuracy', icon: '🎯', color: 'neon-blue' },
  { value: '< 1.2s', label: 'Inference Latency', icon: '⚡', color: 'saffron' },
  { value: '1,20,000+', label: 'Farmers Monitored', icon: '👨🌾', color: 'health' },
  { value: '35%', label: 'Yield Saved / Acre', icon: '📈', color: 'health' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function HeroSection() {
  const [count, setCount] = useState(0);
  
  // Simulated counter for 'farmers monitored'
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev < 120000 ? prev + 1731 : 120000));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-neon-blue/5 blur-[120px]" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-saffron/5 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text */}
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-blue"></span>
                </span>
                PS ID: 26131 — Live AI Prototype
              </span>
            </motion.div>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[family-name:var(--font-outfit)] leading-tight mb-6"
            >
              Early Detection &{' '}
              <span className="gradient-text-blue">Management</span> of Crop
              Diseases &{' '}
              <span className="gradient-text-saffron">Pests</span>
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-xl"
            >
              Transforming Indian agriculture with computer vision, micro-climate
              predictive modeling, integrated pest management (IPM), and
              zero-latency voice advisories in regional languages.
            </motion.p>

            {/* Stat Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  custom={i + 3}
                  className="glass-card p-4 group hover:border-white/[0.15] transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{stat.icon}</span>
                    <span
                      className={`text-xl sm:text-2xl font-bold font-[family-name:var(--font-outfit)] ${
                        stat.color === 'neon-blue'
                          ? 'text-neon-blue'
                          : stat.color === 'saffron'
                          ? 'text-saffron'
                          : 'text-health'
                      }`}
                    >
                      {stat.label === 'Farmers Monitored'
                        ? `${count.toLocaleString('en-IN')}+`
                        : stat.value}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right column - Scanner Feed Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="glass-card p-3 glow-blue">
              {/* Scanner header */}
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-health opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-health"></span>
                  </span>
                  <span className="text-xs font-medium text-slate-400">LIVE FEED — YOLOv8 Inference</span>
                </div>
                <span className="text-[10px] font-mono text-slate-600">FPS: 28.4 | GPU: RTX 3060</span>
              </div>

              {/* Scanner viewport */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-green-950/50 via-emerald-950/30 to-green-950/50">
                {/* Simulated leaf background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[120px] opacity-20 float">🍃</div>
                </div>
                
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-grid opacity-30" />

                {/* Scanning line */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-health to-transparent scan-line shadow-[0_0_10px_rgba(16,185,129,0.8)]" />

                {/* YOLOv8 Bounding boxes */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Bounding Box 1 */}
                  <rect
                    x="15%" y="18%" width="35%" height="32%"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                    className="bbox-animate"
                    rx="4"
                  />
                  <rect x="15%" y="14%" width="auto" height="16" fill="#ef4444" rx="2" />
                  <text x="16%" y="14%" dy="12" className="text-[9px] fill-white font-mono font-bold">Early Blight — 96.4%</text>

                  {/* Bounding Box 2 */}
                  <rect
                    x="55%" y="45%" width="28%" height="28%"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                    className="bbox-animate"
                    style={{ animationDelay: '0.5s' }}
                    rx="4"
                  />
                  <text x="56%" y="44%" className="text-[9px] fill-yellow-400 font-mono font-bold">Lesion B — 91.2%</text>
                </svg>

                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-health/60" />
                <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-health/60" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 border-health/60" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-health/60" />

                {/* Info overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-health/80 bg-black/40 px-2 py-0.5 rounded">
                    MODEL: YOLOv8n-crop-v3.pt
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded">
                    1024×768 • INT8 Quantized
                  </span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 glass-card px-4 py-2 glow-saffron float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="text-xs font-bold text-saffron">Real-Time Protection</p>
                  <p className="text-[10px] text-slate-500">TFLite Edge Inference</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
