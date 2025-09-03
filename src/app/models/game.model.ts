export interface Question {
  id: number;
  emojis: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  artist?: string; // For songs
}

export interface GameState {
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  score: number;
  coins: number;
  usedHints: number;
  timeStarted: Date;
  category: GameCategory;
  questions: Question[];
  gameStatus: 'playing' | 'finished' | 'paused';
}

export interface Score {
  score: number;
  category: GameCategory;
  date: Date;
  timeSpent: number;
  questionsAnswered: number;
}

export type GameCategory = 'movies' | 'series' | 'songs';

export interface GameConfig {
  startingCoins: number;
  hintsPerQuestion: number;
  scorePerQuestion: {
    easy: number;
    medium: number;
    hard: number;
  };
  hintCost: number;
  showAnswerCost: number;
  correctAnswerReward: number;
}
