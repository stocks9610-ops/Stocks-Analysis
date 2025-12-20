
import React, { useState, useRef, useEffect } from 'react';
import { deepMarketAnalysis } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'World Trade Platform Intelligence Terminal active. Choose a task or upload a chart for deep analysis.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{data: string, type: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUGGESTED_TASKS = [
    { label: "Analyze my chart", prompt: "Perform technical analysis on this screenshot and identify support/resistance." },
    { label: "Trader Deep Dive", prompt: "Explain the pros and cons of following a 'Trend Following' vs 'Mean Reversion' strategy in current markets." },
    { label: "Macro Scan", prompt: "What are the top 3 macro risks for crypto in the next 30 days?" }
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage({ data: base64String, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaskClick = (prompt: string) => {
    if (prompt.includes("Analyze my chart") && !selectedImage) {
      fileInputRef.current?.click();
      return;
    }
    setInput(prompt);
  };

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    e?.preventDefault();
    const finalPrompt = customPrompt || input;
    if ((!finalPrompt.trim() && !selectedImage) || isLoading) return;

    const userMsg = finalPrompt;
    const currentImg = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setMessages(prev => [...prev, { role: 'user', text: userMsg || "[Image Analysis Requested]" }]);
    setIsLoading(true);

    const response = await deepMarketAnalysis(userMsg, currentImg?.data, currentImg?.type);
    
    setMessages(prev => [...prev, { role: 'model', text: response || "Analysis unavailable." }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#1e222d] border-l border-[#2a2e39] shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between bg-[#131722]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ff8c00] rounded flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <span className="font-black text-white text-xs tracking-widest uppercase block">AI Terminal</span>
            <span className="text-[9px] text-[#00b36b] font-bold">GEMINI-3 PRO ENGINE</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-6 bg-[#131722]/30">
        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2 mb-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Suggested Tasks:</p>
            {SUGGESTED_TASKS.map((task, i) => (
              <button 
                key={i}
                onClick={() => handleTaskClick(task.prompt)}
                className="text-left p-3 text-xs bg-[#1e222d] border border-[#2a2e39] rounded-lg text-gray-300 hover:border-[#ff8c00] transition-all"
              >
                {task.label}
              </button>
            ))}
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-[#ff8c00] text-white shadow-lg' : 'bg-[#1e222d] text-gray-200 border border-[#2a2e39]'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1e222d] p-3 rounded-xl border border-[#2a2e39] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ff8c00] rounded-full animate-bounce"></span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Processing Market Data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#131722] border-t border-[#2a2e39]">
        {selectedImage && (
          <div className="mb-3 p-2 bg-[#1e222d] border border-orange-500/30 rounded flex items-center justify-between">
            <span className="text-[10px] text-orange-500 font-bold uppercase">Chart Ready for Analysis</span>
            <button onClick={() => setSelectedImage(null)} className="text-red-500">×</button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-[#1e222d] border border-[#2a2e39] text-gray-400 rounded-lg hover:text-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </button>
          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or upload chart..."
              className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-lg py-3 pl-4 text-sm text-white focus:outline-none focus:border-[#ff8c00]"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#ff8c00]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
