export type GameDifficulty = 'easy' | 'medium' | 'triple';
// easy: 4 pairs (4-5 ani)
// medium: 8 pairs (5-6 ani)
// triple: 6 trios (Animal + Habitat + Hrană) (6-7 ani)

export type GameMode = 'solo' | 'duo';

export interface AnimalPair {
  id: string;
  name: string;
  emoji: string;
  animalName: string;
  animalDescription: string;
  habitatName: string;
  habitatDescription: string;
  habitatEmoji: string;
  foodName: string;
  foodDescription: string;
  foodEmoji: string;
  accentColor: string;
  bgColor: string;
  adaptationWhy: string;
  mixedUpProblem: string; // Ce a pățit când vântul l-a amestecat
  guideQuestion: string; // Întrebare pentru părinți/educatori
}

export type CardType = 'animal' | 'habitat' | 'food';

export interface MemoryCard {
  uniqueId: string;
  pairId: string;
  type: CardType;
  title: string;
  subtitle: string;
  emoji: string;
  accentColor: string;
  bgColor: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface PlayerStats {
  score: number;
  matches: string[]; // pairIds
}
