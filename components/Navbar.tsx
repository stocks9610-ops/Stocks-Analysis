
import React from 'react';
import { UserProfile } from '../services/authService';

interface NavbarProps {
  onJoinClick: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onJoinClick, user, onLogout, onDashboardClick, onHomeClick }) => {
  return (
    <nav className="bg-[#1e222d] border-b border-[#2a2e39] py-4 px-5 md:px-10 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center gap-3 cursor-pointer" onClick={user ? onDashboardClick : onHomeClick}>
        <div className="bg-[#ff8c00] p-1.5 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3v11h7l-7 7V10H6l7-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-black text-[#ff8c00] tracking-tighter uppercase leading-none">
            CopyTrade
          </h1>
          <span className="text-[10px] text-gray-400 block -mt-1 font-semibold uppercase">Your Path to Freedom</span>
        </div>
      </div>
      
      <div className="hidden md:flex gap-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
        <button onClick={onHomeClick} className="hover:text-white transition-colors">Marketplace</button>
        {user && <button onClick={onDashboardClick} className="text-[#ff8c00] hover:text-white transition-colors">My Dashboard</button>}
        <a href="#" className="hover:text-white transition-colors">Markets</a>
        <a href="#" className="hover:text-white transition-colors">Academy</a>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-white font-black uppercase tracking-tighter">{user.username}</span>
              <span className={`text-[9px] font-black tracking-widest uppercase ${user.hasDeposited ? 'text-[#00b36b]' : 'text-[#ff8c00]'}`}>
                {user.hasDeposited ? 'VERIFIED PARTNER' : 'NEW MEMBER'}
              </span>
            </div>
            <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="bg-transparent border border-[#ff8c00] text-[#ff8c00] px-5 py-2.5 rounded-xl font-black text-[10px] hover:bg-[#ff8c00] hover:text-white transition-all shadow-lg uppercase tracking-widest"
            >
              JOIN NOW
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
