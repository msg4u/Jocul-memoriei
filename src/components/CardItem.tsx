import React from 'react';
import { MemoryCard } from '../types';
import { Sparkles, Check, Home, Utensils, Heart } from 'lucide-react';

interface CardItemProps {
  card: MemoryCard;
  onClick: () => void;
  disabled?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onClick, disabled }) => {
  // Guaranteed revealed state: card stays face-up whenever matched or during current turn flip
  const isRevealed = Boolean(card.isMatched || card.isFlipped);

  const getTypeBadge = () => {
    switch (card.type) {
      case 'animal':
        return {
          label: 'Animal',
          icon: <Heart className="w-3 h-3 text-rose-500 fill-rose-400" />,
          bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'habitat':
        return {
          label: 'Casa / Habitat',
          icon: <Home className="w-3 h-3 text-sky-500 fill-sky-400" />,
          bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'food':
        return {
          label: 'Hrana Bună',
          icon: <Utensils className="w-3 h-3 text-amber-500 fill-amber-400" />,
          bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
        };
    }
  };

  const badge = getTypeBadge();

  return (
    <div
      id={`card-${card.uniqueId}`}
      onClick={() => {
        if (!disabled && !isRevealed && !card.isMatched) {
          onClick();
        }
      }}
      className={`relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-2xl select-none perspective-1000 transition-all duration-300 ${
        card.isMatched
          ? 'cursor-default'
          : disabled
          ? 'pointer-events-none'
          : 'cursor-pointer hover:scale-[1.03] active:scale-[0.97]'
      }`}
    >
      <div
        className={`w-full h-full relative transition-transform duration-500 rounded-2xl shadow-md ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
        }}
      >
        {/* ========================================================================= */}
        {/* BACK FACE (Vântul amestecător)                                           */}
        {/* Strictly hidden when card is revealed so "Vântul" NEVER bleeds in reverse */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-between border-4 border-amber-300 shadow-inner select-none transition-opacity duration-200 ${
            isRevealed ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: '#fed7aa',
            background: 'radial-gradient(circle at 50% 30%, #fef3c7 0%, #fed7aa 60%, #fdba74 100%)',
            transform: 'rotateY(0deg)',
          }}
        >
          {/* Top small header */}
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-[11px] font-black text-amber-900/70 tracking-wider uppercase flex items-center gap-1">
              <span>🌪️</span> Vântul
            </span>
            <span className="text-amber-500 text-xs">✨</span>
          </div>

          {/* Central friendly wind swirl mascot */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/70 flex items-center justify-center shadow-md border-2 border-white animate-wobble">
              {/* Cute smiling breeze SVG */}
              <svg
                viewBox="0 0 100 100"
                className="w-10 h-10 sm:w-12 sm:h-12 text-sky-600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 40C20 40 45 40 55 40C65 40 75 32 72 22C69 12 55 12 52 22"
                  stroke="#0284c7"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M15 55C15 55 50 55 65 55C75 55 85 62 82 72C79 82 68 82 65 72"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M25 70C25 70 42 70 48 70C54 70 60 74 58 78"
                  stroke="#7dd3fc"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="42" cy="46" r="3.5" fill="#0f172a" />
                <circle cx="58" cy="46" r="3.5" fill="#0f172a" />
                <circle cx="36" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                <circle cx="64" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
                <path
                  d="M47 52C48.5 55 51.5 55 53 52"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[10px] sm:text-xs font-black text-amber-900 mt-1.5 bg-white/85 px-2.5 py-0.5 rounded-full shadow-xs">
              Atinge-mă!
            </span>
          </div>

          {/* Bottom decorative stars */}
          <div className="flex items-center justify-center gap-1 text-[11px] text-amber-700/70">
            <span>⭐</span>
            <span>🌬️</span>
            <span>⭐</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FRONT FACE (Revealed card: Animal or Habitat or Food)                     */}
        {/* Solid opaque white card: remains face-up permanently once matched         */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between shadow-lg select-none transition-opacity duration-200 ${
            !isRevealed ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
          } ${
            card.isMatched
              ? 'border-4 border-emerald-500 ring-4 ring-emerald-200 bg-white'
              : 'border-4 border-white bg-white'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: '#ffffff',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Card Top: Type badge & Match Indicator */}
          <div className="flex items-center justify-between w-full">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black border shadow-xs ${badge.bgColor}`}
            >
              {badge.icon}
              <span>{badge.label}</span>
            </span>

            {card.isMatched && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-xs animate-bounce">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Salvat!</span>
              </span>
            )}
          </div>

          {/* Big Emoji Illustration (completely opaque) */}
          <div className="flex flex-col items-center justify-center my-auto py-1">
            <div
              className={`text-4xl sm:text-5xl md:text-6xl drop-shadow-sm transition-transform ${
                card.isMatched ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              {card.emoji}
            </div>
          </div>

          {/* Card Bottom: Title & Subtitle on solid background */}
          <div
            className={`text-center w-full rounded-xl py-1.5 px-1 border shadow-xs ${
              card.isMatched
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <h4 className="text-xs sm:text-sm font-black leading-tight truncate">
              {card.title}
            </h4>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 leading-tight truncate mt-0.5">
              {card.subtitle}
            </p>
          </div>

          {/* Matched Corner Sparkle */}
          {card.isMatched && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
