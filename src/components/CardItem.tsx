import React from 'react';
import { MemoryCard } from '../types';
import { Sparkles, Check, Home, Utensils, Heart } from 'lucide-react';

interface CardItemProps {
  card: MemoryCard;
  onClick: () => void;
  disabled?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onClick, disabled }) => {
  const isRevealed = card.isFlipped || card.isMatched;

  const getTypeBadge = () => {
    switch (card.type) {
      case 'animal':
        return {
          label: 'Animal',
          icon: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />,
          bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'habitat':
        return {
          label: 'Casa / Habitat',
          icon: <Home className="w-3.5 h-3.5 text-sky-500 fill-sky-400" />,
          bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'food':
        return {
          label: 'Hrana Bună',
          icon: <Utensils className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />,
          bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
        };
    }
  };

  const badge = getTypeBadge();

  return (
    <div
      id={`card-${card.uniqueId}`}
      onClick={() => {
        if (!disabled && !isRevealed) {
          onClick();
        }
      }}
      className={`relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-2xl cursor-pointer perspective-1000 transition-all duration-300 transform select-none ${
        disabled ? 'pointer-events-none' : 'hover:scale-[1.03] active:scale-[0.97]'
      }`}
    >
      <div
        className={`w-full h-full relative transform-style-3d transition-transform duration-500 rounded-2xl shadow-md hover:shadow-xl ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* BACK FACE (Vântul amestecător) */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl p-2.5 flex flex-col items-center justify-between border-4 border-amber-200 shadow-inner overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 50% 30%, #fef3c7 0%, #fed7aa 60%, #fdba74 100%)',
          }}
        >
          {/* Swirling playful wind pattern */}
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/30 blur-sm pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-amber-400/20 blur-sm pointer-events-none" />

          {/* Top small header */}
          <div className="flex items-center justify-between w-full px-1 z-10">
            <span className="text-xs font-bold text-amber-900/60 tracking-wider uppercase flex items-center gap-1">
              <span>🌪️</span> Vântul
            </span>
            <span className="text-amber-500 text-xs">✨</span>
          </div>

          {/* Central friendly wind swirl mascot */}
          <div className="flex flex-col items-center justify-center my-auto z-10">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/60 flex items-center justify-center shadow-md border-2 border-white/80 animate-wobble">
              {/* Cute smiling breeze SVG */}
              <svg
                viewBox="0 0 100 100"
                className="w-12 h-12 sm:w-14 sm:h-14 text-sky-600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Wind swirl paths */}
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
                {/* Friendly eyes */}
                <circle cx="42" cy="46" r="3.5" fill="#0f172a" />
                <circle cx="58" cy="46" r="3.5" fill="#0f172a" />
                {/* Cheeks */}
                <circle cx="36" cy="50" r="3" fill="#f43f5e" opacity="0.5" />
                <circle cx="64" cy="50" r="3" fill="#f43f5e" opacity="0.5" />
                {/* Smile */}
                <path
                  d="M47 52C48.5 55 51.5 55 53 52"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-extrabold text-amber-900 mt-2 bg-white/70 px-2.5 py-0.5 rounded-full shadow-xs">
              Atinge-mă!
            </span>
          </div>

          {/* Bottom decorative stars */}
          <div className="flex items-center justify-center gap-1 text-xs text-amber-700/60 z-10">
            <span>⭐</span>
            <span>🌬️</span>
            <span>⭐</span>
          </div>
        </div>

        {/* FRONT FACE (Revealed card: Animal or Habitat or Food) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between border-4 shadow-lg transition-colors ${
            card.isMatched
              ? 'border-emerald-400 ring-4 ring-emerald-200/70 bg-gradient-to-b from-white to-emerald-50'
              : 'border-white bg-gradient-to-b from-white to-slate-50'
          }`}
          style={{
            backgroundColor: card.bgColor,
          }}
        >
          {/* Card Top: Type badge & Status */}
          <div className="flex items-center justify-between w-full">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border shadow-xs ${badge.bgColor}`}
            >
              {badge.icon}
              <span>{badge.label}</span>
            </span>

            {card.isMatched && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white shadow-sm animate-bounce">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Big Emoji Illustration */}
          <div className="flex flex-col items-center justify-center my-auto py-1">
            <div
              className={`text-4xl sm:text-5xl md:text-6xl drop-shadow-md transition-transform ${
                card.isMatched ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              {card.emoji}
            </div>
          </div>

          {/* Card Bottom: Title & Subtitle */}
          <div className="text-center w-full bg-white/90 backdrop-blur-xs rounded-xl py-1.5 px-1 border border-black/5 shadow-xs">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-tight truncate">
              {card.title}
            </h4>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 leading-tight truncate mt-0.5">
              {card.subtitle}
            </p>
          </div>

          {/* Matched Banner Sparkle */}
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
