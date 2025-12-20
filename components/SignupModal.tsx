
import React, { useState } from 'react';
import { authService, UserProfile } from '../services/authService';

interface SignupModalProps {
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+92', country: 'PK' },
  { code: '+971', country: 'UAE' },
  { code: '+91', country: 'IN' },
  { code: '+27', country: 'ZA' },
  { code: '+60', country: 'MY' },
  { code: '+966', country: 'SA' },
  { code: '+234', country: 'NG' },
];

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [phone, setPhone] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const [isLogin, setIsLogin] = useState(false);

  const handleVerifyHuman = () => {
    if (!phone || phone.length < 7) {
      alert("Please enter a valid mobile number (at least 7 digits) first.");
      return;
    }
    setVerificationStatus('verifying');
    
    // Simulate automatic neural verification process
    setTimeout(() => {
      setVerificationStatus('verified');
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && verificationStatus !== 'verified') {
      alert("Please complete the human verification process first.");
      return;
    }

    const existing = authService.getUser();
    if (isLogin) {
      if (existing && existing.email === email) {
        onSuccess(existing);
        onClose();
        return;
      } else {
        alert("Account not found or invalid credentials. Please sign up if you are new.");
        return;
      }
    }

    const newUser: UserProfile = {
      username: username || 'Alpha_Trader',
      email: email,
      phone: `${countryCode}${phone}`,
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
      <div className="bg-[#1e222d] border border-[#2a2e39] w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                {isLogin ? 'Member Login' : 'Create Account'}
              </h2>
              <p className="text-[10px] text-[#f01a64] font-black uppercase tracking-[0.3em] mt-2">
                {isLogin ? 'Access your trading terminal' : 'Join the elite replication network'}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-all p-2 bg-white/5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="group animate-in slide-in-from-top-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1.5 tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#131722] border border-[#2a2e39] rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#f01a64] transition-all font-bold text-sm"
                  placeholder="e.g. Rashid"
                />
              </div>
            )}
            
            <div className="group">
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1.5 tracking-widest">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131722] border border-[#2a2e39] rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#f01a64] transition-all font-bold text-sm"
                placeholder="name@example.com"
              />
            </div>

            {!isLogin && (
              <div className="group animate-in slide-in-from-top-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1.5 tracking-widest">Mobile Number</label>
                <div className="flex gap-2">
                  <select 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-[#131722] border border-[#2a2e39] rounded-2xl px-3 py-3 text-white focus:outline-none focus:border-[#f01a64] font-bold text-xs appearance-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                    ))}
                  </select>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-[#131722] border border-[#2a2e39] rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#f01a64] transition-all font-bold text-sm"
                    placeholder="300 1234567"
                  />
                </div>
              </div>
            )}
            
            <div className="group">
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1.5 tracking-widest">Secure Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#131722] border border-[#2a2e39] rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#f01a64] transition-all font-bold text-sm"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div className="pt-2 animate-in slide-in-from-top-2">
                {verificationStatus === 'idle' && (
                  <button 
                    type="button"
                    onClick={handleVerifyHuman}
                    className="w-full bg-white/5 border border-[#f01a64]/30 text-[#f01a64] font-black py-3 rounded-2xl hover:bg-[#f01a64]/10 transition-all uppercase tracking-widest text-[10px]"
                  >
                    Run Human Verification
                  </button>
                )}
                {verificationStatus === 'verifying' && (
                  <div className="w-full bg-white/5 border border-[#f01a64]/30 text-[#f01a64] font-black py-3 rounded-2xl flex items-center justify-center gap-3">
                    <svg className="animate-spin h-4 w-4 text-[#f01a64]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="uppercase tracking-widest text-[10px] animate-pulse">Neural Audit in Progress...</span>
                  </div>
                )}
                {verificationStatus === 'verified' && (
                  <div className="w-full bg-[#00b36b]/10 border border-[#00b36b] text-[#00b36b] font-black py-3 rounded-2xl flex items-center justify-center gap-2 animate-in fade-in zoom-in-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="uppercase tracking-widest text-[10px]">Human Identity Verified</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 pt-4">
              <button 
                type="submit"
                className={`w-full font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-xs ${(!isLogin && verificationStatus !== 'verified') ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-[#f01a64] hover:bg-pink-700 text-white'}`}
              >
                {isLogin ? 'Authenticate Access' : 'Create Account'}
              </button>
              
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setVerificationStatus('idle');
                  }}
                  className="text-[10px] text-gray-500 hover:text-[#f01a64] font-black uppercase tracking-widest transition-colors py-2"
                >
                  {isLogin ? "Don't have an account? Join Now" : "Already registered? Log in"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
