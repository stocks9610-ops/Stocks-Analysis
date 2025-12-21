import React, { useState } from 'react';
import { authService, UserProfile } from '../services/authService';

interface SignupModalProps {
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+27', country: 'ZA' },
  { code: '+92', country: 'PK' },
  { code: '+91', country: 'IN' }
];

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [phone, setPhone] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const [isLogin, setIsLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = () => {
    if (!phone) return;
    setVerificationStatus('verifying');
    setTimeout(() => setVerificationStatus('verified'), 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (isLogin) {
      const user = await authService.login(email, password);
      if (user) onSuccess(user);
      else { alert("Invalid login."); setIsSubmitting(false); }
    } else {
      if (verificationStatus !== 'verified') { alert("Verify first."); setIsSubmitting(false); return; }
      const newUser: UserProfile = {
        username: username || 'User',
        email, password, phone: `${countryCode}${phone}`,
        joinDate: new Date().toISOString(),
        balance: 1000, hasDeposited: false, wins: 0, losses: 0, totalInvested: 0
      };
      const success = await authService.register(newUser);
      if (success) onSuccess(newUser);
      else { alert("Registration failed."); setIsSubmitting(false); }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-[#1e222d] w-full h-full sm:h-auto sm:max-w-md sm:rounded-[2.5rem] flex flex-col overflow-hidden animate-in zoom-in-95">
        <div className="p-6 md:p-10 overflow-y-auto no-scrollbar flex-1 pb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
              {isLogin ? 'Welcome Back' : 'Create Identity'}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-500 active:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input 
                type="text" required placeholder="Full Name" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-5 py-3.5 text-white focus:border-[#f01a64] font-bold text-sm outline-none"
              />
            )}
            <input 
              type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-5 py-3.5 text-white focus:border-[#f01a64] font-bold text-sm outline-none"
            />
            {!isLogin && (
              <div className="flex gap-2">
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="bg-[#131722] border border-[#2a2e39] rounded-xl px-3 py-3 text-white text-xs font-bold outline-none">
                  {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                </select>
                <input 
                  type="tel" required placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-[#131722] border border-[#2a2e39] rounded-xl px-5 py-3.5 text-white focus:border-[#f01a64] font-bold text-sm outline-none"
                />
              </div>
            )}
            <input 
              type="password" required placeholder="Secure Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-5 py-3.5 text-white focus:border-[#f01a64] font-bold text-sm outline-none"
            />

            {!isLogin && (
              <button 
                type="button" onClick={handleVerify}
                className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${verificationStatus === 'verified' ? 'bg-[#00b36b]/10 border-[#00b36b] text-[#00b36b]' : 'border-[#f01a64]/30 text-[#f01a64]'}`}
              >
                {verificationStatus === 'idle' ? 'Run Human Verification' : verificationStatus === 'verifying' ? 'Processing...' : 'Identity Verified'}
              </button>
            )}

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-[#f01a64] py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isLogin ? 'Member Login' : 'Join Network'}
            </button>

            <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-[10px] text-gray-500 font-black uppercase tracking-widest text-center py-2">
              {isLogin ? "No account? Join" : "Have an account? Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;