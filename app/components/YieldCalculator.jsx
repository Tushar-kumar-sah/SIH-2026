'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { crops } from '../data/diseases';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function YieldCalculator() {
  const [farmSize, setFarmSize] = useState(5);
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);

  const savings = useMemo(() => {
    const total = farmSize * selectedCrop.yieldPerAcre;
    const saved = total * 0.35;
    return { total, saved };
  }, [farmSize, selectedCrop]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="yield" className="relative py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-health/10 text-health border border-health/20 mb-4">
            💰 ROI Impact Analysis
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-outfit)] text-slate-100 mb-3">
            Crop Loss & <span className="gradient-text-green">ROI Savings</span> Calculator
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Calculate the estimated monetary value of crop destruction prevented by CropShield IQ&apos;s early detection system.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <div className="max-w-3xl mx-auto glass-card p-6 lg:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-6">
                {/* Farm Size Slider */}
                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-300">Farm Size</span>
                    <span className="text-sm font-bold text-neon-blue font-[family-name:var(--font-outfit)]">{farmSize} Acres</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={farmSize}
                    onChange={(e) => setFarmSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-blue [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-slate-600">1 acre</span>
                    <span className="text-[10px] text-slate-600">100 acres</span>
                  </div>
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Crop Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {crops.map((crop) => (
                      <button
                        key={crop.id}
                        onClick={() => setSelectedCrop(crop)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          selectedCrop.id === crop.id
                            ? 'bg-health/15 border-health/40 text-health'
                            : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-white/[0.15]'
                        }`}
                      >
                        {crop.emoji} {crop.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                  <p className="text-[10px] text-slate-500 mb-1">Calculation Basis</p>
                  <p className="text-xs text-slate-400">
                    Average yield of {selectedCrop.emoji} {selectedCrop.name}:{' '}
                    <span className="font-medium text-slate-300">{formatCurrency(selectedCrop.yieldPerAcre)}/acre</span>
                    &nbsp;× 35% early detection savings
                  </p>
                </div>
              </div>

              {/* Output */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">Estimated Crop Destruction Prevented</p>
                  <motion.p
                    key={`${farmSize}-${selectedCrop.id}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-outfit)] text-health"
                  >
                    {formatCurrency(savings.saved)}
                  </motion.p>
                  <p className="text-xs text-slate-500 mt-2">
                    out of {formatCurrency(savings.total)} total yield value
                  </p>
                </div>

                <div className="w-full bg-slate-800/50 rounded-xl p-4 border border-white/[0.05]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-500">Without CropShield</span>
                    <span className="text-[10px] text-slate-500">With CropShield</span>
                  </div>
                  <div className="relative h-3 bg-danger/20 rounded-full overflow-hidden">
                    <motion.div
                      key={`bar-${farmSize}-${selectedCrop.id}`}
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-health to-emerald-400 rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium text-danger">-35% Loss</span>
                    <span className="text-xs font-medium text-health">+35% Saved ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
