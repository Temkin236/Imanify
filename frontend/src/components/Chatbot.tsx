import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, AlertCircle, Mic, Volume2, Copy, Check } from 'lucide-react';
import { chatbotClient } from '../services/chatbotClient';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';
import { ChatMessageContent } from './ChatMessageContent';
import { useThemeClasses } from '../hooks/useThemeClasses';

export const Chatbot: React.FC = () => {
  const tc = useThemeClasses();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '**Assalamu Alaikum!**\n\nI am Imanify, your gentle spiritual companion. I can help with duas, Quranic guidance, Ramadan, prayer, and everyday Islamic questions.\n\nHow is your heart feeling today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const handleSendRef = useRef<(text?: string) => Promise<void>>(async () => {});

  const speakText = useCallback((text: string, lang = 'en-US') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, '').replace(/^#+\s/gm, ''));
    utterance.lang = lang;
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }, []);

  const copyMessage = useCallback(async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setError('Could not copy to clipboard.');
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setError('Voice input is not supported in your browser. Please type your message.');
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setInput(transcript);
        handleSendRef.current(transcript);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setError('Could not recognize speech. Please try again or type your message.');
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setError(null);
  }, [isRecording]);

  const moodSuggestions = [
    { label: 'Anxious', icon: '😟', prompt: 'I feel anxious, suggest a dua for peace', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    { label: 'Grateful', icon: '🤲', prompt: 'I feel grateful, suggest a dua of shukr', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { label: 'Sad', icon: '😔', prompt: 'I feel sad, suggest a verse of comfort', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { label: 'Lost', icon: '🧭', prompt: 'I feel lost, suggest a dua for guidance', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  ];

  useEffect(() => {
    if (user?.email) {
      chatbotClient.setUserId(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(async (text: string = input) => {
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
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `**Something went wrong**\n\n${errorMsg}\n\nPlease try again in a moment, or tap one of the mood buttons above for instant guidance.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  return (
    <div className="flex flex-col h-app-chat min-h-0 flex-1">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3 mb-4 flex gap-3 items-start"
          >
            <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-400/80 leading-relaxed flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-rose-400/60 hover:text-rose-400">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${tc.isDarkMode ? 'bg-gold-500/5 border-gold-500/10' : 'bg-amber-50/80 border-amber-200/60'} border rounded-2xl px-3 sm:px-4 py-2 sm:py-3 mb-3 sm:mb-5 flex gap-2 sm:gap-3 items-center shrink-0`}>
        <AlertCircle size={16} className={`${tc.accent} shrink-0 hidden sm:block`} />
        <p className={`text-[10px] sm:text-[11px] ${tc.accentSoft} leading-relaxed`}>
          <span className="sm:hidden">Quran & Sunnah guidance — consult scholars for fatwas.</span>
          <span className="hidden sm:inline">General guidance from Quran & Sunnah. Consult scholars for specific fatwas.</span>
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto space-y-6 sm:space-y-10 pr-1 custom-scrollbar pb-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 sm:gap-4 min-w-0 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className={`w-9 h-9 rounded-2xl ${tc.botAvatar} flex items-center justify-center shrink-0 mt-1 shadow-lg`}>
                <Bot size={18} className="text-gold-400" />
              </div>
            )}

            <div className={`${msg.role === 'user' ? 'max-w-[90%] sm:max-w-[78%]' : 'flex-1 min-w-0 max-w-full sm:max-w-[calc(100%-3rem)]'}`}>
              {msg.role === 'user' ? (
                <div className="bg-gold-500 text-islamic-green-950 rounded-3xl rounded-tr-md px-4 py-3 sm:px-5 sm:py-4 shadow-lg shadow-gold-500/10">
                  <ChatMessageContent content={msg.content} isUser />
                </div>
              ) : (
                <div className="group space-y-4">
                  <div className={`rounded-3xl rounded-tl-md ${tc.assistantBubble} px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-7 backdrop-blur-sm`}>
                    <ChatMessageContent content={msg.content} />
                  </div>

                  <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity pl-1">
                    <button
                      onClick={() => copyMessage(msg.content, i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${tc.actionBtn} text-xs transition-colors`}
                      title="Copy response"
                    >
                      {copiedIndex === i ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copiedIndex === i ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={() => speakText(msg.content)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${tc.actionBtn} text-xs transition-colors`}
                      title="Listen to response"
                    >
                      <Volume2 size={14} />
                      Listen
                    </button>
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-9 h-9 rounded-2xl bg-gold-500 flex items-center justify-center shrink-0 mt-1 shadow-lg">
                <User size={18} className="text-islamic-green-950" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-2xl bg-islamic-green-900 border border-white/10 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="animate-pulse text-gold-400" />
            </div>
            <div className={`rounded-3xl rounded-tl-md ${tc.assistantBubble} px-6 py-5 flex items-center gap-2`}>
              <span className="w-2 h-2 bg-gold-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gold-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gold-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-white/40 ml-2">Imanify is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className={`mt-auto shrink-0 space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t ${tc.borderSubtle}`}>
        {messages.length < 3 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] ml-1">How do you feel?</p>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {moodSuggestions.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => handleSend(mood.prompt)}
                  disabled={isLoading}
                  className={`whitespace-nowrap px-5 py-3 rounded-2xl border flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${mood.color}`}
                >
                  <span>{mood.icon}</span>
                  <span className="font-semibold text-sm">{mood.label}</span>
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
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about Islam, Quran, duas, Ramadan..."
            className={`w-full ${tc.input} rounded-2xl py-3 sm:py-4 pl-4 sm:pl-5 pr-24 sm:pr-28 focus:outline-none transition-all text-sm sm:text-[15px]`}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button
              onClick={toggleRecording}
              title={isRecording ? 'Stop recording' : 'Speak your question'}
              className={`p-2.5 rounded-xl transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : `${tc.iconBtn}`}`}
            >
              <Mic size={20} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-gold-500 text-islamic-green-950 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-lg shadow-gold-500/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
