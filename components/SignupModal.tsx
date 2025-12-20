
import React, { useState } from 'react';
import { authService, UserProfile } from '../services/authService';

interface SignupModalProps {
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = authService.getUser();
    if (isLogin && existing) {
      if (existing.email === email) {
        onSuccess(existing);
        onClose();
        return;
      } else {
        alert("Account not found. Please sign up.");
        return;
      }
    }

    const newUser: UserProfile = {
      username: username || 'Alpha_Trader',
      email: email,
      joinDate: new Date().toISOString(),
      balance: 1000,
      hasDeposited: false,
      wins: 0,
      losses: 0,
      totalInvested: 0
    };

    authService.saveUser(newUser);
    onSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-[#1e222d] border border-[#2a2e39] w-full max-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                {isLogin ? 'Login Now' : 'Join Network'}
              </h2>
              <p className="text-[10px] text-[#f01a64] font-black uppercase tracking-[0.3em] mt-2">
                Secure World Trade Platform Access
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-all p-2 bg-white/5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="group">
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#131722] border border-[#2a2e39] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#f01a64] transition-all font-bold"
                  placeholder="e.g. Rashid"
                />
              </div>
            )}
            
            <div className="group">
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131722] border border-[#2a2e39] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#f01a64] transition-all font-bold"
                placeholder="name@example.com"
              />
            </div>
            
            <div className="group">
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#131722] border border-[#2a2e39] rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#f01a64] transition-all font-bold"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#f01a64] hover:bg-pink-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all mt-6 uppercase tracking-[0.2em]"
            >
              {isLogin ? 'Login Now' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2a2e39] text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-[#f01a64] font-black hover:text-white transition-colors uppercase tracking-widest"
            >
              {isLogin ? "New user? Create Account" : "Existing user? Login Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
