import React, { useState, useEffect, useRef } from 'react';
import { Trader } from '../types';
import TraderProfileModal from './TraderProfileModal';
import { playProfitSound } from '../services/audioService';

interface ExtendedTrader extends Trader {
  category: 'binance' | 'crypto' | 'binary';
}

const MOCK_TRADERS: ExtendedTrader[] = [
  { 
    id: '0', name: 'Earn With Rashid (YouTuber)', 
    avatar: 'rashid.png', 
    roi: 285.4, drawdown: 2.1, followers: 125000, weeks: 312, strategy: 'Content-Driven Multi-Asset Quant',
    type: 'Trader', experienceYears: 12, markets: ['Crypto', 'Forex', 'Indices'], riskScore: 2,
    winRate: 91.2, avgDuration: '1 week', riskMethods: ['Community Sentiment Filtering', 'Volatility Guard'], 
    bio: 'The premier World Trade Platform profile for the Earn With Rashid network. We provide absolute transparency and consistent replication of elite market moves.',
    category: 'binance'
  },
  { 
    id: '1', name: 'Master Analyst Guy', 
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', 
    roi: 184.2, drawdown: 5.2, followers: 45200, weeks: 208, strategy: 'World Trade Platform Trend Following',
    type: 'Trader', experienceYears: 15, markets: ['Crypto', 'Forex'], riskScore: 3,
    winRate: 78.5, avgDuration: '3 months', riskMethods: ['Dynamic Stops'], 
    bio: 'Professional trend analyst focused on long-term capital appreciation through disciplined risk management.',
    category: 'binance'
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
    id: '6', name: 'Binance Whale Watch', 
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', 
    roi: 245.9, drawdown: 3.1, followers: 67000, weeks: 210, strategy: 'Order Flow Imbalance',
    type: 'Trader', experienceYears: 11, markets: ['Binance Spot', 'Futures'], riskScore: 4,
    winRate: 85.2, avgDuration: '3 days', riskMethods: ['Volume Profile Analysis'], 
    bio: 'Specialized in tracking large-scale institutional orders on Binance to ride the momentum of market makers.',
    category: 'binance'
  },
  { 
    id: '7', name: 'Quantum Scalper', 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', 
    roi: 389.2, drawdown: 11.4, followers: 12900, weeks: 88, strategy: 'Neural Grid Scalping',
    type: 'Analyst', experienceYears: 6, markets: ['Binance Futures'], riskScore: 7,
    winRate: 92.1, avgDuration: '15 min', riskMethods: ['Hard SL', 'Grid Recovery'], 
    bio: 'Automated high-frequency signals tailored for the Binance engine. Extreme precision, high turnover.',
    category: 'binance'
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
  const [activeCategory, setActiveCategory] = useState<'binance' | 'crypto' | 'binary'>('binance');
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
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic">
            Elite Marketplace
          </h2>
          
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {(['binance', 'crypto', 'binary'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                  ? 'bg-[#f01a64] text-white border-[#f01a64] shadow-lg' 
                  : 'bg-[#1e222d] text-gray-500 border-[#2a2e39]'
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
              className={`min-w-[85vw] sm:min-w-[320px] md:min-w-[340px] bg-[#1e222d] border border-[#2a2e39] rounded-2xl p-5 md:p-6 cursor-pointer transition-all snap-center relative ${
                animatingTraders[trader.id] ? 'border-[#f01a64] scale-[1.01]' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={trader.avatar} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ring-1 ring-white/10" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-black text-xs md:text-base truncate mb-0.5">{trader.name}</h3>
                  <span className="text-[7px] md:text-[8px] text-[#f01a64] font-black uppercase tracking-widest block">{trader.type}</span>
                  <SocialIcons color="text-[#f01a64]" />
                </div>
              </div>

              <div className="bg-[#131722] p-4 rounded-xl mb-4 border border-[#2a2e39] tabular-nums">
                <span className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-1">Total Profits</span>
                <div className={`text-xl md:text-2xl font-black ${animatingTraders[trader.id] ? 'text-[#00b36b]' : 'text-white'}`}>
                  ${traderProfits[trader.id]?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-[#131722] p-2 rounded-lg border border-[#2a2e39] text-center">
                  <span className="text-[7px] text-gray-500 uppercase font-black block">ROI</span>
                  <span className="text-[#00b36b] font-black text-xs">+{trader.roi}%</span>
                </div>
                <div className="bg-[#131722] p-2 rounded-lg border border-[#2a2e39] text-center">
                  <span className="text-[7px] text-gray-500 uppercase font-black block">Risk</span>
                  <span className="text-[#f01a64] font-black text-xs">{trader.riskScore}/10</span>
                </div>
              </div>

              <button 
                className="w-full py-3.5 bg-[#00b36b] text-white rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95"
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