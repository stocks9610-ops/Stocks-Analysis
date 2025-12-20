
import React, { useState } from 'react';
import InstallGuide from './InstallGuide';
import FloatingFlags from './FloatingFlags';

interface HeroProps {
  onJoinClick: () => void;
  onInstallRequest: () => Promise<boolean>;
}

const Hero: React.FC<HeroProps> = ({ onJoinClick, onInstallRequest }) => {
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [shareText, setShareText] = useState('SHARE');

  const handleShare = async () => {
    const text = "🔥 Check out this elite Copy-Trading platform! I'm following top traders and growing my wealth. Start your journey here:";
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CopyTrade Platform',
          text: text,
          url: url,
        });
        return;
      } catch (err) {
        console.log("Native share failed, falling back to Telegram");
      }
    }

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
    
    setShareText('LINK SENT!');
    setTimeout(() => setShareText('SHARE'), 2000);
  };

  const handleInstallClick = async () => {
    const shouldShowGuide = await onInstallRequest();
    if (shouldShowGuide) {
      setShowInstallGuide(true);
    }
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-32 md:pt-32 md:pb-56 bg-[#131722]">
      {/* FLOATING FLAGS LAYER */}
      <FloatingFlags />

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
          <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-ping"></span>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">SECURE APP CLUSTER ACTIVE</span>
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
            className="w-full sm:w-auto px-10 py-5 bg-[#f01a64] hover:bg-pink-700 text-white font-black text-lg rounded-xl shadow-lg transform transition hover:-translate-y-1 uppercase tracking-tighter"
          >
            START JOURNEY
          </button>
          
          <button 
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-10 py-5 bg-[#00b36b] hover:bg-green-600 text-white font-black text-lg rounded-xl shadow-lg transform transition hover:-translate-y-1 uppercase tracking-tighter flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            INSTALL APP
          </button>

          <button 
            onClick={handleShare}
            className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500 text-white font-black text-lg rounded-xl transition-all uppercase tracking-tighter flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-2.003 9.442c-.149.659-.537.818-1.089.508l-3.048-2.247-1.47 1.415c-.162.162-.299.3-.612.3l.219-3.106 5.651-5.108c.245-.219-.054-.341-.379-.126l-6.985 4.4-3.007-.941c-.654-.203-.667-.654.137-.967l11.75-4.529c.544-.203 1.02.123.836.761z"/>
            </svg>
            {shareText}
          </button>
        </div>
      </div>

      {showInstallGuide && <InstallGuide onClose={() => setShowInstallGuide(false)} />}
    </section>
  );
};

export default Hero;
