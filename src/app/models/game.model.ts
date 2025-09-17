export interface Question {
  id: number;
  emojis: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: {
    easy: string;    // 10 coins - general clue
    medium: string;  // 20 coins - specific clue  
    hard: string;    // 30 coins - strong clue
  };
  artist?: string; // For songs
}

export interface GameState {
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  score: number;
  coins: number;
  correctAnswers: number;
  usedHints: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
  timeStarted: Date;
  category: GameCategory;
  questions: Question[];
  gameStatus: 'playing' | 'finished' | 'paused';
  username?: string;
}

export interface Score {
  score: number;
  username: string;
  category: GameCategory;
  date: Date;
  timeSpent: number;
  questionsAnswered: number;
  totalQuestions: number;
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
  hintCost: {
    easy: number;    // 10 coins
    medium: number;  // 20 coins
    hard: number;    // 30 coins
  };
  showAnswerCost: number;
  correctAnswerReward: number;
}
