
import React, { useState, useEffect, useRef } from 'react';
import { Trader } from '../types';
import TraderProfileModal from './TraderProfileModal';
import { playProfitSound } from '../services/audioService';

interface ExtendedTrader extends Trader {
  category: 'crypto' | 'binary' | 'gold' | 'forex';
}

const MOCK_TRADERS: ExtendedTrader[] = [
  { 
    id: '0', name: 'Earn With Rashid (YouTuber)', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop', 
    roi: 285.4, drawdown: 2.1, followers: 125000, weeks: 312, strategy: 'Content-Driven Multi-Asset Quant',
    type: 'Trader', experienceYears: 12, markets: ['Crypto', 'Forex', 'Indices'], riskScore: 2,
    winRate: 91.2, avgDuration: '1 week', riskMethods: ['Community Sentiment Filtering', 'Volatility Guard'], 
    bio: 'The premier World Trade Platform profile for the Earn With Rashid network. We provide absolute transparency and consistent replication of elite market moves.',
    category: 'crypto'
  },
  { 
    id: '1', name: 'Master Analyst Guy', 
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', 
    roi: 184.2, drawdown: 5.2, followers: 45200, weeks: 208, strategy: 'World Trade Platform Trend Following',
    type: 'Trader', experienceYears: 15, markets: ['Crypto', 'Forex'], riskScore: 3,
    winRate: 78.5, avgDuration: '3 months', riskMethods: ['Dynamic Stops'], 
    bio: 'Professional trend analyst focused on long-term capital appreciation through disciplined risk management.',
    category: 'forex'
  },
  { 
    id: '2', name: 'Alpha Altcoin Daily', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 
    roi: 212.8, drawdown: 12.5, followers: 38900, weeks: 182, strategy: 'High-Velocity Sentiment',
    type: 'Analyst', experienceYears: 12, markets: ['Crypto', 'Altcoins'], riskScore: 6,
    winRate: 68.2, avgDuration: '2 weeks', riskMethods: ['Volatility Filtering'], 
    bio: 'Capitalizing on market inefficiencies within the altcoin sector. High-velocity trading for aggressive growth.',
    category: 'crypto'
  },
  { 
    id: '3', name: 'Brian Jung Elite', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 
    roi: 142.1, drawdown: 4.4, followers: 28500, weeks: 145, strategy: 'Macro-Economic Scaling',
    type: 'Educator', experienceYears: 10, markets: ['Crypto', 'Stocks'], riskScore: 2,
    winRate: 82.4, avgDuration: '1 month', riskMethods: ['Asymmetric Risk'], 
    bio: 'Macro-focused scaling strategies designed for sustainable wealth building.',
    category: 'crypto'
  },
  { 
    id: '4', name: 'Binary Edge Pro', 
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop', 
    roi: 312.5, drawdown: 8.9, followers: 15400, weeks: 92, strategy: 'M1 Reversal Scalping',
    type: 'Trader', experienceYears: 8, markets: ['Binary Options', 'Forex'], riskScore: 8,
    winRate: 89.1, avgDuration: '1 min', riskMethods: ['Fixed Percentage Stake'], 
    bio: 'Specialized in high-accuracy binary options signals with institutional-grade reversal logic.',
    category: 'binary'
  },
  { 
    id: '5', name: 'Rapid Replicator', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 
    roi: 405.2, drawdown: 15.4, followers: 22100, weeks: 45, strategy: 'Over/Under Volatility',
    type: 'Analyst', experienceYears: 5, markets: ['Binary Options'], riskScore: 9,
    winRate: 74.3, avgDuration: '5 min', riskMethods: ['Martingale Safety Guard'], 
    bio: 'High-frequency binary execution focused on volatility spikes and immediate profit extraction.',
    category: 'binary'
  },
  { 
    id: '6', name: 'Gold Trend Master', 
    avatar: 'https://images.unsplash.com/photo-1610375461490-6d615d666d9b?w=400&h=400&fit=crop', 
    roi: 245.9, drawdown: 3.1, followers: 67000, weeks: 210, strategy: 'XAU/USD Order Flow',
    type: 'Trader', experienceYears: 11, markets: ['Gold', 'Commodities'], riskScore: 4,
    winRate: 85.2, avgDuration: '3 days', riskMethods: ['Volume Profile Analysis'], 
    bio: 'Specialized in tracking large-scale institutional orders on Gold markets to ride the momentum of market makers.',
    category: 'gold'
  },
  { 
    id: '7', name: 'Forex Scalper Elite', 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', 
    roi: 389.2, drawdown: 11.4, followers: 12900, weeks: 88, strategy: 'Neural Grid Scalping',
    type: 'Analyst', experienceYears: 6, markets: ['EUR/USD', 'GBP/JPY'], riskScore: 7,
    winRate: 92.1, avgDuration: '15 min', riskMethods: ['Hard SL', 'Grid Recovery'], 
    bio: 'Automated high-frequency signals tailored for the Forex markets. Extreme precision, high turnover.',
    category: 'forex'
  }
];

const SocialIcons: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex gap-1.5 mt-1.5 opacity-60">
    <svg className={`w-2.5 h-2.5 ${color}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    <svg className={`w-2.5 h-2.5 ${color}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.27l-1.56 7.42c-.116.545-.44.68-.895.425l-2.37-1.75-1.145 1.1c-.125.127-.23.234-.473.234l.17-2.42 4.41-3.98c.19-.17-.04-.26-.297-.09l-5.45 3.43-2.34-.73c-.51-.16-.52-.51.107-.756l9.15-3.53c.42-.15.79.1.663.667z"/></svg>
  </div>
);

interface TraderListProps {
  onCopyClick: () => void;
}

const TraderList: React.FC<TraderListProps> = ({ onCopyClick }) => {
  const [activeCategory, setActiveCategory] = useState<'crypto' | 'binary' | 'gold' | 'forex'>('crypto');
  const [traderProfits, setTraderProfits] = useState<Record<string, number>>({});
  const [animatingTraders, setAnimatingTraders] = useState<Record<string, boolean>>({});
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);

  useEffect(() => {
    const initialProfits: Record<string, number> = {};
    MOCK_TRADERS.forEach(t => {
      const baseProfit = t.id === '0' ? 245000.00 : 5000.00;
      initialProfits[t.id] = baseProfit + Math.random() * 45000;
    });
    setTraderProfits(initialProfits);

    const profitInterval = setInterval(() => {
      const filtered = MOCK_TRADERS.filter(t => t.category === activeCategory);
      if (filtered.length === 0) return;
      const randomIdx = Math.floor(Math.random() * filtered.length);
      const trader = filtered[randomIdx];
      const baseIncrement = trader.id === '0' ? 850 : 250;
      const increment = baseIncrement + Math.random() * 1250;
      
      setTraderProfits(prev => ({ ...prev, [trader.id]: prev[trader.id] + increment }));
      setAnimatingTraders(prev => ({ ...prev, [trader.id]: true }));
      playProfitSound();
      setTimeout(() => setAnimatingTraders(prev => ({ ...prev, [trader.id]: false })), 400);
    }, 1200);

    return () => clearInterval(profitInterval);
  }, [activeCategory]);

  return (
    <section className="py-12 md:py-24 bg-[#131722] border-t border-[#2a2e39]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-14 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Elite Marketplace:<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">Crypto, Binary, Gold & Forex</span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-sm md:text-lg text-gray-400 font-medium leading-relaxed">
            Copy trading lets you automatically follow experienced traders. Choose a trader based on verified performance and trade <span className="text-[#00b36b] font-bold">risk-free</span> with our C-Level expert strategies. When you copy, it becomes a <span className="text-white font-bold">sure profit</span> opportunity. Connect your account seamlessly, and their trades are copied in real-time. You stay in control and can stop or change traders at any time.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {(['crypto', 'binary', 'gold', 'forex'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 active:scale-95 border-2 ${
                  activeCategory === cat 
                  ? 'bg-[#f01a64] text-white border-[#f01a64] shadow-[0_10px_30px_rgba(240,26,100,0.3)]' 
                  : 'bg-[#1e222d] text-gray-400 border-[#2a2e39] hover:border-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex overflow-x-auto gap-3 md:gap-6 py-4 px-1 no-scrollbar snap-x snap-mandatory">
          {MOCK_TRADERS.filter(t => t.category === activeCategory).map(trader => (
            <div 
              key={trader.id}
              onClick={() => setSelectedTrader(trader)}
              className={`min-w-[85vw] sm:min-w-[320px] md:min-w-[340px] bg-[#1e222d] border border-[#2a2e39] rounded-3xl p-6 cursor-pointer transition-all snap-center relative group hover:border-[#f01a64]/50 hover:shadow-2xl ${
                animatingTraders[trader.id] ? 'border-[#f01a64] scale-[1.01]' : ''
              }`}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <img src={trader.avatar} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover ring-2 ring-white/5" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00b36b] border-2 border-[#1e222d] rounded-full"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-black text-sm md:text-base truncate mb-1 group-hover:text-[#f01a64] transition-colors">{trader.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] bg-[#f01a64]/10 text-[#f01a64] px-2 py-0.5 rounded font-black uppercase tracking-widest">{trader.type}</span>
                    <SocialIcons color="text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="bg-[#131722] p-5 rounded-2xl mb-5 border border-[#2a2e39] group-hover:border-white/10 transition-colors">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Total Profits</span>
                  <span className="text-[8px] text-[#00b36b] font-black uppercase tracking-widest animate-pulse">Live</span>
                </div>
                <div className={`text-2xl md:text-3xl font-black tracking-tight ${animatingTraders[trader.id] ? 'text-[#00b36b]' : 'text-white'}`}>
                  ${traderProfits[trader.id]?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39] text-center">
                  <span className="text-[7px] text-gray-500 uppercase font-black block mb-1">ROI</span>
                  <span className="text-[#00b36b] font-black text-sm">+{trader.roi}%</span>
                </div>
                <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39] text-center">
                  <span className="text-[7px] text-gray-500 uppercase font-black block mb-1">Risk</span>
                  <span className="text-[#f01a64] font-black text-sm">{trader.riskScore}/10</span>
                </div>
              </div>

              <button 
                className="w-full py-4 bg-[#00b36b] hover:bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transform transition active:scale-95 group-hover:shadow-[#00b36b]/20"
                onClick={(e) => { e.stopPropagation(); onCopyClick(); }}
              >
                Copy Strategy
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedTrader && (
        <TraderProfileModal trader={selectedTrader} onClose={() => setSelectedTrader(null)} onCopyClick={onCopyClick} />
      )}
    </section>
  );
};

export default TraderList;
