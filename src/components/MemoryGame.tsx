import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AnimalPair, GameDifficulty, GameMode, MemoryCard } from '../types';
import { ANIMALS_DATA } from '../data/animalsData';
import { CardItem } from './CardItem';
import { MatchCelebrationModal } from './MatchCelebrationModal';
import { soundManager } from '../utils/soundEffects';
import {
  Sparkles,
  RotateCcw,
  Wind,
  Trophy,
  Users,
  User,
  Lightbulb,
  HelpCircle,
  Clock,
  CheckCircle2,
  Smile,
  Volume2,
} from 'lucide-react';

interface MemoryGameProps {
  onStoryClick: () => void;
  onAnimalSavedChange?: (count: number, total: number) => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  onStoryClick,
  onAnimalSavedChange,
}) => {
  // Game Configuration State
  const [difficulty, setDifficulty] = useState<GameDifficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('solo');

  // Game Board State
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [recentMatchedPair, setRecentMatchedPair] = useState<AnimalPair | null>(null);

  // Stats & Turns
  const [movesCount, setMovesCount] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);

  // Status flags
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isBreezeBlowing, setIsBreezeBlowing] = useState<boolean>(false);
  const [hintActive, setHintActive] = useState<boolean>(false);

  // Determine active animal pool based on difficulty
  const getActiveAnimals = useCallback(() => {
    switch (difficulty) {
      case 'easy':
        // 4 pairs for ages 4-5
        return ANIMALS_DATA.slice(0, 4);
      case 'medium':
        // 8 pairs for ages 5-6
        return ANIMALS_DATA.slice(0, 8);
      case 'triple':
        // 6 trios (Animal + Habitat + Food) for ages 6-7
        return ANIMALS_DATA.slice(0, 6);
    }
  }, [difficulty]);

  // Generate shuffled cards
  const initializeGame = useCallback(() => {
    const activeAnimals = getActiveAnimals();
    let generatedCards: MemoryCard[] = [];

    activeAnimals.forEach(animal => {
      // 1. Animal card
      generatedCards.push({
        uniqueId: `${animal.id}-animal`,
        pairId: animal.id,
        type: 'animal',
        title: animal.animalName,
        subtitle: 'Animal',
        emoji: animal.emoji,
        accentColor: animal.accentColor,
        bgColor: animal.bgColor,
        isFlipped: false,
        isMatched: false,
      });

      // 2. Habitat card
      generatedCards.push({
        uniqueId: `${animal.id}-habitat`,
        pairId: animal.id,
        type: 'habitat',
        title: animal.habitatName,
        subtitle: 'Casa adevărată',
        emoji: animal.habitatEmoji,
        accentColor: animal.accentColor,
        bgColor: animal.bgColor,
        isFlipped: false,
        isMatched: false,
      });

      // 3. Food card (if triple mode)
      if (difficulty === 'triple') {
        generatedCards.push({
          uniqueId: `${animal.id}-food`,
          pairId: animal.id,
          type: 'food',
          title: animal.foodName,
          subtitle: 'Hrana preferată',
          emoji: animal.foodEmoji,
          accentColor: animal.accentColor,
          bgColor: animal.bgColor,
          isFlipped: false,
          isMatched: false,
        });
      }
    });

    // Fisher-Yates Shuffle
    for (let i = generatedCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [generatedCards[i], generatedCards[j]] = [generatedCards[j], generatedCards[i]];
    }

    setCards(generatedCards);
    setFlippedIds([]);
    setMatchedPairIds([]);
    setIsEvaluating(false);
    setRecentMatchedPair(null);
    setMovesCount(0);
    setCurrentPlayer(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setIsGameWon(false);

    if (onAnimalSavedChange) {
      onAnimalSavedChange(0, activeAnimals.length);
    }
  }, [getActiveAnimals, difficulty, onAnimalSavedChange]);

  // Initialize on mount or difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Update navbar counter when matched pairs change
  useEffect(() => {
    const activeAnimals = getActiveAnimals();
    if (onAnimalSavedChange) {
      onAnimalSavedChange(matchedPairIds.length, activeAnimals.length);
    }
    if (matchedPairIds.length > 0 && matchedPairIds.length === activeAnimals.length) {
      // Victory!
      setIsGameWon(true);
      soundManager.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#34d399', '#a855f7'],
      });
    }
  }, [matchedPairIds, getActiveAnimals, onAnimalSavedChange]);

  // Card click handler
  const handleCardClick = (uniqueId: string) => {
    if (isEvaluating) return;

    const clickedCard = cards.find(c => c.uniqueId === uniqueId);
    if (!clickedCard || clickedCard.isMatched || clickedCard.isFlipped) return;

    soundManager.playCardFlip();

    const targetFlipCount = difficulty === 'triple' ? 3 : 2;
    const nextFlippedIds = [...flippedIds, uniqueId];

    // Flip the clicked card immediately in state
    setCards(prev =>
      prev.map(c => (c.uniqueId === uniqueId ? { ...c, isFlipped: true } : c))
    );
    setFlippedIds(nextFlippedIds);

    // If we haven't reached the evaluation threshold, wait for the next click
    if (nextFlippedIds.length < targetFlipCount) {
      return;
    }

    // Now evaluate!
    setIsEvaluating(true);
    setMovesCount(prev => prev + 1);

    const cardsToCompare = nextFlippedIds
      .map(id => cards.find(c => c.uniqueId === id) || (clickedCard.uniqueId === id ? clickedCard : null))
      .filter(Boolean) as MemoryCard[];

    const firstPairId = cardsToCompare[0]?.pairId;
    const isAllSamePair = cardsToCompare.every(c => c.pairId === firstPairId);

    // Also verify all card types are distinct (i.e. not 2 of the same animal or 2 homes)
    const cardTypes = new Set(cardsToCompare.map(c => c.type));
    const isDifferentTypes = cardTypes.size === targetFlipCount;

    const isSuccessMatch = isAllSamePair && isDifferentTypes;

    if (isSuccessMatch && firstPairId) {
      // MATCH FOUND!
      soundManager.playMatchSuccess();

      setTimeout(() => {
        setCards(prev =>
          prev.map(c =>
            nextFlippedIds.includes(c.uniqueId)
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          )
        );

        setMatchedPairIds(prev => [...prev, firstPairId]);

        // Give score to current player
        if (currentPlayer === 1) {
          setPlayer1Score(s => s + 1);
        } else {
          setPlayer2Score(s => s + 1);
        }

        // Find animal data and show congratulatory modal
        const animalInfo = ANIMALS_DATA.find(a => a.id === firstPairId);
        if (animalInfo) {
          setRecentMatchedPair(animalInfo);
        }

        setFlippedIds([]);
        setIsEvaluating(false);
        // Prompt rule: "Dacă formează o pereche corectă, le păstrează și mai joacă o dată!"
        // So current player continues their turn!
      }, 500);
    } else {
      // MISMATCH
      soundManager.playMismatch();

      setTimeout(() => {
        // Flip back only cards that were not matched
        setCards(prev =>
          prev.map(c =>
            nextFlippedIds.includes(c.uniqueId) && !c.isMatched
              ? { ...c, isFlipped: false }
              : c
          )
        );
        setFlippedIds([]);
        setIsEvaluating(false);

        // Prompt rule: "Dacă nu se potrivesc, le întoarce înapoi, și e rândul următorului jucător"
        if (gameMode === 'duo') {
          setCurrentPlayer(curr => (curr === 1 ? 2 : 1));
        }
      }, 1300);
    }
  };

  // Fun wind gust reshuffle button: "Suflă Vântul din Nou!"
  const handleWindShuffle = () => {
    soundManager.playWindGust();
    setIsBreezeBlowing(true);

    setTimeout(() => {
      initializeGame();
      setIsBreezeBlowing(false);
    }, 700);
  };

  // Hint function: Peek matching cards for 1.2s for younger kids
  const handleShowHint = () => {
    if (hintActive || isEvaluating) return;
    const unmatchedCards = cards.filter(c => !c.isMatched);
    if (unmatchedCards.length < 2) return;

    const firstPairId = unmatchedCards[0].pairId;
    const matchingIds = unmatchedCards
      .filter(c => c.pairId === firstPairId)
      .map(c => c.uniqueId);

    setHintActive(true);
    soundManager.playCardFlip();

    setCards(prev =>
      prev.map(c => (matchingIds.includes(c.uniqueId) ? { ...c, isFlipped: true } : c))
    );

    setTimeout(() => {
      setCards(prev =>
        prev.map(c =>
          matchingIds.includes(c.uniqueId) && !c.isMatched
            ? { ...c, isFlipped: false }
            : c
        )
      );
      setHintActive(false);
    }, 1400);
  };

  const activeAnimals = getActiveAnimals();
  const totalPairs = activeAnimals.length;

  // Compute grid layout classes
  const getGridColsClass = () => {
    if (difficulty === 'easy') {
      // 8 cards -> 4 cols on sm/md
      return 'grid-cols-2 sm:grid-cols-4 max-w-2xl';
    }
    if (difficulty === 'medium') {
      // 16 cards -> 4x4
      return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-4 max-w-4xl';
    }
    // triple: 18 cards -> 3x6 or 6x3
    return 'grid-cols-3 sm:grid-cols-6 max-w-5xl';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {/* Game Bar: Level selector & Mode Switcher */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-3 border-amber-200 mb-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Difficulty Picker */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Nivel de Vârstă:
            </span>

            <button
              id="diff-easy-btn"
              onClick={() => {
                setDifficulty('easy');
                soundManager.playCardFlip();
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                difficulty === 'easy'
                  ? 'bg-rose-500 text-white shadow-md scale-105'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              🐣 Începător (4-5 ani) · 4 Perechi
            </button>

            <button
              id="diff-med-btn"
              onClick={() => {
                setDifficulty('medium');
                soundManager.playCardFlip();
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                difficulty === 'medium'
                  ? 'bg-amber-500 text-white shadow-md scale-105'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              🦊 Explorator (5-6 ani) · 8 Perechi
            </button>

            <button
              id="diff-triple-btn"
              onClick={() => {
                setDifficulty('triple');
                soundManager.playCardFlip();
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                difficulty === 'triple'
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
              title="Animal + Casă + Hrana preferată"
            >
              ⭐ Triplu Memory (6-7 ani) · 3 Cărți!
            </button>
          </div>

          {/* Mode (Solo vs 2 Players) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              id="mode-solo-btn"
              onClick={() => {
                setGameMode('solo');
                initializeGame();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                gameMode === 'solo'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-sky-600" />
              <span>1 Jucător</span>
            </button>

            <button
              id="mode-duo-btn"
              onClick={() => {
                setGameMode('duo');
                initializeGame();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                gameMode === 'duo'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>2 Jucători</span>
            </button>
          </div>
        </div>

        {/* Dynamic Status / Turns Dashboard */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Turn indicator */}
          {gameMode === 'duo' ? (
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-2xl border-2 font-black text-xs flex items-center gap-2 transition-all ${
                  currentPlayer === 1
                    ? 'bg-sky-100 border-sky-400 text-sky-950 scale-105 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'
                }`}
              >
                <span>👧 Jucător 1 (Ana):</span>
                <span className="bg-sky-500 text-white px-2 py-0.5 rounded-full text-xs font-black">
                  {player1Score} salvate
                </span>
                {currentPlayer === 1 && <span className="animate-pulse">👈 Rândul tău!</span>}
              </div>

              <div
                className={`px-3 py-1.5 rounded-2xl border-2 font-black text-xs flex items-center gap-2 transition-all ${
                  currentPlayer === 2
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950 scale-105 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'
                }`}
              >
                <span>🧒 Jucător 2 (Prietenul):</span>
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-black">
                  {player2Score} salvate
                </span>
                {currentPlayer === 2 && <span className="animate-pulse">👈 Rândul tău!</span>}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-amber-50 text-amber-900 px-3.5 py-1.5 rounded-2xl border border-amber-200 text-xs font-black">
                <span>🎯 Încercări:</span>
                <span className="text-sm text-amber-600">{movesCount}</span>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3.5 py-1.5 rounded-2xl border border-emerald-200 text-xs font-black">
                <span>🏠 Animale acasă:</span>
                <span className="text-sm text-emerald-600 font-black">
                  {matchedPairIds.length} / {totalPairs}
                </span>
              </div>
            </div>
          )}

          {/* Action buttons: Wind Gust Shuffle & Hint */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              id="wind-shuffle-btn"
              onClick={handleWindShuffle}
              disabled={isBreezeBlowing || isEvaluating}
              className="px-3.5 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
              title="Suflă vântul și amestecă din nou cartonașele!"
            >
              <Wind className={`w-4 h-4 ${isBreezeBlowing ? 'animate-spin' : ''}`} />
              <span>Suflă Vântul! 🌪️</span>
            </button>

            <button
              id="hint-btn"
              onClick={handleShowHint}
              disabled={hintActive || isEvaluating}
              className="px-3 py-2 rounded-2xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
              title="Arată o potrivire pentru micuți"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Ajutor</span>
            </button>

            <button
              id="restart-game-btn"
              onClick={initializeGame}
              className="p-2 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all active:scale-95"
              title="Reia jocul de la capăt"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prompt reminder message */}
        <div className="mt-3 py-2 px-3.5 bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 rounded-2xl border border-amber-200 text-center flex items-center justify-between gap-2 shadow-xs">
          <p className="text-xs text-slate-700 font-bold flex-1 text-center sm:text-left">
            🌬️ „Vântul a amestecat toate casele animalelor! Tu ești Ana și trebuie să le pui la loc!”
            {difficulty === 'triple' && (
              <span className="text-purple-700 font-extrabold ml-1">
                (Găsește Animalul + Casa + Hrana sa!)
              </span>
            )}
          </p>
          <button
            id="listen-mission-prompt-btn"
            onClick={() =>
              soundManager.speak(
                'Vântul a amestecat toate casele animalelor! Tu ești Ana și trebuie să le pui la loc!'
              )
            }
            className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1 text-[11px] font-black transition-transform active:scale-95 shrink-0 shadow-xs"
            title="Ascultă misiunea în limba română"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ascultă</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex justify-center">
        <div
          className={`grid gap-2.5 sm:gap-4 w-full ${getGridColsClass()} ${
            isBreezeBlowing ? 'animate-wobble' : ''
          }`}
        >
          {cards.map(card => (
            <CardItem
              key={card.uniqueId}
              card={card}
              onClick={() => handleCardClick(card.uniqueId)}
              disabled={isEvaluating || card.isMatched || card.isFlipped}
            />
          ))}
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {isGameWon && (
        <div
          id="victory-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              initializeGame();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button
              id="close-victory-modal-x"
              onClick={initializeGame}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
              title="Închide și reia"
            >
              ✕
            </button>
            <div className="text-5xl sm:text-6xl mb-2 animate-bounce">🏆🎉</div>
            <span className="text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
              Misiune Îndeplinită cu Succes!
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Toate animalele sunt acasă!
            </h3>

            {gameMode === 'duo' ? (
              <div className="my-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <p className="text-sm font-extrabold text-emerald-950">
                  {player1Score > player2Score
                    ? '🎉 Jucătorul 1 (Ana) a salvat cele mai multe animale!'
                    : player2Score > player1Score
                    ? '🎉 Jucătorul 2 (Prietenul) a salvat cele mai multe animale!'
                    : '🤝 Egalitate perfectă! Ambii ați fost super-salvatori!'}
                </p>
                <div className="flex justify-center gap-4 text-xs font-bold text-slate-600 mt-2">
                  <span>Jucător 1: {player1Score} perechi</span>
                  <span>·</span>
                  <span>Jucător 2: {player2Score} perechi</span>
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-600 mt-2">
                Ai reușit în <strong>{movesCount} încercări</strong>! Ai readus fericirea și liniștea în lumea animalelor, exact ca isteata Ana!
              </p>
            )}

            {/* Scientific takeaway recap */}
            <div className="p-3.5 my-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium text-left flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2">
                <span className="text-xl shrink-0">💡</span>
                <div>
                  <strong>Lecția Anei:</strong> Fiecare animal are corpul construit perfect pentru casa lui — blană pentru ger, cocoașe pentru căldură, branhii pentru ocean!
                </div>
              </div>
              <button
                id="victory-speak-btn"
                onClick={() =>
                  soundManager.speak(
                    'Felicitări! Toate animalele sunt fericite și s-au întors acasă! Lecția Anei este că fiecare animal are corpul construit perfect pentru casa lui: blană pentru ger, cocoașe pentru căldură, și branhii pentru ocean!'
                  )
                }
                className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-xs transition-transform active:scale-95 shrink-0 flex items-center gap-1 font-black text-xs"
                title="Ascultă concluzia în limba română"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Ascultă</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                id="play-again-btn"
                onClick={initializeGame}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base rounded-2xl shadow-md active:scale-95 transition-all"
              >
                Mai Joacă o Dată! 🔄
              </button>
              <button
                id="view-story-btn"
                onClick={onStoryClick}
                className="py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-sm rounded-2xl border border-amber-300 transition-all active:scale-95"
              >
                Citește Povestea 📖
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Explanation Modal */}
      {recentMatchedPair && (
        <MatchCelebrationModal
          pair={recentMatchedPair}
          onClose={() => setRecentMatchedPair(null)}
          isTriple={difficulty === 'triple'}
        />
      )}
    </div>
  );
};
