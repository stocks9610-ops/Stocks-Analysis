
import React, { useState, useEffect, useRef } from 'react';
import { playProfitSound } from '../services/audioService';

interface FeedEvent {
  id: string;
  type: 'WIN' | 'LOSS' | 'WITHDRAWAL' | 'EXECUTION';
  trader: string;
  detail: string;
  amount: number;
  timestamp: string;
}

const ELITE_TRADERS = [
  'Earn With Rashid',
  'Master Analyst Guy',
  'Alpha Altcoin Daily',
  'Brian Jung Elite',
  'Binary Edge Pro',
  'Rapid Replicator',
  'Binance Whale Watch',
  'Quantum Scalper'
];

const ASSETS = ['BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'SOL/USDT', 'EUR/USD', 'GBP/JPY'];

const MarketChart: React.FC = () => {
  // Start with a random amount between $42M and $45M so it looks persistent but dynamic
  const [totalProfit, setTotalProfit] = useState<number>(() => 42500000 + Math.random() * 2500000);
  const [lastEvent, setLastEvent] = useState<{label: string, val: number, isWin: boolean} | null>(null);
  const [history, setHistory] = useState<number[]>(new Array(40).fill(42500000));
  const [feed, setFeed] = useState<FeedEvent[]>([]);

  useEffect(() => {
    // Initial feed population
    const initialFeed: FeedEvent[] = Array.from({ length: 8 }).map(() => generateRandomEvent());
    setFeed(initialFeed);

    const simulationInterval = setInterval(() => {
      const event = generateRandomEvent();
      
      // Update Feed
      setFeed(prev => [event, ...prev].slice(0, 8));

      // Update Total Profit Logic
      if (event.type === 'WIN' || event.type === 'WITHDRAWAL') {
         setTotalProfit(prev => {
           const next = prev + event.amount;
           updateHistory(next);
           return next;
         });
         setLastEvent({ label: 'WIN', val: event.amount, isWin: true });
         if (event.amount > 5000) playProfitSound();
      } else if (event.type === 'LOSS') {
         setTotalProfit(prev => {
           const next = prev - event.amount;
           updateHistory(next);
           return next;
         });
         setLastEvent({ label: 'LOSS', val: event.amount, isWin: false });
      }

    }, 1800); // Speed of simulation

    return () => clearInterval(simulationInterval);
  }, []);

  const updateHistory = (newVal: number) => {
    setHistory(prev => {
      const newHistory = [...prev.slice(1), newVal];
      return newHistory;
    });
  };

  const generateRandomEvent = (): FeedEvent => {
    const r = Math.random();
    const trader = ELITE_TRADERS[Math.floor(Math.random() * ELITE_TRADERS.length)];
    const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
    const now = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let type: FeedEvent['type'] = 'EXECUTION';
    let detail = '';
    let amount = 0;

    if (r > 0.85) {
      // Withdrawal
      type = 'WITHDRAWAL';
      amount = Math.floor(Math.random() * 15000) + 2000;
      detail = `Payout Processed (TRC-20)`;
    } else if (r > 0.40) {
      // Win
      type = 'WIN';
      amount = Math.floor(Math.random() * 8500) + 500;
      detail = `Closed Long ${asset}`;
    } else if (r > 0.25) {
       // Loss (Keep it somewhat infrequent but present for realism)
       type = 'LOSS';
       amount = Math.floor(Math.random() * 2500) + 100;
       detail = `Stop Loss Hit ${asset}`;
    } else {
       // Execution
       type = 'EXECUTION';
       amount = 0;
       detail = `Opened Position ${asset} 50x`;
    }

    return {
      id: Math.random().toString(36),
      type,
      trader,
      detail,
      amount,
      timestamp: now
    };
  };

  // Chart Drawing Logic
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const points = history.map((val, i) => {
    const x = (i / (history.length - 1)) * 100;
    // Normalize y to 0-100
    const y = 100 - ((val - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');
  const fillPath = `0,100 ${points} 100,100`;

  return (
    <div className="h-full flex flex-col bg-[#1e222d] text-white relative overflow-hidden">
      {/* BACKGROUND GRID EFFECT */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#2a2e39 1px, transparent 1px), linear-gradient(90deg, #2a2e39 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* HEADER */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-[#2a2e39] bg-[#131722]/90 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#f01a64] rounded-full animate-ping"></div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter leading-none">Global Terminal</h2>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Military-Grade Encryption Secured</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Live Trader Profit</div>
          <div className="text-[10px] text-[#00b36b] font-mono font-bold">Tracking Active</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-hidden">
        
        {/* LEFT: MAIN CHART & BIG NUMBERS */}
        <div className="flex-1 flex flex-col relative border-b lg:border-b-0 lg:border-r border-[#2a2e39]">
          
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center z-10 mt-4">
            <h3 className="text-[#0088cc] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-2 animate-pulse">Total Network Profit Generated</h3>
            <div className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter tabular-nums mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            
            {/* DYNAMIC +/- INDICATOR */}
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 ${lastEvent?.isWin ? 'bg-[#00b36b]/10 border-[#00b36b]/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <span className={`text-lg md:text-2xl font-black ${lastEvent?.isWin ? 'text-[#00b36b]' : 'text-red-500'}`}>
                {lastEvent ? (lastEvent.isWin ? '+' : '-') : '+'}${lastEvent?.val.toLocaleString() || '0'}
              </span>
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">
                {lastEvent?.label || 'LIVE'}
              </span>
            </div>
          </div>

          {/* CHART VISUAL */}
          <div className="absolute inset-x-0 bottom-0 h-[60%] opacity-40 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <polygon points={fillPath} fill="url(#chartGradient)" className="transition-all duration-1000 ease-linear" />
              <polyline fill="none" stroke={lastEvent?.isWin === false ? '#ef4444' : '#00b36b'} strokeWidth="0.8" points={points} className="transition-all duration-1000 ease-linear" />
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lastEvent?.isWin === false ? '#ef4444' : '#00b36b'} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={lastEvent?.isWin === false ? '#ef4444' : '#00b36b'} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* RIGHT: LIVE FEED */}
        <div className="w-full lg:w-96 bg-[#131722]/80 backdrop-blur-sm flex flex-col border-l border-[#2a2e39]">
          <div className="p-3 border-b border-[#2a2e39] bg-[#1e222d] flex items-center justify-between">
            <span className="text-[10px] font-black text-[#00b36b] uppercase tracking-widest animate-pulse">Live Trade Feed</span>
            <div className="flex gap-1">
               <span className="w-1.5 h-1.5 bg-[#00b36b] rounded-full animate-pulse"></span>
               <span className="w-1.5 h-1.5 bg-[#00b36b] rounded-full animate-pulse [animation-delay:-0.2s]"></span>
               <span className="w-1.5 h-1.5 bg-[#00b36b] rounded-full animate-pulse [animation-delay:-0.4s]"></span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-hidden relative">
            <div className="absolute inset-0 overflow-y-auto no-scrollbar p-3 space-y-2">
              {feed.map((item) => (
                <div key={item.id} className="bg-[#1e222d] border border-[#2a2e39] p-3 rounded-lg flex items-center justify-between animate-in slide-in-from-right duration-500 hover:bg-[#2a2e39] transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.type === 'WIN' ? 'bg-[#00b36b]/10 text-[#00b36b]' :
                      item.type === 'LOSS' ? 'bg-red-500/10 text-red-500' :
                      item.type === 'WITHDRAWAL' ? 'bg-[#f01a64]/10 text-[#f01a64]' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                       {item.type === 'WIN' ? '↗' : item.type === 'LOSS' ? '↘' : item.type === 'WITHDRAWAL' ? '$' : '⚡'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-white font-black truncate">{item.trader}</div>
                      <div className="text-[9px] text-gray-500 font-medium truncate">{item.detail}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-[10px] font-black ${
                      item.type === 'LOSS' ? 'text-red-500' : 'text-white'
                    }`}>
                      {item.amount > 0 ? `$${item.amount.toLocaleString()}` : 'ACTIVE'}
                    </div>
                    <div className="text-[8px] text-gray-600 font-mono">{item.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-[#1e222d] border-t border-[#2a2e39] text-center">
             <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Real-Time Blockchain Sync</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketChart;
