
import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <section className="bg-[#131722] text-gray-300 py-16 border-t border-[#2a2e39]">
      <div className="max-w-5xl mx-auto px-4 space-y-16">

        {/* --- BLOCK 1: Rating --- */}
        <div className="flex items-center justify-between bg-[#1e222d] p-4 md:p-6 rounded-xl border border-[#2a2e39] shadow-lg max-w-2xl mx-auto">
          <div>
            <h3 className="text-white font-bold text-sm md:text-base">ZuluTrade for Social Trading</h3>
            <div className="text-yellow-400 text-sm mt-1">⭐ ⭐ ⭐ ⭐ ☆</div>
          </div>
          <button className="bg-[#f01a64] hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-colors">
            Open App
          </button>
        </div>

        {/* --- BLOCK 2: How to start --- */}
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">How to start CopyTrading with ZuluTrade?</h2>
            <p className="text-sm text-gray-400 font-medium">Opening an account with ZuluTrade is simple</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
            <div className="bg-[#1e222d]/50 p-5 rounded-2xl border border-white/5">
              <h4 className="text-white font-bold mb-2">Register</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Register with your personal details. We need these details to get to know you.</p>
            </div>
            <div className="bg-[#1e222d]/50 p-5 rounded-2xl border border-white/5">
              <h4 className="text-white font-bold mb-2">Choose your broker</h4>
              <p className="text-xs text-gray-400 leading-relaxed">You can choose a Broker to open a new account or connect an existing one.</p>
            </div>
            <div className="bg-[#1e222d]/50 p-5 rounded-2xl border border-white/5">
              <h4 className="text-white font-bold mb-2">Choose your Leaders</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Discover the Leader that matches your needs using more than 40 filters.</p>
            </div>
             <div className="bg-[#1e222d]/50 p-5 rounded-2xl border border-white/5">
              <h4 className="text-[#00b36b] font-bold mb-2">Start Copying!</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Start CopyTrading.</p>
            </div>
          </div>
          
          <div className="text-center pt-2">
             <button className="bg-[#00b36b] hover:bg-green-600 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg transition-transform active:scale-95">
               Create Account
             </button>
          </div>
        </div>

        {/* --- BLOCK 3: Navigation --- */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[9px] md:text-[10px] uppercase tracking-widest text-gray-500 font-bold border-y border-[#2a2e39] py-4">
            <span className="cursor-pointer hover:text-white transition-colors">Dashboard</span>
            <span className="cursor-pointer hover:text-white transition-colors">Leaders</span>
            <span className="cursor-pointer hover:text-white transition-colors">Markets</span>
            <span className="cursor-pointer hover:text-white transition-colors">Community</span>
            <span className="cursor-pointer hover:text-white transition-colors">More</span>
        </div>

        {/* --- BLOCK 4: Features --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
                <h3 className="text-white font-bold text-lg">Flexibility in Investment Size</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">Adjust the strategies you copy based on your account balance and risk appetite.</p>
            </div>
            <div className="space-y-3">
                <h3 className="text-white font-bold text-lg">Transparency</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">Track your Leaders through a leaderboard and real verified data.</p>
            </div>
            <div className="space-y-3">
                <h3 className="text-white font-bold text-lg">Learning Opportunities</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">Gain valuable insights from Leaders and apply them in your trading strategies in the future.</p>
            </div>
        </div>
        <div className="text-center">
             <button className="bg-[#00b36b] hover:bg-green-600 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg transition-transform active:scale-95">
               Create Account
             </button>
        </div>

        {/* --- BLOCK 5: Copy vs Manual --- */}
        <div className="text-center border-t border-[#2a2e39] pt-16">
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-12">Copy Trading vs. Manual Trading</h2>
            
            {/* Rating Repeat */}
            <div className="flex items-center justify-between bg-[#1e222d] p-4 rounded-xl border border-[#2a2e39] max-w-md mx-auto mb-12 shadow-lg">
              <div className="text-left">
                <h3 className="text-white font-bold text-sm">ZuluTrade for Social Trading</h3>
                <div className="text-yellow-400 text-xs mt-1">⭐ ⭐ ⭐ ⭐ ☆</div>
              </div>
              <button className="bg-[#f01a64] hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide">
                Open App
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-8">Discover why copy trading with ZuluTrade is so popular</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-[#1e222d] p-8 rounded-2xl border border-[#2a2e39] hover:border-[#f01a64]/30 transition-colors">
                    <h4 className="text-white font-bold mb-3 text-lg">Save Time</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Copy trading minimizes the time required for extensive market research and analysis. Copy traders can benefit from the skills and knowledge of Leaders to make informed trading decisions, saving time and effort.</p>
                </div>
                <div className="bg-[#1e222d] p-8 rounded-2xl border border-[#2a2e39] hover:border-[#f01a64]/30 transition-colors">
                    <h4 className="text-white font-bold mb-3 text-lg">Access to Leaders</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Copy Trading is a great way to learn how global markets operate. Learn from other experienced leaders who have their signals strategies with trading forex, stocks, crypto or other financial instruments.</p>
                </div>
            </div>
        </div>

        {/* --- BLOCK 6: Navigation Repeat --- */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[9px] md:text-[10px] uppercase tracking-widest text-gray-500 font-bold border-y border-[#2a2e39] py-4">
            <span className="cursor-pointer hover:text-white transition-colors">Dashboard</span>
            <span className="cursor-pointer hover:text-white transition-colors">Leaders</span>
            <span className="cursor-pointer hover:text-white transition-colors">Markets</span>
            <span className="cursor-pointer hover:text-white transition-colors">Community</span>
            <span className="cursor-pointer hover:text-white transition-colors">More</span>
        </div>

      </div>
    </section>
  );
};

export default InfoSection;
