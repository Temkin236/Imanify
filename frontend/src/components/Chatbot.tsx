import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, AlertCircle, Mic, Volume2 } from 'lucide-react';
import { chatbotClient } from '../services/chatbotClient';
import { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Assalamu Alaikum! I am Imanify, your gentle spiritual companion. How is your heart feeling today? 💚' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const moodSuggestions = [
    { label: "Anxious", icon: "😟", prompt: "I feel anxious, suggest a dua for peace", color: "bg-rose-500/10 text-rose-400" },
    { label: "Grateful", icon: "🤲", prompt: "I feel grateful, suggest a dua of shukr", color: "bg-emerald-500/10 text-emerald-400" },
    { label: "Sad", icon: "😔", prompt: "I feel sad, suggest a verse of comfort", color: "bg-blue-500/10 text-blue-400" },
    { label: "Lost", icon: "🧭", prompt: "I feel lost, suggest a dua for guidance", color: "bg-amber-500/10 text-amber-400" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatbotClient.sendMessage(text.trim());
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMsg);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I apologize, but I encountered an issue: ${errorMsg}\n\n🤝 Please try again or check your connection.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      {/* Error Notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-rose-500/10 border border-rose-500/20 rounded-[1.2rem] p-3 mb-4 flex gap-3 items-start"
          >
            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400 shrink-0">
              <AlertCircle size={16} />
            </div>
            <p className="text-xs text-rose-400/80 leading-relaxed flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-rose-400/60 hover:text-rose-400 transition-colors ml-2"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <div className="bg-gold-500/5 border border-gold-500/10 rounded-[1.8rem] p-4 mb-6 flex gap-4 items-start">
        <div className="p-2 bg-gold-500/10 rounded-xl text-gold-400 shrink-0">
          <AlertCircle size={18} />
        </div>
        <p className="text-[10px] text-gold-400/60 leading-relaxed font-medium">
          Imanify provides general guidance based on Quran and Sunnah. Please consult qualified scholars for specific legal rulings (fatwas).
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar pb-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-4 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-3xl flex items-center justify-center shrink-0 shadow-xl ${msg.role === 'user' ? 'bg-gold-500 text-islamic-green-950' : 'bg-islamic-green-900 border border-white/10'}`}>
                {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
              </div>
              <div className={`p-6 rounded-3xl text-base leading-relaxed shadow-2xl relative ${msg.role === 'user' ? 'bg-gold-500 text-islamic-green-950 font-bold rounded-tr-none' : 'bg-white/5 border border-white/5 rounded-tl-none text-white/95'}`}>
                {msg.content}
                
                {msg.role === 'assistant' && i === 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                    <div className="p-2 bg-gold-500/10 rounded-xl text-gold-400">
                      <Volume2 size={16} />
                    </div>
                    <span className="amharic-text text-xs text-gold-400/60">የአማርኛ ድምፅ ማብራሪያ ይፈልጋሉ? (Amharic Voice Reflection?)</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-islamic-green-900 border border-white/10 flex items-center justify-center">
                <Sparkles size={20} className="animate-pulse text-gold-400" />
              </div>
              <div className="bg-white/5 border border-white/5 p-5 rounded-4xl rounded-tl-none flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-gold-500/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gold-500/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gold-500/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-6 space-y-6">
        {/* Mood Suggestions */}
        {messages.length < 3 && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] ml-2">How do you feel?</p>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {moodSuggestions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => handleSend(mood.prompt)}
                  className={`whitespace-nowrap px-6 py-4 rounded-4xl border border-white/5 flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl ${mood.color}`}
                >
                  <span className="text-xl">{mood.icon}</span>
                  <span className="font-bold text-sm tracking-tight">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Islam, Quran, Ramadan..."
            className="w-full bg-white/5 border border-white/5 rounded-[2.2rem] py-5 pl-6 pr-28 focus:outline-none focus:border-gold-500/30 focus:bg-white/10 transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-2xl transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'text-white/30 hover:text-white bg-white/5'}`}
            >
              <Mic size={22} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gold-500 text-islamic-green-950 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold-500/20 hover:scale-105 transition-transform"
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
