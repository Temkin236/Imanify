import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Play, 
  Bookmark, 
  Heart, 
  Moon, 
  Sun,
  Search,
  List,
  Sparkles,
  Volume2,
  Share2,
  BookOpen,
  MessageSquareText,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
  Headphones,
  Loader2
} from 'lucide-react';
import { SURAHS as INITIAL_SURAHS } from '../constants';
import { Surah, Verse } from '../types';
import { quranService } from '../services/quranService';

export const QuranReader: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>(INITIAL_SURAHS);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [juzVerses, setJuzVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showTranslations, setShowTranslations] = useState(true);
  const [fontSize, setFontSize] = useState(24);
  const [explainingVerse, setExplainingVerse] = useState<number | null>(null);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [showAmharicReflection, setShowAmharicReflection] = useState<number | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await quranService.getAllSurahs();
        setSurahs(data);
      } catch (error) {
        console.error("Failed to fetch surahs", error);
      }
    };
    fetchSurahs();
  }, []);

  const handleSurahClick = async (surah: Surah) => {
    setIsLoading(true);
    try {
      const details = await quranService.getSurahDetails(surah.id);
      setSelectedSurah(details);
    } catch (error) {
      console.error("Failed to fetch surah details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJuzClick = async (juzNum: number) => {
    setIsLoading(true);
    setSelectedJuz(juzNum);
    try {
      const verses = await quranService.getJuz(juzNum);
      setJuzVerses(verses);
    } catch (error) {
      console.error("Failed to fetch juz", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = (verse: Verse) => {
    setExplainingVerse(verse.number);
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.includes(searchQuery) ||
    s.id.toString() === searchQuery
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 size={48} className="text-gold-400 animate-spin" />
        <p className="accent-font text-gold-400 text-xl animate-pulse">Opening the Holy Word...</p>
      </div>
    );
  }

  if (selectedSurah || selectedJuz) {
    const title = selectedSurah ? selectedSurah.name : `Juz ${selectedJuz}`;
    const subTitle = selectedSurah ? `${selectedSurah.englishName} • ${selectedSurah.revelationType}` : `Part ${selectedJuz} of the Quran`;
    const verses = selectedSurah ? selectedSurah.verses : juzVerses;

    return (
      <div className={`space-y-4 sm:space-y-6 transition-all duration-1000 min-w-0 ${isDistractionFree ? 'fixed inset-0 z-[90] bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 p-4 sm:p-8 overflow-y-auto no-scrollbar pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]' : 'rounded-2xl sm:rounded-[3rem] p-4 sm:p-6 bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 border border-white/5'}`}>
        {/* Reader Header */}
        <div className={`flex items-center justify-between gap-2 sticky-below-header z-40 bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 backdrop-blur-xl py-3 sm:py-4 px-3 sm:px-4 rounded-2xl sm:rounded-[2rem] border border-white/5 shadow-2xl transition-all ${isDistractionFree ? '!top-4' : ''}`}>
          <button 
            onClick={() => {
              if (isDistractionFree) setIsDistractionFree(false);
              else {
                setSelectedSurah(null);
                setSelectedJuz(null);
              }
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 hover:from-islamic-green-800/60 hover:to-islamic-green-900/60 transition-all text-white/60 hover:text-white border border-white/5"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center min-w-0 flex-1 px-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold arabic-text text-gold-400 drop-shadow-md truncate">{title}</h2>
            {!isDistractionFree && (
              <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black mt-1">{subTitle}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDistractionFree(!isDistractionFree)}
              className={`p-3 rounded-2xl transition-all border border-white/5 ${isDistractionFree ? 'bg-gold-500 text-islamic-green-950 shadow-lg shadow-gold-500/20' : 'bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 text-white/40 hover:text-white hover:from-islamic-green-800/60 hover:to-islamic-green-900/60'}`}
            >
              {isDistractionFree ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            {!isDistractionFree && (
              <>
                <button 
                  onClick={() => setShowTranslations(!showTranslations)}
                  className={`p-3 rounded-2xl transition-all ${showTranslations ? 'bg-gold-500 text-islamic-green-950 shadow-lg' : 'bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 text-white/40 hover:text-white hover:from-islamic-green-800/60 hover:to-islamic-green-900/60'} border border-white/5`}
                >
                  <List size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Verses List */}
        <div className={`space-y-12 sm:space-y-20 pb-24 sm:pb-32 max-w-3xl mx-auto min-w-0 ${isDistractionFree ? 'pt-8 sm:pt-12' : ''}`}>
          {verses.map((verse) => (
            <motion.div 
              key={verse.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-10 group relative"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 sm:pb-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center text-xs sm:text-sm font-black border border-gold-500/20 shadow-xl shadow-gold-500/5 shrink-0">
                    {verse.number}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => handleExplain(verse)}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gold-500/10 border border-gold-500/20 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black text-gold-400 uppercase tracking-widest hover:bg-gold-500/20 transition-all"
                    >
                      <Sparkles size={14} />
                      Reflect
                    </button>
                    <button 
                      onClick={() => setShowAmharicReflection(showAmharicReflection === verse.number ? null : verse.number)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${showAmharicReflection === verse.number ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 border-white/10 text-white/40 hover:text-white'}`}
                    >
                      <Headphones size={14} />
                      <span className="hidden min-[380px]:inline">Amharic Voice</span>
                      <span className="min-[380px]:hidden">Voice</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 opacity-100 sm:opacity-20 sm:group-hover:opacity-100 transition-all flex-wrap">
                  {verse.audioUrl && (
                    <button 
                      onClick={() => new Audio(verse.audioUrl).play()}
                      className="p-3 hover:text-gold-400 transition-colors bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 rounded-xl border border-white/5 hover:from-islamic-green-800/60 hover:to-islamic-green-900/60"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                  <button className="p-3 hover:text-gold-400 transition-colors bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 rounded-xl border border-white/5 hover:from-islamic-green-800/60 hover:to-islamic-green-900/60"><Bookmark size={20} /></button>
                  <button className="p-3 hover:text-gold-400 transition-colors bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 rounded-xl border border-white/5 hover:from-islamic-green-800/60 hover:to-islamic-green-900/60"><Share2 size={20} /></button>
                </div>
              </div>
              
              <p 
                className="arabic-text text-right leading-[2.8] tracking-wide text-white/95 drop-shadow-sm font-arabic"
                style={{ fontSize: `${fontSize}px` }}
              >
                {verse.arabic}
              </p>

              <AnimatePresence>
                {showTranslations && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6 pl-8 border-l-2 border-gold-500/20 bg-gradient-to-r from-islamic-green-800/30 to-transparent rounded-r-2xl p-4"
                  >
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">English • Sahih International</p>
                      <p className="text-white/80 leading-relaxed text-xl font-medium tracking-tight">{verse.english}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gold-500/20 uppercase tracking-widest">Amharic • በአማርኛ</p>
                      <p className="amharic-text text-gold-400/60 leading-relaxed text-xl">{verse.amharic}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showAmharicReflection === verse.number && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 border border-white/5 rounded-[2rem] p-6 space-y-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gold-500/20 rounded-xl text-gold-400">
                          <Headphones size={18} />
                        </div>
                        <span className="text-[10px] font-black text-gold-400 uppercase tracking-widest">Amharic Voice Reflection</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-1 h-4 bg-gold-500/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                        ))}
                      </div>
                    </div>
                    <p className="amharic-text text-sm text-white/80 leading-relaxed">
                      ይህ አንቀጽ የአላህን ታላቅነት እና ለሰው ልጆች ያለውን እዝነት ያሳያል። በዕለት ተዕለት ሕይወታችን ውስጥ ይህንን በማስተንተን ወደ አላህ መቅረብ እንችላለን።
                    </p>
                    <button className="w-full py-3 bg-gold-500 text-islamic-green-950 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20">
                      Play Reflection Audio
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Font Adjuster Floating - Hidden in Distraction Free */}
        {!isDistractionFree && (
          <div className="fixed bottom-fab right-3 sm:right-6 z-40 flex flex-col gap-2 sm:gap-4">
            <button 
              onClick={() => setFontSize(prev => Math.min(prev + 4, 48))}
              className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-islamic-green-800/60 to-islamic-green-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl text-gold-400 hover:scale-110 transition-all"
            >
              <span className="font-bold text-sm sm:text-lg">A+</span>
            </button>
            <button 
              onClick={() => setFontSize(prev => Math.max(prev - 4, 16))}
              className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-islamic-green-800/60 to-islamic-green-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl text-gold-400 hover:scale-110 transition-all"
            >
              <span className="font-bold text-sm sm:text-lg">A-</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Smart Continuity System */}
      <section>
        <button 
          onClick={() => handleSurahClick(surahs[0])}
          className="w-full bg-gradient-to-r from-islamic-green-800/40 to-islamic-green-900/40 p-5 sm:p-8 rounded-2xl sm:rounded-[2.8rem] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all hover:bg-islamic-green-800/60 shadow-xl"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gold-500/20 rounded-[1.8rem] flex items-center justify-center text-gold-400 group-hover:rotate-6 transition-transform">
              <Clock size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-xl tracking-tight">Continue Reading</h3>
              <p className="accent-font text-gold-400/60 text-lg">You stopped at Ayah 45 yesterday 📖</p>
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mt-1">Surah Al-Baqarah</p>
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl text-white/20 group-hover:text-gold-400 group-hover:translate-x-2 transition-all">
            <ArrowRight size={24} />
          </div>
        </button>
      </section>

      {/* View Mode Switcher */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-islamic-green-800/40 to-islamic-green-900/40 p-2 rounded-[2rem] border border-white/5 mx-2">
        <button 
          onClick={() => setViewMode('surah')}
          className={`flex-1 py-4 rounded-[1.8rem] font-bold text-sm uppercase tracking-widest transition-all ${viewMode === 'surah' ? 'bg-gold-500 text-islamic-green-950 shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          Surahs
        </button>
        <button 
          onClick={() => setViewMode('juz')}
          className={`flex-1 py-4 rounded-[1.8rem] font-bold text-sm uppercase tracking-widest transition-all ${viewMode === 'juz' ? 'bg-gold-500 text-islamic-green-950 shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          Juz / Parts
        </button>
      </div>

      {viewMode === 'surah' ? (
        <>
          <div className="relative group px-2">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-400 transition-colors" size={24} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Surah, Verse, or Topic..." 
              className="w-full bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 border border-white/5 rounded-2xl sm:rounded-[2.5rem] py-4 sm:py-6 pl-12 sm:pl-16 pr-4 sm:pr-8 focus:outline-none focus:border-gold-500/30 transition-all shadow-inner text-base sm:text-lg"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 px-2">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.id}
                onClick={() => handleSurahClick(surah)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-8 bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 rounded-2xl sm:rounded-[2.8rem] border border-white/5 hover:bg-islamic-green-800/60 transition-all group relative overflow-hidden shadow-lg min-w-0"
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-[1.8rem] bg-gold-500/10 flex items-center justify-center text-base font-black text-gold-400 group-hover:bg-gold-500 group-hover:text-islamic-green-950 transition-all rotate-3 group-hover:rotate-0 shadow-xl shadow-gold-500/5">
                    {surah.id}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-xl tracking-tight">{surah.englishName}</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black mt-1">{surah.revelationType} • {surah.versesCount} Verses</p>
                  </div>
                </div>
                <span className="arabic-text text-2xl sm:text-3xl md:text-4xl text-gold-400/80 group-hover:text-gold-400 transition-colors relative z-10 drop-shadow-md self-end sm:self-auto">{surah.name}</span>
                
                {/* Subtle Hover Decoration */}
                <div className="absolute right-0 bottom-0 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none rotate-12">
                  <BookOpen size={160} strokeWidth={1} />
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 px-2">
          {[...Array(30)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handleJuzClick(i + 1)}
              className="flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 rounded-2xl sm:rounded-[2.5rem] border border-white/5 hover:bg-islamic-green-800/60 transition-all group shadow-lg"
            >
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Juz</span>
              <span className="text-3xl font-black text-gold-400 group-hover:scale-110 transition-transform">{i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
