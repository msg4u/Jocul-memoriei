import React, { useState, useEffect } from 'react';
import { X, Printer, Scissors, CheckSquare, Sparkles, Layers, Download } from 'lucide-react';
import { ANIMALS_DATA } from '../data/animalsData';

interface PrintableCardsModalProps {
  onClose: () => void;
}

export const PrintableCardsModal: React.FC<PrintableCardsModalProps> = ({ onClose }) => {
  const [printMode, setPrintMode] = useState<'guide' | 'cards-front' | 'cards-back'>('guide');

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="craft-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col max-h-[90vh] overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Sticky Header - Always visible at top */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-rose-100 via-amber-50 to-rose-50 border-b-2 border-rose-200 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-200 border-2 border-rose-300 flex items-center justify-center text-2xl shadow-xs">
              ✂️
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-black text-rose-700 uppercase tracking-wider block">
                Activitate Practică Manuală (DIY)
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                Atelierul de Carton al Anei
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="trigger-print-btn"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Tipărește</span>
            </button>

            {/* Prominent Close Button */}
            <button
              id="close-craft-modal-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-2 border-slate-200 hover:border-rose-300 font-extrabold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
              title="Închide atelierul"
            >
              <X className="w-4 h-4" />
              <span>Închide</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Tabs for Guide vs Printable Cards */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 print:hidden">
            <button
              onClick={() => setPrintMode('guide')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                printMode === 'guide'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📋 Ghidul de Construcție
            </button>
            <button
              onClick={() => setPrintMode('cards-front')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                printMode === 'cards-front'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🎴 Fața Cartonașelor
            </button>
            <button
              onClick={() => setPrintMode('cards-back')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                printMode === 'cards-back'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🌪️ Verso („Vântul”)
            </button>
          </div>

        {/* MODE 1: DIY Crafting Guide */}
        {printMode === 'guide' && (
          <div className="space-y-6">
            {/* Materials List */}
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
              <h3 className="text-base font-extrabold text-amber-950 flex items-center gap-2 mb-2">
                <span>📦</span> Materiale Necesare:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span> Carton subțire sau hârtie groasă
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span> Foarfecă cu vârf rotunjit pentru copii
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span> Markere colorate sau imagini tipărite
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span> Riglă (pentru cartonașe de dimensiuni egale)
                </div>
                <div className="flex items-center gap-2 sm:col-span-2 text-amber-900">
                  <span className="text-amber-600 font-bold">✓</span> Opțional: Folie de plastifiat sau bandă adezivă transparentă (pentru rezistență)
                </div>
              </div>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-rose-500" />
                <span>Pașii de Construcție ai Jocului Fizic:</span>
              </h3>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    Alegeți perechile animal-habitat („amestecate de vânt”)
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Începeți cu 6-8 perechi (12-16 cartonașe). De exemplu: Urs polar — Banchiză, Cămilă — Deșert, Pinguin — Antarctica, Maimuță — Pădure tropicală, Albină — Stup.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    Desenați sau lipiți imaginile
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Pe jumătate din cartonașe desenați animalul, pe cealaltă jumătate habitatul corespunzător. Păstrați dimensiunea cartonașelor identică (ex. 7x7 cm).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    Întăriți cartonașele
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Dacă aveți aparat de plastifiat, treceți cartonașele prin el. Altfel, lipiți-le pe carton mai gros și acoperiți-le cu bandă lată transparentă.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    Verso identic — „Vântul care le-a amestecat”
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Pe spatele tuturor cartonașelor desenați sau lipiți același model (un mic vârtej de vânt sau o stea) — astfel încât să nu se poată ghici dinainte!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: Cards Front Preview / Printable Grid */}
        {printMode === 'cards-front' && (
          <div>
            <p className="text-xs text-slate-500 mb-3 print:hidden">
              Tipărește această pagină pentru a decupa cele 16 cartonașe (8 perechi Animal + Căsuță):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ANIMALS_DATA.flatMap(a => [
                // Animal card
                <div
                  key={`animal-${a.id}`}
                  className="p-3 bg-white rounded-xl border-2 border-dashed border-slate-400 flex flex-col items-center justify-between text-center min-h-[120px]"
                  style={{ backgroundColor: a.bgColor }}
                >
                  <span className="text-[10px] font-bold text-rose-700 uppercase">🐾 Animal</span>
                  <span className="text-4xl my-1">{a.emoji}</span>
                  <span className="text-xs font-black text-slate-900 leading-tight">{a.animalName}</span>
                </div>,
                // Habitat card
                <div
                  key={`habitat-${a.id}`}
                  className="p-3 bg-white rounded-xl border-2 border-dashed border-slate-400 flex flex-col items-center justify-between text-center min-h-[120px]"
                  style={{ backgroundColor: a.bgColor }}
                >
                  <span className="text-[10px] font-bold text-sky-700 uppercase">🏠 Habitat</span>
                  <span className="text-4xl my-1">{a.habitatEmoji}</span>
                  <span className="text-xs font-black text-slate-900 leading-tight">{a.habitatName}</span>
                </div>,
              ])}
            </div>
          </div>
        )}

        {/* MODE 3: Cards Back Preview / Printable Grid */}
        {printMode === 'cards-back' && (
          <div>
            <p className="text-xs text-slate-500 mb-3 print:hidden">
              Tipărește această pagină pe verso sau lipește-o pe spatele cartonașelor decupate:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 16 }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-center min-h-[120px] bg-gradient-to-br from-amber-100 to-amber-200"
                >
                  <span className="text-2xl animate-wobble">🌪️</span>
                  <span className="text-xs font-black text-amber-900 mt-1 uppercase tracking-wide">
                    Vântul
                  </span>
                  <span className="text-[10px] text-amber-700 font-bold">✨ Amestecător ✨</span>
                </div>
              ))}
            </div>
          </div>
        )}

        </div>

        {/* Sticky Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Apasă <strong>Escape</strong> sau butonul din dreapta pentru a închide
          </span>
          <button
            id="close-craft-footer-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md active:scale-95 ml-auto"
          >
            Închide Atelierul ✨
          </button>
        </div>
      </div>
    </div>
  );
};
