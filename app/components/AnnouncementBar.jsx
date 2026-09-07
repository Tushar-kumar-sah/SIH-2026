'use client';

export default function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-neon-blue/10 via-saffron/10 to-health/10 border-b border-white/[0.06] py-2">
      <div className="flex items-center gap-3 ticker-scroll whitespace-nowrap">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-health opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-health pulse-dot"></span>
            </span>
            <span className="text-xs font-medium text-slate-300 tracking-wide">
              SIH 2026 Finalist Prototype &nbsp;•&nbsp; Problem Statement ID: 26131 &nbsp;•&nbsp; Team CodeNova (STCET-17) &nbsp;•&nbsp; Govt of Maharashtra & MSInS Initiative &nbsp;•&nbsp;
              Early Detection & Management of Crop Diseases and Pest Infestations &nbsp;•&nbsp;
              AI-Powered CropShield IQ Platform — Live Demo
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
