
import React, { useState } from 'react';
import InstallGuide from './InstallGuide';

interface HeroProps {
  onJoinClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinClick }) => {
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const handleShare = () => {
    const text = "Check out this elite Copy-Trading platform! Trade like a pro and grow your wealth. Join here:";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-32 md:pt-32 md:pb-56 bg-[#131722]">
      {/* PROFESSIONAL BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <img 
          src="workspace.jpg" 
          alt="Professional World Trade Platform Setup" 
          className="w-full h-full object-cover opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e222d] via-transparent to-[#131722]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#131722] via-transparent to-[#131722] opacity-80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
          <span className="w-1.5 h-1.5 bg-[#ff8c00] rounded-full animate-ping"></span>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">SIMPLE MOBILE APP INSTALLATION ACTIVE</span>
        </div>

        <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-[0.9] uppercase italic">
          TRADE SMARTER,<br />LIVE BETTER.
        </h1>
        
        <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-10 px-4 font-bold italic leading-relaxed">
          Achieve financial freedom. Follow the pros and create a second income stream today. Simple, fast, and secure.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-6 sm:px-0">
          <button 
            onClick={onJoinClick}
            className="w-full sm:w-auto px-10 py-5 bg-[#ff8c00] hover:bg-orange-600 text-white font-black text-lg rounded-xl shadow-lg transform transition hover:-translate-y-1 uppercase tracking-tighter"
          >
            START JOURNEY
          </button>
          
          <button 
            onClick={() => setShowInstallGuide(true)}
            className="w-full sm:w-auto px-10 py-5 bg-[#00b36b] hover:bg-green-600 text-white font-black text-lg rounded-xl shadow-lg transform transition hover:-translate-y-1 uppercase tracking-tighter flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            DOWNLOAD APP
          </button>

          <button 
            onClick={handleShare}
            className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-green-500 text-white font-black text-lg rounded-xl transition-all uppercase tracking-tighter flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            SHARE
          </button>
        </div>
      </div>

      {showInstallGuide && <InstallGuide onClose={() => setShowInstallGuide(false)} />}
    </section>
  );
};

export default Hero;
