
import React, { useState, useEffect } from 'react';

const TickerTape: React.FC = () => {
  const [stats, setStats] = useState({
    liquidity: 24850000,
    activeNodes: 45201,
    accuracy: 98.4
  });

  // Subtle organic fluctuations to make it feel "real"
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        liquidity: prev.liquidity + (Math.random() * 100 - 20),
        activeNodes: prev.activeNodes + (Math.random() > 0.7 ? 1 : 0),
        accuracy: 98.4 + (Math.random() * 0.2 - 0.1)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1e222d] border-b border-[#2a2e39] py-2 px-4 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 whitespace-nowrap overflow-x-auto no-scrollbar">
        
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-[#00b36b] rounded-full animate-pulse shadow-[0_0_8px_#00b36b]"></div>
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
            SECURE LIQUIDITY: <span className="text-white">${stats.liquidity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-[#ff8c00] rounded-full animate-pulse shadow-[0_0_8px_#ff8c00]"></div>
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
            ACTIVE REPLICATORS: <span className="text-white">{stats.activeNodes.toLocaleString()}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
            SUCCESS PROBABILITY: <span className="text-white">{stats.accuracy.toFixed(1)}%</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <span className="text-[8px] font-black text-[#00b36b] uppercase tracking-[0.3em] border border-[#00b36b]/20 px-2 py-0.5 rounded">
            NETWORK STATUS: OPTIMAL
          </span>
        </div>

      </div>
    </div>
  );
};

export default TickerTape;
