
import React, { useState, useEffect, useRef } from 'react';
import { Trader } from '../types';
import TraderProfileModal from './TraderProfileModal';
import { playProfitSound } from '../services/audioService';

const MOCK_TRADERS: Trader[] = [
  { 
    id: '0', name: 'Earn With Rashid (YouTuber)', 
    avatar: 'rashid.png', 
    roi: 285.4, drawdown: 2.1, followers: 125000, weeks: 312, strategy: 'Content-Driven Multi-Asset Quant',
    type: 'Trader', experienceYears: 12, markets: ['Crypto', 'Forex', 'Indices'], riskScore: 2,
    winRate: 91.2, avgDuration: '1 week', riskMethods: ['Community Sentiment Filtering', 'Volatility Guard'], 
    bio: 'The premier World Trade Platform profile for the Earn With Rashid network. We provide absolute transparency and consistent replication of elite market moves. Our strategy leverages high-probability setups identified through proprietary sentiment analysis. Trade alongside a global authority. Securely.'
  },
  { 
    id: '1', name: 'Master Analyst Guy', 
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', 
    roi: 184.2, drawdown: 5.2, followers: 45200, weeks: 208, strategy: 'World Trade Platform Trend Following',
    type: 'Trader', experienceYears: 15, markets: ['Crypto', 'Forex'], riskScore: 3,
    winRate: 78.5, avgDuration: '3 months', riskMethods: ['Dynamic Stops'], 
    bio: 'Professional trend analyst focused on long-term capital appreciation through disciplined risk management and World Trade Platform execution.'
  },
  { 
    id: '2', name: 'Alpha Altcoin Daily', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 
    roi: 212.8, drawdown: 12.5, followers: 38900, weeks: 182, strategy: 'High-Velocity Sentiment',
    type: 'Analyst', experienceYears: 12, markets: ['Crypto', 'Altcoins'], riskScore: 6,
    winRate: 68.2, avgDuration: '2 weeks', riskMethods: ['Volatility Filtering'], 
    bio: 'Capitalizing on market inefficiencies within the altcoin sector. High-velocity trading for aggressive growth profiles.'
  },
  { 
    id: '3', name: 'Brian Jung Elite', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 
    roi: 142.1, drawdown: 4.4, followers: 28500, weeks: 145, strategy: 'Macro-Economic Scaling',
    type: 'Educator', experienceYears: 10, markets: ['Crypto', 'Stocks'], riskScore: 2,
    winRate: 82.4, avgDuration: '1 month', riskMethods: ['Asymmetric Risk'], 
    bio: 'Macro-focused scaling strategies designed for sustainable wealth building and secular market trend capture.'
  }
];

const SocialIcons: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex gap-2 mt-2 opacity-60">
    <svg className={`w-3 h-3 ${color}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    <svg className={`w-3 h-3 ${color}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.27l-1.56 7.42c-.116.545-.44.68-.895.425l-2.37-1.75-1.145 1.1c-.125.127-.23.234-.473.234l.17-2.42 4.41-3.98c.19-.17-.04-.26-.297-.09l-5.45 3.43-2.34-.73c-.51-.16-.52-.51.107-.756l9.15-3.53c.42-.15.79.1.663.667z"/></svg>
    <svg className={`w-3 h-3 ${color}`} fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
  </div>
);

interface TraderListProps {
  onCopyClick: () => void;
}

const TraderList: React.FC<TraderListProps> = ({ onCopyClick }) => {
  const [traderProfits, setTraderProfits] = useState<Record<string, number>>({});
  const [animatingTraders, setAnimatingTraders] = useState<Record<string, boolean>>({});
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialProfits: Record<string, number> = {};
    MOCK_TRADERS.forEach(t => {
      const baseProfit = t.id === '0' ? 245000.00 : 5000.00;
      initialProfits[t.id] = baseProfit + Math.random() * 45000;
    });
    setTraderProfits(initialProfits);

    const profitInterval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * MOCK_TRADERS.length);
      const trader = MOCK_TRADERS[randomIdx];
      const baseIncrement = trader.id === '0' ? 850 : 250;
      const increment = baseIncrement + Math.random() * 1250;
      
      setTraderProfits(prev => ({
        ...prev,
        [trader.id]: prev[trader.id] + increment
      }));
      
      setAnimatingTraders(prev => ({ ...prev, [trader.id]: true }));
      playProfitSound();
      
      setTimeout(() => {
        setAnimatingTraders(prev => ({ ...prev, [trader.id]: false }));
      }, 400);
    }, 1200);

    return () => clearInterval(profitInterval);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#131722] border-t border-[#2a2e39]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic">
            Top Tier Performance
          </h2>
          <p className="text-gray-500 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">World Trade Platform Replication Hub</p>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 md:gap-6 py-4 px-2 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {MOCK_TRADERS.map(trader => (
            <div 
              key={trader.id}
              onClick={() => setSelectedTrader(trader)}
              className={`min-w-[280px] md:min-w-[320px] bg-[#1e222d] border border-[#2a2e39] rounded-2xl p-5 md:p-6 cursor-pointer transition-all hover:border-[#f01a64] flex flex-col group snap-center ${
                animatingTraders[trader.id] ? 'scale-[1.03] shadow-[0_0_50px_rgba(240,26,100,0.2)]' : ''
              } ${trader.id === '0' ? 'border-[#f01a64]/60 ring-1 ring-[#f01a64]/20' : ''}`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="relative">
                  <img src={trader.avatar} alt={trader.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-[#f01a64]/20 group-hover:ring-[#f01a64]/60 transition-all shadow-xl" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-[#00b36b] rounded-full border-2 border-[#1e222d] flex items-center justify-center">
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-black text-base md:text-lg group-hover:text-[#f01a64] transition-colors leading-none mb-1">{trader.name}</h3>
                  <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${trader.id === '0' ? 'text-[#00b36b]' : 'text-[#f01a64]'}`}>
                    {trader.id === '0' ? 'Top Tier Authority' : 'Expert Tier'}
                  </span>
                  <SocialIcons color={trader.id === '0' ? 'text-[#00b36b]' : 'text-[#f01a64]'} />
                </div>
              </div>

              <div className="bg-[#131722] p-4 md:p-5 rounded-xl mb-6 md:mb-8 border border-[#2a2e39] group-hover:border-[#f01a64]/30 transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent pointer-events-none"></div>
                <span className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1 md:mb-2 relative z-10">Realized Gains</span>
                <div className={`text-xl md:text-3xl font-black transition-all duration-300 tabular-nums relative z-10 ${animatingTraders[trader.id] ? 'text-[#00b36b] scale-105' : 'text-white'}`}>
                  ${traderProfits[trader.id]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-[#131722] p-2 md:p-3 rounded-lg border border-[#2a2e39] text-center">
                  <span className="text-[7px] md:text-[8px] text-gray-500 uppercase font-black block mb-1">ROI</span>
                  <span className="text-[#00b36b] font-black text-xs md:text-sm">+{trader.roi}%</span>
                </div>
                <div className="bg-[#131722] p-2 md:p-3 rounded-lg border border-[#2a2e39] text-center">
                  <span className="text-[7px] md:text-[8px] text-gray-500 uppercase font-black block mb-1">Risk Rating</span>
                  <span className="text-[#f01a64] font-black text-xs md:text-sm">{trader.riskScore}/10</span>
                </div>
              </div>

              <button 
                className="mt-auto w-full py-3 md:py-4 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg bg-[#00b36b] hover:bg-green-600 text-white shadow-green-900/20 active:scale-95"
                onClick={(e) => { e.stopPropagation(); onCopyClick(); }}
              >
                COPY YOUR MENTOR
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-20 pt-10 border-t border-[#2a2e39]">
          <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl md:rounded-3xl p-6 md:p-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f01a64]/10 text-[#f01a64] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-white font-black text-sm md:text-xl uppercase tracking-tighter mb-2">Zero Complexity. Full Autonomy.</h4>
              <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed font-black uppercase tracking-wide">
                Experience seamless market engagement with no complex setup required. Trade alongside experienced market participants with absolute confidence. Our infrastructure supports instant USDT and TrustWallet integrations for rapid capital movement. We prioritize uncompromising security and total investor privacy. Securely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedTrader && (
        <TraderProfileModal 
          trader={selectedTrader} 
          onClose={() => setSelectedTrader(null)} 
          onCopyClick={onCopyClick}
        />
      )}
    </section>
  );
};

export default TraderList;
