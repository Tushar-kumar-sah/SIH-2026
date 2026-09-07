'use client';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-deep">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌱</span>
              <span className="text-lg font-bold font-[family-name:var(--font-outfit)] text-slate-100">
                CropShield <span className="gradient-text-blue">IQ</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              AI-Powered Crop Disease Detection & Integrated Pest Management Platform.
              Early detection saves crops, protects yields, empowers farmers.
            </p>
          </div>

          {/* SIH Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 font-[family-name:var(--font-outfit)]">SIH 2026 Submission</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>📋 Problem Statement ID: <span className="text-saffron font-medium">26131</span></li>
              <li>👥 Team: <span className="text-slate-300 font-medium">CodeNova (STCET-17)</span></li>
              <li>🏛️ Nodal: <span className="text-slate-400">Govt of Maharashtra / MSInS</span></li>
              <li>📅 Event: <span className="text-neon-blue font-medium">Smart India Hackathon 2026</span></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 font-[family-name:var(--font-outfit)]">Technology Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {['React / Next.js', 'Python', 'PyTorch', 'YOLOv8', 'TensorFlow Lite', 'Fast-API', 'Redux Toolkit', 'Gemini 1.5 API', 'Web Speech API', 'Framer Motion', 'Tailwind CSS'].map((tech) => (
                <span
                  key={tech}
                  className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © 2026 Team CodeNova. Built for Smart India Hackathon 2026.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-health opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-health"></span>
            </span>
            <span className="text-xs text-slate-500">System Online — Prototype Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
