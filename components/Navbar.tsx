
import React from 'react';
import { UserProfile } from '../services/authService';

interface NavbarProps {
  onJoinClick: () => void;
  onGalleryClick: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onJoinClick, onGalleryClick, user, onLogout, onDashboardClick, onHomeClick }) => {
  return (
    <nav className="bg-[#1e222d] border-b border-[#2a2e39] py-3 md:py-4 px-4 md:px-10 flex items-center justify-between sticky top-0 z-[60] backdrop-blur-md bg-opacity-95">
      <div className="flex items-center gap-2 md:gap-3 cursor-pointer shrink-0" onClick={user ? onDashboardClick : onHomeClick}>
        <div className="bg-[#f01a64] p-1 md:p-1.5 rounded-lg">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3v11h7l-7 7V10H6l7-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black text-[#f01a64] tracking-tighter uppercase leading-none">
            CopyTrade
          </h1>
          <span className="text-[8px] md:text-[10px] text-gray-400 block -mt-0.5 font-semibold uppercase whitespace-nowrap">Elite Terminal v2.2</span>
        </div>
      </div>
      
      <div className="hidden md:flex gap-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
        <button onClick={onHomeClick} className="hover:text-white transition-colors">Marketplace</button>
        <button onClick={onGalleryClick} className="hover:text-pink-500 transition-colors">Success Hall</button>
        {user && <button onClick={onDashboardClick} className="text-[#f01a64] hover:text-white transition-colors">My Dashboard</button>}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {user ? (
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] md:text-xs text-white font-black uppercase tracking-tighter truncate max-w-[80px] md:max-w-none">
                {user.username.split(' ')[0]}
              </span>
              <span className={`text-[7px] md:text-[9px] font-black tracking-widest uppercase ${user.hasDeposited ? 'text-[#00b36b]' : 'text-[#f01a64]'}`}>
                {user.hasDeposited ? 'VERIFIED' : 'NEW'}
              </span>
            </div>
            <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg active:scale-90"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={onJoinClick}
              className="hidden sm:block text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              LOG IN
            </button>
            <button 
              onClick={onJoinClick}
              className="bg-transparent border border-[#f01a64] text-[#f01a64] px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] hover:bg-[#f01a64] hover:text-white transition-all shadow-lg uppercase tracking-widest active:scale-95"
            >
              JOIN
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
