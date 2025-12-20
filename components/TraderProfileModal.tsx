
import React, { useState, useEffect } from 'react';
import { Trader } from '../types';
import { getTraderEdgeFast } from '../services/geminiService';

interface TraderProfileModalProps {
  trader: Trader;
  onClose: () => void;
  onCopyClick: () => void;
}

const getRiskLabel = (score: number) => {
  if (score <= 3) return { label: 'LOW RISK', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
  if (score <= 7) return { label: 'MEDIUM RISK', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
  return { label: 'HIGH RISK', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
};

const TraderProfileModal: React.FC<TraderProfileModalProps> = ({ trader, onClose, onCopyClick }) => {
  const [edge, setEdge] = useState<string | null>(null);
  const risk = getRiskLabel(trader.riskScore);

  useEffect(() => {
    const fetchEdge = async () => {
      const summary = await getTraderEdgeFast(trader.bio);
      setEdge(summary);
    };
    fetchEdge();
  }, [trader]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl">
      <div className="bg-[#1e222d] border border-[#2a2e39] w-full max-w-6xl h-full max-h-[95vh] rounded-2xl sm:rounded-[2rem] flex flex-col overflow-hidden animate-in zoom-in-95 shadow-[0_0_120px_rgba(0,0,0,1)]">
        
        {/* TOP PANEL: Identity & AI Analysis */}
        <div className="p-6 lg:p-12 border-b border-[#2a2e39] bg-gradient-to-br from-[#131722] via-[#1e222d] to-[#131722] relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff8c00]/5 rounded-full filter blur-3xl -mr-32 -mt-32"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 lg:top-8 lg:right-8 text-gray-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center lg:items-start relative z-10">
            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <img src={trader.avatar} className="w-28 h-28 lg:w-48 lg:h-48 rounded-[1.5rem] lg:rounded-[2.5rem] object-cover ring-4 ring-[#ff8c00]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#ff8c00] text-white px-3 py-1 lg:px-5 lg:py-1.5 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl whitespace-nowrap">
                TOP 1% MENTOR
              </div>
            </div>
            
            {/* Name and Badges */}
            <div className="flex-1 space-y-4 lg:space-y-6 text-center lg:text-left">
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 mb-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">{trader.name}</h2>
                  <div className="flex gap-4 items-center justify-center lg:justify-start opacity-40">
                    <svg className="w-4 h-4 text-[#ff8c00]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <svg className="w-4 h-4 text-[#ff8c00]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.27l-1.56 7.42c-.116.545-.44.68-.895.425l-2.37-1.75-1.145 1.1c-.125.127-.23.234-.473.234l.17-2.42 4.41-3.98c.19-.17-.04-.26-.297-.09l-5.45 3.43-2.34-.73c-.51-.16-.52-.51.107-.756l9.15-3.53c.42-.15.79.1.663.667z"/></svg>
                    <svg className="w-4 h-4 text-[#ff8c00]" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 lg:gap-3">
                  <span className="px-3 py-1 bg-[#131722] text-[#ff8c00] text-[8px] lg:text-[10px] font-black rounded-lg border border-[#2a2e39] uppercase tracking-widest">
                    {trader.experienceYears}Y ELITE STATUS
                  </span>
                  <span className="px-3 py-1 bg-[#131722] text-blue-400 text-[8px] lg:text-[10px] font-black rounded-lg border border-[#2a2e39] uppercase tracking-widest">
                    {trader.markets[0]} / {trader.markets[1] || 'GENERAL'} MASTER
                  </span>
                  <span className={`px-3 py-1 ${risk.bg} ${risk.color} ${risk.border} text-[8px] lg:text-[10px] font-black rounded-lg border uppercase tracking-widest`}>
                    {risk.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
                <div className="bg-white/5 border border-white/10 p-4 lg:p-6 rounded-xl lg:rounded-2xl backdrop-blur-md flex flex-col justify-center text-center lg:text-left">
                  <span className="text-[8px] lg:text-[10px] font-black text-[#ff8c00] uppercase tracking-[0.2em] block mb-1 lg:mb-2">AI Mentor Insight</span>
                  <p className="text-white font-bold text-sm lg:text-xl leading-tight italic">"{edge || "Analyzing mentor's unique profit generation vectors..."}"</p>
                </div>
                <div className="hidden md:flex bg-blue-500/5 border border-blue-500/10 p-4 lg:p-6 rounded-xl lg:rounded-2xl backdrop-blur-md flex-col justify-center text-left">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] block mb-2">Institutional Logic</span>
                  <p className="text-gray-300 text-xs font-bold leading-relaxed">{trader.strategy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-12 overflow-y-auto bg-[#131722] flex-1">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 lg:gap-12">
            
            <div className="xl:col-span-3 space-y-8 lg:space-y-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                <div className="bg-[#1e222d] p-4 lg:p-8 rounded-xl lg:rounded-[2rem] border border-[#2a2e39] text-center">
                  <span className="text-[8px] lg:text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">Mentor Profit %</span>
                  <span className="text-xl lg:text-4xl font-black text-[#00b36b]">+{trader.roi}%</span>
                </div>
                <div className="bg-[#1e222d] p-4 lg:p-8 rounded-xl lg:rounded-[2rem] border border-[#2a2e39] text-center">
                  <span className="text-[8px] lg:text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">Win Probability</span>
                  <span className="text-xl lg:text-4xl font-black text-white">{trader.winRate}%</span>
                </div>
                <div className="bg-[#1e222d] p-4 lg:p-8 rounded-xl lg:rounded-[2rem] border border-[#2a2e39] text-center">
                  <span className="text-[8px] lg:text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">Max Drawdown</span>
                  <span className="text-xl lg:text-4xl font-black text-red-500">-{trader.drawdown}%</span>
                </div>
                <div className="bg-[#1e222d] p-4 lg:p-8 rounded-xl lg:rounded-[2rem] border border-[#2a2e39] text-center">
                  <span className="text-[8px] lg:text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">Alpha Rating</span>
                  <span className="text-xl lg:text-4xl font-black text-orange-500">{trader.riskScore}/10</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-4">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] border-b border-[#2a2e39] pb-2">Professional Strategy</h4>
                  <p className="text-gray-400 text-xs lg:text-base leading-relaxed font-medium">{trader.bio}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] border-b border-[#2a2e39] pb-2 text-center md:text-left">Live Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col text-center md:text-left">
                      <span className="text-[8px] text-gray-500 uppercase font-black block">Avg Hold Time</span>
                      <span className="text-sm lg:text-xl font-black text-gray-200">{trader.avgDuration}</span>
                    </div>
                    <div className="flex flex-col text-center md:text-left">
                      <span className="text-[8px] text-gray-500 uppercase font-black block">Years Dominating</span>
                      <span className="text-sm lg:text-xl font-black text-gray-200">{trader.experienceYears} Years</span>
                    </div>
                    <div className="flex flex-col text-center md:text-left">
                      <span className="text-[8px] text-gray-500 uppercase font-black block">Success Fee</span>
                      <span className="text-sm lg:text-xl font-black text-[#00b36b]">1.25% Profit</span>
                    </div>
                    <div className="flex flex-col text-center md:text-left">
                      <span className="text-[8px] text-gray-500 uppercase font-black block">Loss Fee</span>
                      <span className="text-sm lg:text-xl font-black text-white">$0.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CONVERSION PANEL */}
            <div className="xl:col-span-1 space-y-4 pt-6 xl:pt-0">
              <div className="bg-gradient-to-b from-[#ff8c00]/20 to-[#1e222d] border border-[#ff8c00]/30 p-6 lg:p-10 rounded-2xl lg:rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-2xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#00b36b] rounded-xl lg:rounded-2xl flex items-center justify-center text-white mb-4 lg:mb-8 shadow-[0_10px_30px_rgba(0,179,107,0.3)] transform rotate-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 lg:h-8 lg:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-white font-black text-lg lg:text-xl mb-2 uppercase tracking-tighter">Copy This Mentor</h4>
                <p className="text-[9px] lg:text-[11px] text-gray-500 uppercase font-black mb-6 lg:mb-10 leading-relaxed">Let {trader.name.split(' ')[0]} trade for you. You keep 98.75% of every win.</p>
                <button 
                  onClick={() => { onClose(); onCopyClick(); }}
                  className="w-full bg-[#00b36b] hover:bg-green-600 text-white py-4 lg:py-6 rounded-xl lg:rounded-2xl font-black transition-all shadow-xl shadow-green-900/40 text-xs lg:text-sm uppercase tracking-[0.2em] active:scale-95"
                >
                  COPY YOUR MENTOR
                </button>
                <p className="text-[8px] text-green-500 uppercase font-black mt-4">No upfront cost. No loss fees.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderProfileModal;
