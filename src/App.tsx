import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MemoryGame } from './components/MemoryGame';
import { StoryViewer } from './components/StoryViewer';
import { ParentsGuideModal } from './components/ParentsGuideModal';
import { PrintableCardsModal } from './components/PrintableCardsModal';
import { soundManager } from './utils/soundEffects';
import { Sparkles, BookOpen, Lightbulb, Scissors, Heart, Sun, Cloud } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'story'>('game');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isCraftOpen, setIsCraftOpen] = useState<boolean>(false);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isSoundEnabled());
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(soundManager.isVoiceEnabled());

  const [savedCount, setSavedCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(4);

  const handleToggleSound = () => {
    const next = soundManager.toggleSound();
    setSoundEnabled(next);
  };

  const handleToggleVoice = () => {
    const next = soundManager.toggleVoice();
    setVoiceEnabled(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-50 text-slate-800 flex flex-col relative overflow-x-hidden selection:bg-amber-200">
      {/* Whimsical Background floating decorations */}
      <div className="absolute top-12 left-6 text-amber-300 pointer-events-none opacity-60 animate-float">
        <Sun className="w-16 h-16 animate-spin-slow" />
      </div>
      <div className="absolute top-24 right-10 text-sky-200 pointer-events-none opacity-70 animate-float" style={{ animationDelay: '1.5s' }}>
        <Cloud className="w-20 h-20" />
      </div>
      <div className="absolute top-72 left-4 text-emerald-200 pointer-events-none opacity-40">
        <span className="text-4xl">🌿</span>
      </div>
      <div className="absolute top-96 right-6 text-amber-200 pointer-events-none opacity-40">
        <span className="text-4xl">🌸</span>
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenCraft={() => setIsCraftOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        savedAnimalsCount={savedCount}
        totalAnimals={totalCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 relative z-10">
        {activeTab === 'game' ? (
          <div>
            {/* Child-friendly Story Teaser Banner */}
            <div className="bg-gradient-to-r from-amber-400 via-rose-300 to-amber-300 p-3.5 sm:p-4 rounded-3xl shadow-md border-2 border-white text-slate-900 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <span className="text-3xl sm:text-4xl animate-wobble">🌪️🐻‍❄️</span>
                <div>
                  <h1 className="text-base sm:text-lg font-black leading-tight text-amber-950">
                    Marele Bâlci al Caselor Pierdute!
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-amber-900 leading-snug">
                    Vântul năzdrăvan a amestecat casele! Fii Ana și potrivește fiecare animal cu casa lui adevărată!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="open-story-from-banner"
                  onClick={() => setActiveTab('story')}
                  className="px-3.5 py-2 bg-white/90 hover:bg-white text-amber-950 font-black text-xs rounded-2xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Vezi Povestea</span>
                </button>
              </div>
            </div>

            {/* Memory Game Board */}
            <MemoryGame
              onStoryClick={() => setActiveTab('story')}
              onAnimalSavedChange={(saved, total) => {
                setSavedCount(saved);
                setTotalCount(total);
              }}
            />
          </div>
        ) : (
          <div>
            <StoryViewer onStartGame={() => setActiveTab('game')} />
          </div>
        )}
      </main>

      {/* Child-Friendly Footer */}
      <footer className="bg-white/80 backdrop-blur-xs border-t-2 border-amber-200 py-4 px-4 text-center text-xs text-slate-600 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>✨</span>
            <span>Joc educativ bazat pe conceptul de adaptare la mediu</span>
            <span>👧</span>
          </div>

          <div className="flex items-center gap-3 font-semibold text-slate-500">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-sky-700 underline transition-colors"
            >
              Ghid Părinți & Întrebări
            </button>
            <span>•</span>
            <button
              onClick={() => setIsCraftOpen(true)}
              className="hover:text-rose-700 underline transition-colors"
            >
              Cum construiești jocul din carton
            </button>
          </div>
        </div>
      </footer>

      {/* Parents Guide Modal */}
      {isGuideOpen && <ParentsGuideModal onClose={() => setIsGuideOpen(false)} />}

      {/* Crafting / Printable Cards Modal */}
      {isCraftOpen && <PrintableCardsModal onClose={() => setIsCraftOpen(false)} />}
    </div>
  );
}

