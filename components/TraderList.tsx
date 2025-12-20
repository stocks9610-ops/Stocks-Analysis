
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
  // ADDING 20 MORE TRADERS
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
  },
  { 
    id: '8', name: 'Ether Oracle', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', 
    roi: 198.5, drawdown: 4.2, followers: 31000, weeks: 156, strategy: 'L2 Liquidity Flow',
    type: 'Educator', experienceYears: 9, markets: ['ETH', 'L2 Tokens'], riskScore: 3,
    winRate: 79.4, avgDuration: '1 month', riskMethods: ['Staking Hedge'], 
    bio: 'Deep ecosystem analysis focusing on Ethereum and its second-layer scaling solutions for long-term growth.',
    category: 'crypto'
  },
  { 
    id: '9', name: 'Solana Speedster', 
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop', 
    roi: 512.4, drawdown: 22.8, followers: 18500, weeks: 42, strategy: 'Ecosystem Alpha Hunting',
    type: 'Trader', experienceYears: 4, markets: ['SOL', 'Meme Coins'], riskScore: 10,
    winRate: 62.8, avgDuration: '4 hours', riskMethods: ['Size Limitation'], 
    bio: 'High-risk, high-reward trading within the Solana ecosystem. Focused on finding the next big explosive move.',
    category: 'crypto'
  },
  { 
    id: '10', name: 'Binary Queen ZA', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 
    roi: 276.1, drawdown: 7.2, followers: 22400, weeks: 112, strategy: 'Psychological Level Bounce',
    type: 'Trader', experienceYears: 7, markets: ['Binary Options', 'Forex'], riskScore: 5,
    winRate: 84.7, avgDuration: '2 min', riskMethods: ['ATR Filtering'], 
    bio: 'Cape Town based expert focusing on standard binary expiry cycles using pure price action and support/resistance.',
    category: 'binary'
  },
  { 
    id: '11', name: 'Profit Pilot 247', 
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop', 
    roi: 334.8, drawdown: 9.5, followers: 14200, weeks: 68, strategy: 'Momentum Divergence',
    type: 'Analyst', experienceYears: 8, markets: ['Binary Options'], riskScore: 6,
    winRate: 81.3, avgDuration: '10 min', riskMethods: ['Trend-Only Alignment'], 
    bio: 'Strict discipline approach to binary options. We only enter when momentum and volume are fully aligned.',
    category: 'binary'
  },
  { 
    id: '12', name: 'Binance Legend 88', 
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop', 
    roi: 421.9, drawdown: 18.2, followers: 92000, weeks: 245, strategy: 'Aggressive Perpetual Longs',
    type: 'Trader', experienceYears: 13, markets: ['Binance Futures'], riskScore: 8,
    winRate: 71.5, avgDuration: '12 hours', riskMethods: ['Leverage Adjustment'], 
    bio: 'Master of the Binance liquidations. I buy the fear and sell the greed with maximum efficiency.',
    category: 'binance'
  },
  { 
    id: '13', name: 'Stablecoin Strategist', 
    avatar: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=400&fit=crop', 
    roi: 85.4, drawdown: 0.8, followers: 12000, weeks: 188, strategy: 'Delta-Neutral Arbitrage',
    type: 'Educator', experienceYears: 10, markets: ['USDT', 'USDC', 'DAI'], riskScore: 1,
    winRate: 99.1, avgDuration: 'Variable', riskMethods: ['Cross-Exchange Hedge'], 
    bio: 'Low volatility, consistent growth using sophisticated arbitrage between stablecoins and exchange premiums.',
    category: 'binance'
  },
  { 
    id: '14', name: 'DeFi Degenerate Elite', 
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop', 
    roi: 642.3, drawdown: 35.5, followers: 41000, weeks: 72, strategy: 'Yield Farm Rotation',
    type: 'Analyst', experienceYears: 5, markets: ['DEX Tokens', 'Farms'], riskScore: 10,
    winRate: 55.4, avgDuration: '2 days', riskMethods: ['Aggressive Compounding'], 
    bio: 'Rotating capital through the highest-yielding verified protocols. Fast in, fast out, maximum alpha.',
    category: 'crypto'
  },
  { 
    id: '15', name: 'BTC Maxi Pro', 
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', 
    roi: 125.7, drawdown: 15.2, followers: 88500, weeks: 412, strategy: 'HODL Plus Covered Calls',
    type: 'Educator', experienceYears: 14, markets: ['Bitcoin'], riskScore: 3,
    winRate: 94.2, avgDuration: 'Years', riskMethods: ['Multi-Sig Custody'], 
    bio: 'Long-term Bitcoin focus using options to generate income while maintaining a large spot position.',
    category: 'crypto'
  },
  { 
    id: '16', name: 'OTC King Pin', 
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop', 
    roi: 218.4, drawdown: 5.5, followers: 16700, weeks: 145, strategy: 'Bulk Order Front-Running',
    type: 'Trader', experienceYears: 9, markets: ['Large Cap Crypto'], riskScore: 4,
    winRate: 88.7, avgDuration: '1 day', riskMethods: ['Privacy Guard'], 
    bio: 'Capitalizing on large OTC desk movements before they hit the open market. Secure and calculated.',
    category: 'binance'
  },
  { 
    id: '17', name: 'Micro-Cap Scout', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 
    roi: 782.1, drawdown: 42.1, followers: 32000, weeks: 54, strategy: 'Gem Identification',
    type: 'Analyst', experienceYears: 4, markets: ['Micro-caps', 'New Listings'], riskScore: 10,
    winRate: 48.2, avgDuration: '1 week', riskMethods: ['Stop Loss at Entry'], 
    bio: 'I hunt for projects with 100x potential. Most will fail, but the winners pay for everything 100 times over.',
    category: 'crypto'
  },
  { 
    id: '18', name: 'Binary Sniper Elite', 
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop', 
    roi: 305.4, drawdown: 10.2, followers: 28900, weeks: 132, strategy: 'News Event Fade',
    type: 'Trader', experienceYears: 10, markets: ['Binary Options', 'Indices'], riskScore: 7,
    winRate: 77.4, avgDuration: '5 min', riskMethods: ['News Filter'], 
    bio: 'Specialized in trading the immediate aftermath of major economic releases on binary platforms.',
    category: 'binary'
  },
  { 
    id: '19', name: 'Indicator Master', 
    avatar: 'https://images.unsplash.com/photo-1534308143481-c550951ad49a?w=400&h=400&fit=crop', 
    roi: 188.2, drawdown: 4.5, followers: 15600, weeks: 94, strategy: 'Proprietary AI Indicator',
    type: 'Educator', experienceYears: 7, markets: ['Forex', 'Binary'], riskScore: 4,
    winRate: 82.1, avgDuration: '1 min', riskMethods: ['Signal Confirmation'], 
    bio: 'Creator of the "World Trade Pulse" indicator. Simple green/red light signals for binary success.',
    category: 'binary'
  },
  { 
    id: '20', name: 'Binance Bot Builder', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 
    roi: 312.5, drawdown: 8.4, followers: 44100, weeks: 176, strategy: 'Mean Reversion Bot',
    type: 'Trader', experienceYears: 8, markets: ['Binance Spot'], riskScore: 5,
    winRate: 89.8, avgDuration: '4 hours', riskMethods: ['Automated Stops'], 
    bio: 'My algorithms never sleep. They harvest small profits across hundreds of pairs on Binance daily.',
    category: 'binance'
  },
  { 
    id: '21', name: 'Cardano Captain', 
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', 
    roi: 112.4, drawdown: 6.2, followers: 18900, weeks: 120, strategy: 'Scientific Investing',
    type: 'Educator', experienceYears: 11, markets: ['ADA', 'Cardano Native Assets'], riskScore: 2,
    winRate: 76.5, avgDuration: '6 months', riskMethods: ['Cold Storage Staking'], 
    bio: 'Patient, long-term approach to the Cardano ecosystem focusing on peer-reviewed development cycles.',
    category: 'crypto'
  },
  { 
    id: '22', name: 'Binary Flow Expert', 
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', 
    roi: 242.1, drawdown: 6.8, followers: 11200, weeks: 78, strategy: 'VWAP Deviation',
    type: 'Analyst', experienceYears: 6, markets: ['Binary Options'], riskScore: 5,
    winRate: 83.3, avgDuration: '3 min', riskMethods: ['Volatility Sizing'], 
    bio: 'I use volume-weighted average price to identify binary exhaustion points. Very high strike rate.',
    category: 'binary'
  },
  { 
    id: '23', name: 'Meme Mogul', 
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop', 
    roi: 945.8, drawdown: 52.1, followers: 56000, weeks: 28, strategy: 'Viral Sentiment Tracker',
    type: 'Trader', experienceYears: 3, markets: ['DOGE', 'PEPE', 'SHIB'], riskScore: 10,
    winRate: 41.5, avgDuration: '1 hour', riskMethods: ['Moon Bag Allocation'], 
    bio: 'I trade the internet. If it’s trending on X, I’m in. High stakes, astronomical returns for the brave.',
    category: 'crypto'
  },
  { 
    id: '24', name: 'Scalp Sensei', 
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop', 
    roi: 176.4, drawdown: 3.2, followers: 19500, weeks: 142, strategy: 'Heikin Ashi Scalp',
    type: 'Trader', experienceYears: 9, markets: ['Forex', 'Binance Futures'], riskScore: 3,
    winRate: 88.2, avgDuration: '5 min', riskMethods: ['Trailing Profits'], 
    bio: 'Slow and steady wins the race. I take dozens of small wins every single day with almost no drawdown.',
    category: 'binance'
  },
  { 
    id: '25', name: 'Binary Bolt', 
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop', 
    roi: 456.2, drawdown: 14.5, followers: 13400, weeks: 32, strategy: '60-Second Reversal',
    type: 'Trader', experienceYears: 5, markets: ['Binary Options'], riskScore: 9,
    winRate: 72.8, avgDuration: '1 min', riskMethods: ['Fixed Stake Only'], 
    bio: 'Lightning-fast binary execution. We target high-velocity candle reversals for quick 80% returns.',
    category: 'binary'
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
  const [activeCategory, setActiveCategory] = useState<'binance' | 'crypto' | 'binary'>('binance');
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
      const filtered = MOCK_TRADERS.filter(t => t.category === activeCategory);
      if (filtered.length === 0) return;
      const randomIdx = Math.floor(Math.random() * filtered.length);
      const trader = filtered[randomIdx];
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
  }, [activeCategory]);

  const filteredTraders = MOCK_TRADERS.filter(t => t.category === activeCategory);

  return (
    <section className="py-16 md:py-24 bg-[#131722] border-t border-[#2a2e39]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic">
            Top Tier Performance
          </h2>
          
          {/* CATEGORY FILTER BUTTONS */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {(['binance', 'crypto', 'binary'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                  activeCategory === cat 
                  ? 'bg-[#f01a64] text-white border-[#f01a64] shadow-[0_0_20px_rgba(240,26,100,0.4)]' 
                  : 'bg-[#1e222d] text-gray-500 border-[#2a2e39] hover:border-[#f01a64]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mt-8">
            Replicating active {activeCategory} signals in real-time
          </p>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 md:gap-6 py-4 px-2 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {filteredTraders.map(trader => (
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
