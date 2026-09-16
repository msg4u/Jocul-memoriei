import React, { useState, useEffect } from 'react';
import { STORY_SLIDES, ANIMALS_DATA } from '../data/animalsData';
import { Volume2, VolumeX, ChevronRight, ChevronLeft, Sparkles, Play, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface StoryViewerProps {
  onStartGame: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ onStartGame }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const slide = STORY_SLIDES[currentSlide];

  useEffect(() => {
    const unsub = soundManager.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  useEffect(() => {
    // Read current slide aloud with warm Kore voice
    const fullText = `${slide.title}. ${slide.subtitle}. ${slide.text}`;
    soundManager.speak(fullText);

    return () => {
      soundManager.stopSpeaking();
    };
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < STORY_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
      soundManager.playCardFlip();
    } else {
      onStartGame();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      soundManager.playCardFlip();
    }
  };

  const handleReadCurrent = () => {
    if (isSpeaking) {
      soundManager.stopSpeaking();
    } else {
      const fullText = `${slide.title}. ${slide.subtitle}. ${slide.text}`;
      soundManager.speak(fullText);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Story book container */}
      <div className="bg-white rounded-3xl shadow-xl border-4 border-amber-200 overflow-hidden">
        {/* Story Header */}
        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl bg-white/20 p-2 rounded-2xl">📖</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                Povestea Punctului de Plecare
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Marele Bâlci al Caselor Pierdute
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="story-read-voice-btn"
              onClick={handleReadCurrent}
              className={`p-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs ${
                isSpeaking
                  ? 'bg-rose-600 text-white ring-2 ring-white animate-pulse'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Ascultă lectura în limba română (adaptată pentru copii)"
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">
                {isSpeaking ? 'Oprește Lectura' : 'Citește-mi'}
              </span>
            </button>
          </div>
        </div>

        {/* Progress Bar / Step Indicators */}
        <div className="bg-amber-100/70 px-4 py-2 flex items-center justify-between border-b border-amber-200 text-xs font-bold text-amber-900">
          <span>Pagina {currentSlide + 1} din {STORY_SLIDES.length}</span>
          <div className="flex gap-1.5">
            {STORY_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  soundManager.playCardFlip();
                }}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-8 bg-amber-600'
                    : 'w-2.5 bg-amber-300 hover:bg-amber-400'
                }`}
                aria-label={`Pagina ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Story Illustration Scene */}
        <div className={`p-6 sm:p-8 bg-gradient-to-b ${slide.bg} transition-colors duration-500`}>
          {/* Animated Illustrated Canvas for the scene */}
          <div className="relative w-full h-56 sm:h-72 rounded-3xl bg-white/70 backdrop-blur-xs border-2 border-white/80 shadow-md flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background elements according to scene */}
            {slide.scene === 'wind' && (
              <div className="relative flex flex-col items-center">
                <div className="text-7xl sm:text-8xl animate-wobble mb-2">🌪️</div>
                <div className="flex gap-4 text-3xl animate-bounce">
                  <span>🐻‍❄️💨</span>
                  <span>🐫💨</span>
                  <span>🐠💨</span>
                </div>
                <span className="text-sm font-black text-sky-800 mt-3 bg-white/80 px-3 py-1 rounded-full shadow-xs">
                  Vjjuuu! Vântul a amestecat totul!
                </span>
              </div>
            )}

            {slide.scene === 'bear-desert' && (
              <div className="relative flex flex-col items-center">
                <div className="text-7xl sm:text-8xl animate-bounce mb-2">🐻‍❄️</div>
                <div className="flex items-center gap-2 text-2xl font-bold text-amber-700 bg-amber-100/90 px-4 py-1.5 rounded-full border border-amber-300 shadow-xs">
                  <span>☀️ 45°C</span>
                  <span>🏜️ Nisip fierbinte!</span>
                  <span>💦 Transpir!</span>
                </div>
                <p className="text-xs text-amber-900 font-bold mt-2 text-center max-w-sm">
                  „Nu pot să respir! Eu am blană albă și groasă pentru gheață, nu pentru soare arzător!”
                </p>
              </div>
            )}

            {slide.scene === 'camel-ice' && (
              <div className="relative flex flex-col items-center">
                <div className="text-7xl sm:text-8xl animate-wobble mb-2">🐫</div>
                <div className="flex items-center gap-2 text-2xl font-bold text-sky-800 bg-sky-100/90 px-4 py-1.5 rounded-full border border-sky-300 shadow-xs">
                  <span>❄️ -25°C</span>
                  <span>🧊 Banchiză rece</span>
                  <span>🥶 Brrr!</span>
                </div>
                <p className="text-xs text-sky-900 font-bold mt-2 text-center max-w-sm">
                  „Nu am blană deasă să mă încălzească! Eu sunt obișnuită cu dunele calde de deșert!”
                </p>
              </div>
            )}

            {slide.scene === 'fish-tree' && (
              <div className="relative flex flex-col items-center">
                <div className="text-7xl sm:text-8xl animate-bounce mb-2">🐠</div>
                <div className="flex items-center gap-2 text-2xl font-bold text-emerald-800 bg-emerald-100/90 px-4 py-1.5 rounded-full border border-emerald-300 shadow-xs">
                  <span>🌴 Copac uscat</span>
                  <span>🚫 Fără apă!</span>
                </div>
                <p className="text-xs text-emerald-900 font-bold mt-2 text-center max-w-sm">
                  „Nu am plămâni, respir prin branhii! Am nevoie urgentă de mare și recif!”
                </p>
              </div>
            )}

            {slide.scene === 'ana-helps' && (
              <div className="relative flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-100 border-4 border-pink-300 flex items-center justify-center text-4xl shadow-md animate-bounce">
                    👧
                  </div>
                  <span className="text-3xl">✨</span>
                  <div className="text-5xl animate-pulse">💡</div>
                </div>
                <div className="bg-pink-50 text-pink-900 px-4 py-1.5 rounded-full border border-pink-200 text-xs font-extrabold shadow-xs">
                  Ana: „Vă ajut eu! Știu exact unde vă este căsuța!”
                </div>
              </div>
            )}

            {slide.scene === 'happy-ending' && (
              <div className="relative flex flex-col items-center text-center">
                <div className="flex flex-wrap items-center justify-center gap-3 text-4xl sm:text-5xl mb-3">
                  <span className="hover:scale-125 transition-transform cursor-pointer">🐻‍❄️🧊</span>
                  <span className="hover:scale-125 transition-transform cursor-pointer">🐫🏜️</span>
                  <span className="hover:scale-125 transition-transform cursor-pointer">🐧🏔️</span>
                  <span className="hover:scale-125 transition-transform cursor-pointer">🐒🌴</span>
                  <span className="hover:scale-125 transition-transform cursor-pointer">🐠🌊</span>
                </div>
                <div className="bg-emerald-100 text-emerald-900 px-4 py-1 rounded-full border border-emerald-300 font-black text-xs sm:text-sm">
                  🎉 Toate animalele sunt fericite acasă!
                </div>
              </div>
            )}
          </div>

          {/* Story Text Box */}
          <div className="mt-5 bg-white/95 rounded-2xl p-5 border-2 border-amber-200 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                  {slide.title}
                </h3>
                <p className="text-sm font-bold text-amber-700 mt-0.5">
                  {slide.subtitle}
                </p>
              </div>
              <button
                id="inline-story-listen-btn"
                onClick={handleReadCurrent}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 text-xs font-black transition-all shadow-xs shrink-0 ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                }`}
                title="Ascultă această pagină în limba română"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isSpeaking ? 'Pauză' : 'Ascultă'}
                </span>
              </button>
            </div>
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed mt-3">
              {slide.text}
            </p>
          </div>
        </div>

        {/* Story Footer Controls */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            id="story-prev-btn"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`px-4 py-3 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition-all ${
              currentSlide === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-400'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Înapoi</span>
          </button>

          <button
            id="story-reset-btn"
            onClick={() => {
              setCurrentSlide(0);
              soundManager.playCardFlip();
            }}
            className="p-3 bg-white hover:bg-slate-100 text-slate-600 rounded-2xl border border-slate-300 shadow-xs"
            title="Reîncepe povestea"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {currentSlide < STORY_SLIDES.length - 1 ? (
            <button
              id="story-next-btn"
              onClick={handleNext}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base rounded-2xl shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Următoarea Pagină</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              id="story-play-game-btn"
              onClick={onStartGame}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl flex items-center gap-2 animate-bounce active:scale-95 transition-all"
            >
              <span>Fii Ana și Pune Casele la Loc! 🎴</span>
              <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
