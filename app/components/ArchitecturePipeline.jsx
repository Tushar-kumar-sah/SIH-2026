'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    icon: '📡',
    title: 'Field Data Ingestion',
    subtitle: 'Multispectral & Mobile Photo',
    details: ['Drone/satellite NDVI capture', 'Mobile camera with Cloud-inary upload', 'IoT soil & weather sensors', 'ISRO Bhuvan GIS integration'],
    color: 'neon-blue',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  {
    icon: '🧠',
    title: 'AI Inference Engine',
    subtitle: 'YOLOv8 + TensorFlow Lite',
    details: ['YOLOv8n lesion detection', 'ResNet-50 disease classification', 'TFLite INT8 edge quantization', 'Ensemble confidence scoring'],
    color: 'saffron',
    gradient: 'from-orange-500/20 to-orange-600/5',
  },
  {
    icon: '🌿',
    title: 'IPM & Voice Advisory',
    subtitle: 'CIB&RC + Bhashini Voice',
    details: ['Biological remedy selection', 'CIB&RC chemical dosage & PHI', 'Cultural practice guidance', 'Regional voice via Bhashini API'],
    color: 'health',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    icon: '📢',
    title: 'Officer Triage & Alerts',
    subtitle: 'Omnichannel Broadcast',
    details: ['Auto-escalation to KVK officer', 'WhatsApp & SMS alerts', 'Dashboard for Agri. Dept.', 'Outbreak trend analytics'],
    color: 'danger',
    gradient: 'from-red-500/20 to-red-600/5',
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export default function ArchitecturePipeline() {
  return (
    <section id="architecture" className="relative py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-saffron/10 text-saffron border border-saffron/20 mb-4">
            ⚙️ System Design
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-outfit)] text-slate-100 mb-3">
            Technical Architecture <span className="gradient-text-saffron">Pipeline</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            End-to-end data flow from field capture to farmer advisory — designed for sub-1.2s latency on edge devices.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative"
        >
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-neon-blue/30 via-saffron/30 to-danger/30 -translate-y-1/2 z-0" />

          {steps.map((step, i) => (
            <motion.div key={step.title} variants={fadeIn} custom={i} className="relative z-10">
              <div className={`glass-card p-5 h-full hover:border-white/[0.15] transition-all duration-300 group bg-gradient-to-b ${step.gradient}`}>
                {/* Step number */}
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold mb-4 ${
                  step.color === 'neon-blue' ? 'bg-neon-blue/15 text-neon-blue' :
                  step.color === 'saffron' ? 'bg-saffron/15 text-saffron' :
                  step.color === 'health' ? 'bg-health/15 text-health' :
                  'bg-danger/15 text-danger'
                }`}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                <span className="text-3xl block mb-3">{step.icon}</span>
                <h3 className="text-sm font-bold font-[family-name:var(--font-outfit)] text-slate-200 mb-1">{step.title}</h3>
                <p className="text-[11px] text-slate-500 mb-3">{step.subtitle}</p>

                <ul className="space-y-1.5">
                  {step.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                      <span className={`mt-1 flex-shrink-0 w-1 h-1 rounded-full ${
                        step.color === 'neon-blue' ? 'bg-neon-blue/60' :
                        step.color === 'saffron' ? 'bg-saffron/60' :
                        step.color === 'health' ? 'bg-health/60' :
                        'bg-danger/60'
                      }`} />
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Arrow (between cards on desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
