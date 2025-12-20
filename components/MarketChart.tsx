
import React, { useState, useEffect, useRef } from 'react';
import { playProfitSound } from '../services/audioService';

interface FeedEvent {
  id: string;
  type: 'PROFIT' | 'JOINER' | 'MILESTONE' | 'TRADE';
  content: string;
  value: string;
  timestamp: string;
}

const TRADER_NAMES = ['Elite_Alpha', 'Ghost_Trader', 'World_Trade_Quant', 'Market_Maker_ZA', 'Apex_Growth', 'Sol_Master'];
const USER_NAMES = ['Zack_R', 'Sarah_M', 'Thabo_D', 'Elena_V', 'Liam_W', 'Priya_K'];

const MarketChart: React.FC = () => {
  const [totalProfit, setTotalProfit] = useState<number>(1284560.42);
  const [lastIncrement, setLastIncrement] = useState<number>(0);
  const [history, setHistory] = useState<number[]>(new Array(50).fill(1284560));
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Simulation loop for "Real-Time Profit" and "Alpha Stream Events"
  useEffect(() => {
    const mainInterval = setInterval(() => {
      const increment = Math.random() * 450 + 50;
      setLastIncrement(increment);
      setTotalProfit(prev => {
        const next = prev + increment;
        setHistory(h => [...h.slice(1), next]);
        return next;
      });
      
      if (Math.random() > 0.8) {
        playProfitSound();
      }
    }, 2000);

    const feedInterval = setInterval(() => {
      const types: FeedEvent['type'][] = ['PROFIT', 'JOINER', 'TRADE', 'MILESTONE'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let newEvent: FeedEvent;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      switch(type) {
        case 'PROFIT':
          const pVal = Math.floor(Math.random() * 45000) + 5000;
          newEvent = {
            id: Math.random().toString(36),
            type: 'PROFIT',
            content: `${TRADER_NAMES[Math.floor(Math.random() * TRADER_NAMES.length)]} realized`,
            value: `+$${pVal.toLocaleString()}`,
            timestamp: now
          };
          break;
        case 'JOINER':
          const lakhVal = (Math.random() * 45 + 5).toFixed(1);
          newEvent = {
            id: Math.random().toString(36),
            type: 'JOINER',
            content: `${USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)]} connected`,
            value: `${lakhVal} Lakhs Capital`,
            timestamp: now
          };
          break;
        case 'MILESTONE':
          newEvent = {
            id: Math.random().toString(36),
            type: 'MILESTONE',
            content: `Platform Volume Threshold`,
            value: `99.8% Efficiency`,
            timestamp: now
          };
          break;
        default: // TRADE
          newEvent = {
            id: Math.random().toString(36),
            type: 'TRADE',
            content: `New Mentor Signal Cloned`,
            value: `x452 Replications`,
            timestamp: now
          };
      }

      setFeed(prev => [newEvent, ...prev].slice(0, 10));
    }, 3500);

    return () => {
      clearInterval(mainInterval);
      clearInterval(feedInterval);
    };
  }, []);

  // Calculate SVG path for the profit line
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const points = history.map((val, i) => {
    const x = (i / (history.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  const fillPath = `0,100 ${points} 100,100`;

  return (
    <div className="h-full flex flex-col bg-[#1e222d] text-white">
      {/* HEADER: Performance Hub */}
      <div className="flex items-center justify-between p-4 md:px-6 md:py-4 border-b border-[#2a2e39] bg-[#131722] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-black text-white leading-none flex items-center gap-3 uppercase tracking-tighter">
              GLOBAL TERMINAL
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border bg-[#00b36b]/10 text-[#00b36b] border-[#00b36b]/20 animate-pulse`}>
                ● LIVE
              </span>
            </h2>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">WORLD TRADE PLATFORM REPLICATION ENGINE v4.0</span>
          </div>
        </div>
        
        <div className="hidden lg:flex gap-8">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Platform Fee</span>
            <span className="text-xs font-bold text-[#00b36b]">&lt; 2% PROFIT ONLY</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Network Node</span>
            <span className="text-xs font-bold text-gray-200">ZA-SEV-MAIN</span>
          </div>
        </div>
      </div>

      {/* MULTI-PANEL HUB */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        
        {/* LEFT PANEL: PROFIT VISUALIZATION (70%) */}
        <div className="flex-1 flex flex-col p-4 md:p-6 border-b xl:border-b-0 xl:border-r border-[#2a2e39] relative">
          {/* Real-time Counter */}
          <div className="relative z-10 mb-6 flex flex-col items-start">
            <div className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Cumulative Distributions</div>
            <div className="text-4xl md:text-6xl font-black tabular-nums tracking-tighter text-[#00b36b]">
              ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-1 text-xs font-black text-gray-400 flex items-center gap-2">
              <span className="text-[#00b36b] animate-bounce">+${lastIncrement.toFixed(2)}</span>
              <span className="uppercase text-[9px] tracking-widest text-gray-600">Last Block Sync</span>
            </div>
          </div>

          {/* Live SVG Chart */}
          <div className="flex-1 w-full relative group min-h-[150px]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#00b36b]/5 to-transparent pointer-events-none opacity-50"></div>
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="100" y2="20" stroke="#2a2e39" strokeWidth="0.1" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#2a2e39" strokeWidth="0.1" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#2a2e39" strokeWidth="0.1" />
              <polygon points={fillPath} fill="url(#profitGradient)" className="transition-all duration-1000 ease-in-out" />
              <polyline fill="none" stroke="#00b36b" strokeWidth="1.2" points={points} className="transition-all duration-1000 ease-in-out" />
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00b36b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#00b36b" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* RIGHT PANEL: ALPHA STREAM (30%) */}
        <div className="w-full xl:w-80 bg-[#131722]/50 flex flex-col shrink-0">
          <div className="p-3 border-b border-[#2a2e39] bg-[#131722] flex items-center justify-between">
            <span className="text-[10px] font-black text-[#ff8c00] uppercase tracking-[0.2em]">Alpha Stream</span>
            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Live Updates</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
            {feed.length === 0 && (
              <div className="h-full flex items-center justify-center text-[10px] text-gray-600 font-black uppercase animate-pulse">
                Synchronizing Feed...
              </div>
            )}
            {feed.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#1e222d] border border-[#2a2e39] p-3 rounded-xl animate-in slide-in-from-right duration-500 hover:border-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                    item.type === 'PROFIT' ? 'bg-[#00b36b]/10 text-[#00b36b]' : 
                    item.type === 'JOINER' ? 'bg-blue-500/10 text-blue-400' :
                    item.type === 'MILESTONE' ? 'bg-[#ff8c00]/10 text-[#ff8c00]' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[8px] text-gray-600 font-mono">{item.timestamp}</span>
                </div>
                <div className="text-[10px] text-gray-400 font-bold leading-tight">{item.content}</div>
                <div className={`text-xs font-black mt-1 ${
                  item.type === 'PROFIT' ? 'text-[#00b36b]' : 
                  item.type === 'JOINER' ? 'text-white' : 
                  'text-gray-200'
                }`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#2a2e39] bg-[#131722]/80">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#00b36b] rounded-full animate-ping"></div>
              <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Encrypted Socket Active</span>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER: Secure Notice */}
      <div className="p-3 bg-[#131722] border-t border-[#2a2e39] flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[#00b36b]">VERIFIED RETURNS</span>
          <span className="hidden sm:inline">98.75% CLONE SUCCESS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">ZULU_ENGINE_CONNECTED</span>
          <span className="text-gray-400">LOC: WORLD TRADE PLATFORM SECURE HUB</span>
        </div>
      </div>
    </div>
  );
};

export default MarketChart;
