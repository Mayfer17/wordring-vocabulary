export type CardStatus = 'new' | 'learning' | 'mastered';

export interface Flashcard {
  id: string;
  thai: string;
  phonetic: string;
  ipa?: string;
  english: string;
  partOfSpeech: string;
  exampleThai: string;
  exampleEnglish: string;
  mnemonic?: string;
  tone?: 'Mid' | 'Low' | 'Falling' | 'High' | 'Rising' | 'Mixed' | string;
  status: CardStatus;
  isFavorite?: boolean;
  reviewCount: number;
  lastReviewed?: number;
  createdAt?: number;
  deckId?: string;
  deckTitle?: string;
}

export interface Deck {
  id: string;
  title: string;
  titleThai?: string;
  description: string;
  color: 'blue' | 'pink' | 'sand' | 'lavender' | 'sage';
  category?: string;
  cards: Flashcard[];
  createdAt: number;
  lastStudied?: number;
}

export type StudyMode = 'ring' | 'quiz' | 'cards-list';

export type AppView =
  | 'login'
  | 'home'
  | 'decks'
  | 'deck-detail'
  | 'flashcards'
  | 'quiz'
  | 'history'
  | 'create-folder';

export interface UserProfile {
  name: string;
  email: string;
  isGuest: boolean;
}
