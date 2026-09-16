import { STORY_SLIDES, ANIMALS_DATA } from '../data/animalsData';
import { soundManager } from './soundEffects';

let prefetchStarted = false;

/**
 * Pre-warms and preloads Romanian natural audio in the background.
 * Once preloaded, clicking any listening icon plays INSTANTLY with zero delay time.
 */
export function initializeAudioPreloader(): void {
  if (prefetchStarted || typeof window === 'undefined') return;
  prefetchStarted = true;

  // Compile prioritized list of audio texts
  const highPriorityTexts: string[] = [];
  const standardPriorityTexts: string[] = [];

  // 1. High priority: First 2 story slides + initial game instruction
  if (STORY_SLIDES.length > 0) {
    highPriorityTexts.push(`${STORY_SLIDES[0].title}. ${STORY_SLIDES[0].subtitle}. ${STORY_SLIDES[0].text}`);
  }
  if (STORY_SLIDES.length > 1) {
    highPriorityTexts.push(`${STORY_SLIDES[1].title}. ${STORY_SLIDES[1].subtitle}. ${STORY_SLIDES[1].text}`);
  }
  highPriorityTexts.push('Vântul a amestecat toate casele animalelor! Tu ești Ana și trebuie să le pui la loc!');

  // 2. Remaining story slides
  for (let i = 2; i < STORY_SLIDES.length; i++) {
    const s = STORY_SLIDES[i];
    standardPriorityTexts.push(`${s.title}. ${s.subtitle}. ${s.text}`);
  }

  // 3. Animal match celebrations & adaptations
  ANIMALS_DATA.forEach(animal => {
    standardPriorityTexts.push(`Felicitări! Ai salvat ${animal.name}! ${animal.adaptationWhy}`);
    standardPriorityTexts.push(`Bravo! ${animal.name} s-a întors acasă, în ${animal.habitatName}! ${animal.adaptationWhy}`);
  });

  // Start preloading high priority after a short delay
  setTimeout(() => {
    soundManager.preloadBatch(highPriorityTexts).then(() => {
      // Then preload standard priority texts sequentially
      soundManager.preloadBatch(standardPriorityTexts);
    });
  }, 300);
}
