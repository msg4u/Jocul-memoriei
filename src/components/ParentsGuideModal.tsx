import React, { useEffect, useState } from 'react';
import { X, HelpCircle, Lightbulb, Users, Volume2 } from 'lucide-react';
import { ANIMALS_DATA } from '../data/animalsData';
import { soundManager } from '../utils/soundEffects';

interface ParentsGuideModalProps {
  onClose: () => void;
}

export const ParentsGuideModal: React.FC<ParentsGuideModalProps> = ({ onClose }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsub = soundManager.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
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
  }, [onClose]);

  const handleSpeakGuide = () => {
    if (isSpeaking) {
      soundManager.stopSpeaking();
    } else {
      soundManager.speak(
        'Concept științific: Adaptarea la mediu. Fiecare organism viu are trăsături fizice și comportamentale specifice care îi permit să supraviețuiască în mediul său nativ. Dacă este mutat brusc în alt habitat, nu poate supraviețui fără trăsăturile potrivite.'
      );
    }
  };

  return (
    <div
      id="guide-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col max-h-[90vh] overflow-hidden transform animate-in zoom-in-95 duration-200"
      >
        {/* Sticky Header - Always visible at top */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 border-b-2 border-amber-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-200 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs">
              🧭
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-black text-amber-800 uppercase tracking-wider block">
                Pentru Părinți și Educatori
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                Ghid Didactic & Întrebări
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="guide-listen-btn"
              onClick={handleSpeakGuide}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-extrabold text-xs sm:text-sm shadow-xs transition-all active:scale-95 ${
                isSpeaking
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-rose-200'
              }`}
              title="Ascultă introducerea ghidului în limba română"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSpeaking ? 'Pauză' : 'Ascultă Ghidul'}
              </span>
            </button>

            {/* Prominent, touch-friendly Close Button */}
            <button
              id="close-guide-modal-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-2 border-slate-200 hover:border-rose-300 font-extrabold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
              title="Închide ghidul (sau tasta Escape)"
            >
              <X className="w-4 h-4" />
              <span>Închide</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Core Biological Concept: Adaptation */}
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm sm:text-base mb-1">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Concept Științific: Adaptarea la Mediu</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              Povestea introduce, prin „haosul” creat de vânt și rezolvarea lui de către Ana,
              conceptul biologic de <strong>adaptare la mediu</strong>. Fiecare specie are caracteristici
              fizice (blană groasă, cocoașe cu rezerve, branhii, pene cerate) potrivite exact pentru un
              anumit tip de habitat. Scoaterea unui animal din mediul lui natural îi creează probleme reale
              de supraviețuire.
            </p>
          </div>

          {/* Recommended Questions to Ask */}
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2 mb-2.5">
              <HelpCircle className="w-5 h-5 text-sky-600 shrink-0" />
              <span>Întrebări de adresat copilului în timpul jocului:</span>
            </h3>

            <div className="space-y-2">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs sm:text-sm font-semibold text-sky-950 flex items-start gap-2.5">
                <span className="text-sky-600 font-black">1.</span>
                <span>„De ce crezi că ursul polar nu se simțea bine în deșert, ca în poveste?”</span>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs sm:text-sm font-semibold text-sky-950 flex items-start gap-2.5">
                <span className="text-sky-600 font-black">2.</span>
                <span>„Ce s-ar întâmpla cu cămila dacă ar rămâne pe banchiză, ca la începutul poveștii?”</span>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs sm:text-sm font-semibold text-sky-950 flex items-start gap-2.5">
                <span className="text-sky-600 font-black">3.</span>
                <span>„Ce au nevoie animalele de la casa lor adevărată ca să fie sănătoase și fericite?”</span>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs sm:text-sm font-semibold text-sky-950 flex items-start gap-2.5">
                <span className="text-sky-600 font-black">4.</span>
                <span>„Dacă vântul ar amesteca din nou casele, pe care animal crezi că l-ar afecta cel mai tare?”</span>
              </div>
            </div>
          </div>

          {/* Age progression tips */}
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2 mb-2.5">
              <Users className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Adaptarea pe Grupe de Vârstă (4 - 7 ani):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded-full">
                  4-5 Ani (Grupa Mică)
                </span>
                <p className="text-xs text-rose-950 font-medium mt-1.5 leading-relaxed">
                  Folosiți modul <strong>Începător (4 perechi)</strong>. Lăsați copilul să exploreze fără grabă. Vorbiți despre culori și sunetele animalelor.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  5-6 Ani (Grupa Mijlocie)
                </span>
                <p className="text-xs text-amber-950 font-medium mt-1.5 leading-relaxed">
                  Folosiți <strong>8 perechi</strong>. Discutați despre caracteristicile habitatului (frig, cald, uscat) și cum se adaptează corpul fiecăruia.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                  6-7 Ani (Grupa Mare)
                </span>
                <p className="text-xs text-emerald-950 font-medium mt-1.5 leading-relaxed">
                  Activați <strong>Triplu Memory</strong> (Animal + Casă + Hrană). Puneți întrebarea: „Ce ar mânca dacă ar fi în casa greșită?”.
                </p>
              </div>
            </div>
          </div>

          {/* Animal dictionary overview */}
          <div className="border-t border-slate-200 pt-3">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide mb-2">
              Fișe Rapide de Adaptare (8 Animale):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ANIMALS_DATA.map(a => (
                <div key={a.id} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1 font-bold text-slate-800 truncate">
                    <span>{a.emoji}</span>
                    <span className="truncate">{a.animalName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    🏠 {a.habitatName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Footer - Always visible at bottom */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Apasă <strong>Escape</strong> sau butonul din dreapta pentru a ieși
          </span>
          <button
            id="close-guide-footer-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md active:scale-95 ml-auto flex items-center justify-center gap-2"
          >
            <span>Am Înțeles, Înapoi la Joc! 🎴</span>
          </button>
        </div>
      </div>
    </div>
  );
};

