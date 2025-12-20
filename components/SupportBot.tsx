
import React, { useState, useRef, useEffect } from 'react';
import { startSupportChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface SupportBotProps {
  onClose: () => void;
}

const SUGGESTIONS = [
  "How to withdraw my $1,000 bonus?",
  "What is the security deposit?",
  "Is the 98% win rate guaranteed?",
  "How to verify my deposit?"
];

const SupportBot: React.FC<SupportBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to the Neural Support Node. I am Astra. How may I assist your capital growth today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = [...messages, userMessage].map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await startSupportChat(history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText || "I'm having trouble connecting to the neural network. Please check your link." }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[400px] h-full sm:h-[600px] bg-[#1e222d] border-l sm:border border-[#2a2e39] sm:rounded-[2.5rem] shadow-2xl z-[70] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6">
      {/* HEADER */}
      <div className="p-6 bg-[#131722] border-b border-[#2a2e39] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f01a64] rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(240,26,100,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none">Astra Concierge</h3>
            <span className="text-[9px] text-[#00b36b] font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1 h-1 bg-[#00b36b] rounded-full animate-pulse"></span>
              Neural Node Active
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* CHAT AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[#131722]/40">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
              m.role === 'user' ? 'bg-[#f01a64] text-white rounded-tr-none' : 'bg-[#1e222d] text-gray-200 border border-[#2a2e39] rounded-tl-none shadow-xl'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1e222d] p-4 rounded-2xl border border-[#2a2e39] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-[#f01a64] rounded-full animate-bounce [animation-delay:-0.5s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-[#131722] border-t border-[#2a2e39]">
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTIONS.map(s => (
              <button 
                key={s} 
                onClick={() => handleSend(s)}
                className="text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-2 rounded-lg hover:border-[#f01a64] hover:text-[#f01a64] transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Astra anything..."
            className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl py-4 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-[#f01a64] transition-all font-bold placeholder:text-gray-600"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f01a64] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportBot;
