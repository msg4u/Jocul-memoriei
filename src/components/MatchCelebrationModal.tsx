import React, { useEffect } from 'react';
import { AnimalPair } from '../types';
import { Volume2, VolumeX, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface MatchCelebrationModalProps {
  pair: AnimalPair;
  onClose: () => void;
  isTriple?: boolean;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  pair,
  onClose,
  isTriple,
}) => {
  useEffect(() => {
    // Read Ana's explanation out loud automatically if voice is on
    const speechText = `Felicitări! Ai salvat ${pair.name}! ${pair.adaptationWhy}`;
    soundManager.speak(speechText);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      soundManager.stopSpeaking();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pair, onClose]);

  const handleSpeak = () => {
    const fullText = `Bravo! ${pair.name} s-a întors acasă, în ${pair.habitatName}! ${pair.adaptationWhy}`;
    soundManager.speak(fullText);
  };

  return (
    <div
      id="match-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-amber-300 max-h-[92vh] overflow-y-auto transform animate-in zoom-in-95 duration-200"
        style={{
          background: `radial-gradient(circle at top, ${pair.bgColor} 0%, #ffffff 70%)`,
        }}
      >
        {/* Close Button top-right */}
        <button
          id="close-match-modal-x"
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center transition-all shadow-xs border border-slate-200 z-10"
          title="Închide fereastra"
        >
          ✕
        </button>

        {/* Decorative badge */}
        <div className="absolute top-4 left-4 text-emerald-500">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        {/* Ana & Animal Mascot Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl sm:text-5xl animate-bounce">{pair.emoji}</span>
            <span className="text-2xl font-bold text-amber-500">❤️</span>
            <span className="text-4xl sm:text-5xl animate-bounce delay-100">{pair.habitatEmoji}</span>
            {isTriple && (
              <>
                <span className="text-2xl font-bold text-amber-500">❤️</span>
                <span className="text-4xl sm:text-5xl animate-bounce delay-200">{pair.foodEmoji}</span>
              </>
            )}
          </div>

          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-300 uppercase tracking-wide mb-1">
            Casă Adevărată Găsită!
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            {pair.name} e fericit!
          </h3>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">
            Mulțumită ție, ca Ana, ordinea a fost restabilită!
          </p>
        </div>

        {/* Story Connection & Scientific Explanation Card */}
        <div className="mt-4 space-y-3">
          {/* Why this is their real home (Adaptation) */}
          <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-100 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-xl shrink-0">
              💡
            </div>
            <div>
              <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                Secretul Anei (Adaptarea la Mediu):
              </h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed mt-0.5">
                {pair.adaptationWhy}
              </p>
            </div>
          </div>

          {/* Mixed up fun memory from the story */}
          <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-200/80 shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-lg shrink-0">
              🌪️
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Ce s-a întâmplat când a suflat vântul:
              </h4>
              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed mt-0.5">
                {pair.mixedUpProblem}
              </p>
            </div>
          </div>

          {/* Triple bonus: Food */}
          {isTriple && (
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
              <span className="text-xl">{pair.foodEmoji}</span>
              <p className="text-xs text-emerald-900 font-medium">
                <strong>Hrana preferată:</strong> {pair.foodName} ({pair.foodDescription})
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex items-center gap-3">
          <button
            id="speak-explanation-btn"
            onClick={handleSpeak}
            className="px-4 py-3 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold rounded-2xl flex items-center gap-2 transition-colors border border-sky-200 text-sm active:scale-95"
            title="Ascultă explicația Anei"
          >
            <Volume2 className="w-5 h-5 text-sky-600" />
            <span className="hidden sm:inline">Ascultă</span>
          </button>

          <button
            id="continue-game-btn"
            onClick={onClose}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-base rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <span>Continuă Misiunea!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
