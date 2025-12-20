
import React from 'react';

interface HeroProps {
  onJoinClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinClick }) => {
  return (
    <section className="relative overflow-hidden pt-16 pb-32 md:pt-32 md:pb-56 bg-[#131722]">
      {/* PROFESSIONAL BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <img 
          src="workspace.jpg" 
          alt="Professional World Trade Platform Setup" 
          className="w-full h-full object-cover opacity-25 scale-105"
        />
        {/* Multilayered Overlays for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e222d] via-transparent to-[#131722]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#131722] via-transparent to-[#131722] opacity-80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* Friendly Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="w-1.5 h-1.5 bg-[#ff8c00] rounded-full animate-ping"></span>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">YOUR PATH TO FINANCIAL INDEPENDENCE</span>
        </div>

        <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-[0.9] uppercase italic">
          TRADE SMARTER,<br />LIVE BETTER.
        </h1>
        
        <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-10 px-4 font-bold italic leading-relaxed">
          Achieve financial freedom and take control of your financial future. Follow the pros and create a second income stream today. Simple, fast, and secure.
        </p>
        
        {/* Glassmorphism Feature Box */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 mb-12 max-w-xl mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-[#00b36b] text-sm md:text-lg font-black uppercase tracking-widest">
                Dream Big
              </p>
              <p className="text-gray-500 text-[10px] uppercase font-bold">Copy the experts and watch your portfolio grow.</p>
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            <div className="text-right hidden md:block">
              <p className="text-white text-lg font-black uppercase tracking-tighter">TOTAL FREEDOM</p>
              <p className="text-gray-500 text-[10px] uppercase font-bold">Withdraw your profits anytime, anywhere.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-6 sm:px-0">
          <button 
            onClick={onJoinClick}
            className="w-full sm:w-auto px-12 py-5 bg-[#ff8c00] hover:bg-orange-600 text-white font-black text-xl rounded-xl shadow-[0_20px_50px_rgba(255,140,0,0.3)] transform transition hover:-translate-y-1 active:scale-95 uppercase tracking-tighter"
          >
            START MY JOURNEY
          </button>
          <button className="w-full sm:w-auto px-12 py-5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#00b36b] hover:text-[#00b36b] text-white font-black text-xl rounded-xl transition-all uppercase tracking-tighter">
            SEE LIVE RESULTS
          </button>
        </div>
        
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-[9px] md:text-xs text-gray-500 uppercase font-black tracking-[0.2em]">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#00b36b] rounded-full"></div>
            PROFITS: <span className="text-white">RELIABLE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#ff8c00] rounded-full"></div>
            ACCESS: <span className="text-white font-bold">INSTANT</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            SECURED: <span className="text-white">ALWAYS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
