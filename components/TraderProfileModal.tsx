
import React, { useState, useEffect } from 'react';
import { Trader } from '../types';
import { getTraderEdgeFast } from '../services/geminiService';

interface TraderProfileModalProps {
  trader: Trader;
  onClose: () => void;
  onCopyClick: () => void;
}

const useCountUp = (endValue: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function: easeOutExpo
      const easedPercentage = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(easedPercentage * endValue);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [endValue, duration]);

  return count;
};

const getRiskLabel = (score: number) => {
  if (score <= 3) return { label: 'LOW RISK', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
  if (score <= 7) return { label: 'MEDIUM RISK', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
  return { label: 'HIGH RISK', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
};

const TraderProfileModal: React.FC<TraderProfileModalProps> = ({ trader, onClose, onCopyClick }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const risk = getRiskLabel(trader.riskScore);
  
  // Animated Stats
  const animatedRoi = useCountUp(trader.roi);
  const animatedWinRate = useCountUp(trader.winRate);
  const animatedDrawdown = useCountUp(trader.drawdown);

  useEffect(() => {
    const fetchInsight = async () => {
      const summary = await getTraderEdgeFast(trader.bio);
      setAiInsight(summary);
    };
    fetchInsight();
  }, [trader]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/98 backdrop-blur-2xl overflow-y-auto">
      <div className="bg-[#131722] border border-[#2a2e39] w-full max-w-6xl my-auto rounded-[2.5rem] flex flex-col overflow-hidden animate-in zoom-in-95 shadow-[0_0_150px_rgba(0,0,0,1)]">
        
        {/* HEADER IDENTITY */}
        <div className="p-8 lg:p-14 bg-gradient-to-b from-[#1e222d] to-[#131722] border-b border-[#2a2e39] relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f01a64]/5 rounded-full filter blur-[100px] -mr-32 -mt-32"></div>
          
          <button onClick={onClose} className="absolute top-6 right-6 lg:top-10 lg:right-10 text-gray-600 hover:text-white transition-all p-3 hover:bg-white/5 rounded-full z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center lg:items-start relative z-10">
            <div className="relative shrink-0">
              <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-[3rem] overflow-hidden border-4 border-[#2a2e39] shadow-2xl transition-transform hover:scale-105 duration-500">
                <img src={trader.avatar} className="w-full h-full object-cover" alt={trader.name} />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#00b36b] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl whitespace-nowrap border-4 border-[#131722]">
                VERIFIED ALPHA
              </div>
            </div>
            
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div>
                <h2 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-3">
                  {trader.name}
                </h2>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    ID: CLUSTER-{trader.id}992
                  </span>
                  <span className="bg-[#f01a64]/10 border border-[#f01a64]/20 px-4 py-1.5 rounded-xl text-[9px] font-black text-[#f01a64] uppercase tracking-widest">
                    {trader.type} ELITE
                  </span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-xl text-[9px] font-black text-emerald-400 uppercase tracking-widest italic">
                    {trader.experienceYears} Years Market Dominance
                  </span>
                </div>
              </div>

              {/* AI Strategic Insight */}
              <div className="bg-[#1e222d]/50 border-l-4 border-[#f01a64] p-6 lg:p-8 rounded-r-3xl">
                <span className="text-[10px] font-black text-[#f01a64] uppercase tracking-[0.4em] block mb-3">Astra Neural Strategy Extract</span>
                <p className="text-white font-bold text-lg lg:text-2xl leading-tight italic max-w-4xl">
                  "{aiInsight || "Synchronizing with mentor's neural trade history..."}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PERFORMANCE & STRATEGY SECTIONS */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-14 bg-[#131722] no-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
            
            <div className="xl:col-span-3 space-y-12">
              
              {/* PRIMARY KPI GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-[#1e222d] border border-[#2a2e39] p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all hover:border-[#00b36b] group overflow-hidden">
                  <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-3 group-hover:text-[#00b36b]">Total Profit %</span>
                  <span className="text-2xl lg:text-5xl font-black text-emerald-400 tracking-tighter tabular-nums">
                    +{animatedRoi.toLocaleString(undefined, { maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className="bg-[#1e222d] border border-[#2a2e39] p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all hover:border-white group overflow-hidden">
                  <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-3 group-hover:text-white">Win Rate</span>
                  <span className="text-2xl lg:text-5xl font-black text-white tracking-tighter tabular-nums">
                    {animatedWinRate.toLocaleString(undefined, { maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className="bg-[#1e222d] border border-[#2a2e39] p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all hover:border-rose-500 group overflow-hidden">
                  <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-3 group-hover:text-rose-500">Max Drawdown</span>
                  <span className="text-2xl lg:text-5xl font-black text-rose-500 tracking-tighter tabular-nums">
                    -{animatedDrawdown.toLocaleString(undefined, { maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className="bg-[#1e222d] border border-[#2a2e39] p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all hover:border-amber-500 group">
                  <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-3 group-hover:text-amber-500">Safety Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl lg:text-5xl font-black tracking-tighter ${risk.color}`}>{trader.riskScore}</span>
                    <span className="text-xs text-gray-600 font-black">/10</span>
                  </div>
                </div>
              </div>

              {/* STRATEGY & RISK SECTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* STRATEGY SUMMARY SECTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-0.5 w-12 bg-[#f01a64]"></div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Trading Strategy Summary</h4>
                  </div>
                  <div className="bg-[#1e222d]/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6 min-h-[280px]">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-[#f01a64]/10 rounded-2xl">
                          <svg className="w-6 h-6 text-[#f01a64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <span className="text-white font-black text-sm uppercase tracking-tight">Technical Execution Logic</span>
                     </div>
                     <p className="text-gray-300 text-sm lg:text-lg leading-relaxed font-bold italic border-b border-white/5 pb-6">
                        {trader.strategy}
                     </p>
                     <div className="space-y-2">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block">Mentor Background</span>
                        <p className="text-gray-500 text-xs leading-relaxed font-medium">{trader.bio}</p>
                     </div>
                  </div>
                </div>

                {/* RISK PROFILE SECTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-0.5 w-12 bg-amber-500"></div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Risk Score Assessment</h4>
                  </div>
                  <div className={`p-8 rounded-[2.5rem] border ${risk.border} ${risk.bg} space-y-8 min-h-[280px]`}>
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Risk Profile</span>
                          <span className={`text-xl font-black uppercase tracking-[0.1em] ${risk.color}`}>{risk.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Numeric Index</span>
                          <span className={`text-2xl font-black ${risk.color}`}>{trader.riskScore}.0</span>
                        </div>
                     </div>
                     
                     <div className="relative h-3 w-full bg-black/40 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${risk.color.replace('text', 'bg')}`} style={{ width: `${trader.riskScore * 10}%` }}></div>
                        <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none">
                           {[...Array(11)].map((_, i) => <div key={i} className="w-[1px] h-1 bg-white/10"></div>)}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <span className="text-[9px] text-white/40 font-black uppercase tracking-widest block">Mitigation Protocols Active</span>
                        <div className="grid grid-cols-1 gap-3">
                          {trader.riskMethods.map((method, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                               <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{method}</span>
                            </div>
                          ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* MARKET COVERAGE GRID */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-0.5 w-12 bg-blue-500"></div>
                  <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Market Penetration</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                   {trader.markets.map(m => (
                      <div key={m} className="bg-[#1e222d] border border-[#2a2e39] px-6 py-3 rounded-2xl text-[10px] font-black text-gray-300 uppercase tracking-widest hover:border-blue-500 transition-colors">
                        {m}
                      </div>
                   ))}
                   <div className="bg-blue-500/10 border border-blue-500/20 px-6 py-3 rounded-2xl text-[10px] font-black text-blue-400 uppercase tracking-widest italic">
                      Average Hold: {trader.avgDuration}
                   </div>
                </div>
              </div>
            </div>

            {/* CLONE TERMINAL ACTION PANEL */}
            <div className="xl:col-span-1">
              <div className="bg-gradient-to-b from-[#1e222d] to-black border border-[#2a2e39] p-8 lg:p-10 rounded-[3rem] shadow-2xl sticky top-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#f01a64] rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-[0_20px_50px_rgba(240,26,100,0.3)] transform -rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-white font-black text-2xl mb-2 uppercase tracking-tighter italic">Clone Alpha</h4>
                <p className="text-[10px] text-gray-500 uppercase font-black mb-10 leading-relaxed tracking-widest">
                  Connect your capital to {trader.name}'s institutional trade cluster. 
                  Zero-latency replication engaged.
                </p>
                
                <div className="w-full space-y-5 mb-10 text-left">
                   <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Followers</span>
                      <span className="text-[12px] text-white font-black tabular-nums">{trader.followers.toLocaleString()} ACTIVE</span>
                   </div>
                   <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Verified Track Record</span>
                      <span className="text-[12px] text-white font-black">{trader.weeks} WEEKS</span>
                   </div>
                   <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Performance Fee</span>
                      <span className="text-[12px] text-emerald-400 font-black">1.25% SUCCESS FEE</span>
                   </div>
                </div>

                <button 
                  onClick={() => { onClose(); onCopyClick(); }}
                  className="w-full bg-[#f01a64] hover:bg-pink-700 text-white py-6 rounded-2xl font-black transition-all shadow-xl shadow-pink-900/40 text-xs uppercase tracking-[0.2em] active:scale-95"
                >
                  DEPLOY REPLICATION
                </button>
                <div className="flex items-center gap-2 mt-8">
                  <div className="w-1.5 h-1.5 bg-[#00b36b] rounded-full animate-pulse"></div>
                  <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Instant Socket Ready</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* INSTITUTIONAL FOOTER */}
        <div className="p-8 bg-[#131722] border-t border-[#2a2e39] flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Efficiency Index</span>
              <span className="text-white font-black text-[11px]">98.75% CLONE ACCURACY</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-8">
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Encryption Level</span>
              <span className="text-white font-black text-[11px]">AES-256 QUANTUM PROTOCOL</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
              © 2025 ZULU ARCHITECTURE • ELITE ALPHA CLUSTER-04
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderProfileModal;
