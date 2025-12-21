import React, { useState, useEffect } from 'react';
import { Trader } from '../types';
import { getTraderEdgeFast } from '../services/geminiService';

interface TraderProfileModalProps {
  trader: Trader;
  onClose: () => void;
  onCopyClick: () => void;
}

const useCountUp = (endValue: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = endValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [endValue]);
  return count;
};

const TraderProfileModal: React.FC<TraderProfileModalProps> = ({ trader, onClose, onCopyClick }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const animatedRoi = useCountUp(trader.roi);

  useEffect(() => {
    const fetchInsight = async () => {
      const summary = await getTraderEdgeFast(trader.bio);
      setAiInsight(summary);
    };
    fetchInsight();
  }, [trader]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 sm:p-4">
      <div className="bg-[#131722] w-full h-full sm:h-auto sm:max-w-5xl sm:rounded-[2.5rem] flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* MOBILE HEADER */}
        <div className="p-6 md:p-10 border-b border-[#2a2e39] bg-gradient-to-b from-[#1e222d] to-[#131722] shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 p-2 active:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4 md:gap-8">
            <img src={trader.avatar} className="w-16 h-16 md:w-32 md:h-32 rounded-2xl md:rounded-[2rem] object-cover ring-2 ring-white/10" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg md:text-4xl font-black text-white uppercase tracking-tighter truncate">{trader.name}</h2>
              <span className="text-[8px] md:text-[10px] font-black text-[#f01a64] uppercase tracking-widest">{trader.type} ELITE</span>
              <div className="mt-2 text-white font-bold text-[9px] md:text-sm italic line-clamp-2">"{aiInsight || 'Synchronizing strategy...'}"</div>
            </div>
          </div>
        </div>

        {/* SCROLL CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar pb-32">
          {/* KPI GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-[#1e222d] p-5 rounded-2xl border border-white/5 text-center">
              <span className="text-[7px] md:text-[9px] text-gray-500 uppercase font-black block mb-1">TOTAL ROI</span>
              <span className="text-xl md:text-3xl font-black text-[#00b36b]">+{animatedRoi.toFixed(1)}%</span>
            </div>
            <div className="bg-[#1e222d] p-5 rounded-2xl border border-white/5 text-center">
              <span className="text-[7px] md:text-[9px] text-gray-500 uppercase font-black block mb-1">WIN RATE</span>
              <span className="text-xl md:text-3xl font-black text-white">{trader.winRate}%</span>
            </div>
            <div className="bg-[#1e222d] p-5 rounded-2xl border border-white/5 text-center">
              <span className="text-[7px] md:text-[9px] text-gray-500 uppercase font-black block mb-1">DRAWDOWN</span>
              <span className="text-xl md:text-3xl font-black text-red-500">-{trader.drawdown}%</span>
            </div>
            <div className="bg-[#1e222d] p-5 rounded-2xl border border-white/5 text-center">
              <span className="text-[7px] md:text-[9px] text-gray-500 uppercase font-black block mb-1">RISK SCORE</span>
              <span className="text-xl md:text-3xl font-black text-amber-500">{trader.riskScore}/10</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[9px] text-gray-500 font-black uppercase tracking-widest border-l-2 border-[#f01a64] pl-3">Execution Logic</h4>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-bold italic bg-[#1e222d] p-5 rounded-2xl">{trader.strategy}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[9px] text-gray-500 font-black uppercase tracking-widest border-l-2 border-emerald-500 pl-3">Risk Protocols</h4>
              <div className="flex flex-wrap gap-2">
                {trader.riskMethods.map(m => (
                  <span key={m} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[8px] font-black uppercase">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="p-6 bg-[#131722] border-t border-[#2a2e39] shrink-0">
          <button 
            onClick={() => { onClose(); onCopyClick(); }}
            className="w-full bg-[#f01a64] py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95"
          >
            Deploy Capital to Cluster
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraderProfileModal;