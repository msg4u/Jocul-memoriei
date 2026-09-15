import React from 'react';
import { Sparkles, Volume2, VolumeX, BookOpen, Lightbulb, Scissors, Trophy, HelpCircle, Gamepad2 } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface NavbarProps {
  activeTab: 'game' | 'story';
  onSelectTab: (tab: 'game' | 'story') => void;
  onOpenGuide: () => void;
  onOpenCraft: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  savedAnimalsCount: number;
  totalAnimals: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenGuide,
  onOpenCraft,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
  savedAnimalsCount,
  totalAnimals,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-amber-200 shadow-xs px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand logo & Ana mascot */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div
            onClick={() => onSelectTab('game')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-2xl shadow-md border-2 border-white group-hover:scale-105 transition-transform">
              <span>👧</span>
              <span className="absolute -bottom-1 -right-1 text-xs">✨</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-tight">
                  Misiunea Anei
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md border border-rose-200">
                  4-7 Ani
                </span>
              </div>
              <p className="text-[11px] font-bold text-amber-700 leading-tight">
                Marele Bâlci al Caselor Pierdute
              </p>
            </div>
          </div>

          {/* Quick mobile score badge */}
          <div className="sm:hidden flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-full text-xs font-black text-amber-900 border border-amber-300">
            <span>⭐</span>
            <span>{savedAnimalsCount}/{totalAnimals}</span>
          </div>
        </div>

        {/* Main Tab Nav Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center overflow-x-auto py-0.5">
          <button
            id="tab-game-btn"
            onClick={() => {
              onSelectTab('game');
              soundManager.playCardFlip();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all active:scale-95 ${
              activeTab === 'game'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Jocul Memoriei</span>
          </button>

          <button
            id="tab-story-btn"
            onClick={() => {
              onSelectTab('story');
              soundManager.playCardFlip();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all active:scale-95 ${
              activeTab === 'story'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Povestea Anei</span>
          </button>

          {/* Guide Modal trigger */}
          <button
            id="open-guide-btn"
            onClick={onOpenGuide}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1 transition-all active:scale-95"
            title="Ghid Didactic pentru Părinți și Educatori"
          >
            <Lightbulb className="w-4 h-4 text-sky-600" />
            <span className="hidden md:inline">Ghid Părinți</span>
          </button>

          {/* Craft Modal trigger */}
          <button
            id="open-craft-btn"
            onClick={onOpenCraft}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 transition-all active:scale-95"
            title="Atelier DIY de Carton & Tipărire"
          >
            <Scissors className="w-4 h-4 text-rose-600" />
            <span className="hidden md:inline">Atelier Carton</span>
          </button>
        </div>

        {/* Right side: Audio controls & Score stars */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Audio effect toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Sunet activ' : 'Sunet oprit'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Saved count badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-amber-200 px-3 py-1.5 rounded-2xl border-2 border-amber-300 shadow-xs">
            <span className="text-base">⭐</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-amber-800 uppercase leading-none">
                Salvate
              </span>
              <span className="text-xs font-black text-amber-950 leading-none">
                {savedAnimalsCount} / {totalAnimals}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
