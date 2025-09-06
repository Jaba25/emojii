import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState, Question, Score, GameCategory, GameConfig } from '../models/game.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  private gameConfig: GameConfig = {
    startingCoins: 100,
    hintsPerQuestion: 3,
    scorePerQuestion: {
      easy: 10,
      medium: 20,
      hard: 30
    },
    hintCost: {
      easy: 10,
      medium: 20,
      hard: 30
    },
    showAnswerCost: 50,
    correctAnswerReward: 30
  };

  private gameStateSubject = new BehaviorSubject<GameState>({
    currentQuestion: null,
    currentQuestionIndex: 0,
    score: 0,
    coins: this.gameConfig.startingCoins,
    usedHints: { easy: false, medium: false, hard: false },
    timeStarted: new Date(),
    category: 'movies',
    questions: [],
    gameStatus: 'playing'
  });

  public gameState$ = this.gameStateSubject.asObservable();

  constructor(private dataService: DataService) { }

  startGame(category: GameCategory): void {
    this.dataService.getQuestions(category).subscribe(data => {
      const questions = this.dataService.shuffleArray(data[category] || []);
      
      const newGameState: GameState = {
        currentQuestion: questions[0] || null,
        currentQuestionIndex: 0,
        score: 0,
        coins: this.gameConfig.startingCoins,
        usedHints: { easy: false, medium: false, hard: false },
        timeStarted: new Date(),
        category,
        questions,
        gameStatus: 'playing'
      };
      
      this.gameStateSubject.next(newGameState);
    });
  }

  submitAnswer(answer: string): boolean {
    const currentState = this.gameStateSubject.value;
    
    if (!currentState.currentQuestion || currentState.gameStatus !== 'playing') {
      return false;
    }

    const isCorrect = this.validateAnswer(answer, currentState.currentQuestion.answer);
    
    if (isCorrect) {
      this.handleCorrectAnswer();
      return true;
    } else {
      this.handleIncorrectAnswer();
      return false;
    }
  }

  private validateAnswer(userAnswer: string, correctAnswer: string): boolean {
    const normalizeString = (str: string) => 
      str.toLowerCase()
         .trim()
         .replace(/[^\w\s]/g, '')
         .replace(/\s+/g, ' ');
    
    return normalizeString(userAnswer) === normalizeString(correctAnswer);
  }

  private handleCorrectAnswer(): void {
    const currentState = this.gameStateSubject.value;
    const baseScore = this.gameConfig.scorePerQuestion[currentState.currentQuestion!.difficulty];
    const finalScore = Math.max(baseScore, 1);
    const coinReward = this.gameConfig.correctAnswerReward;

    this.moveToNextQuestion(currentState.score + finalScore, currentState.coins + coinReward);
  }

  private handleIncorrectAnswer(): void {
    // Stay on the same question when answer is incorrect
    // Don't move to next question, just reset hints for this question
    const currentState = this.gameStateSubject.value;
    
    const updatedState: GameState = {
      ...currentState,
      usedHints: { easy: false, medium: false, hard: false } // Reset hints for retry
    };
    
    this.updateGameState(updatedState);
  }

  private moveToNextQuestion(newScore: number, newCoins: number): void {
    const currentState = this.gameStateSubject.value;
    const nextIndex = currentState.currentQuestionIndex + 1;
    
    if (nextIndex >= currentState.questions.length) {
      this.endGame(newScore);
    } else {
      const updatedState: GameState = {
        ...currentState,
        currentQuestion: currentState.questions[nextIndex],
        currentQuestionIndex: nextIndex,
        score: newScore,
        coins: newCoins,
        usedHints: { easy: false, medium: false, hard: false } // Reset hints for new question
      };
      
      this.updateGameState(updatedState);
    }
  }

  useHint(level: 'easy' | 'medium' | 'hard'): string | null {
    const currentState = this.gameStateSubject.value;
    
    if (!currentState.currentQuestion || 
        currentState.gameStatus !== 'playing' ||
        currentState.usedHints[level] ||
        currentState.coins < this.gameConfig.hintCost[level]) {
      return null;
    }

    const hint = currentState.currentQuestion.hints[level];
    const updatedState = { 
      ...currentState, 
      usedHints: {
        ...currentState.usedHints,
        [level]: true
      },
      coins: currentState.coins - this.gameConfig.hintCost[level]
    };
    
    this.updateGameState(updatedState);
    return hint;
  }

  showAnswer(): string | null {
    const currentState = this.gameStateSubject.value;
    
    if (!currentState.currentQuestion || 
        currentState.gameStatus !== 'playing' ||
        currentState.coins < this.gameConfig.showAnswerCost) {
      return null;
    }

    const answer = currentState.currentQuestion.answer;
    const updatedState = { 
      ...currentState, 
      coins: currentState.coins - this.gameConfig.showAnswerCost
    };
    
    this.updateGameState(updatedState);
    
    // Don't move to next question automatically
    // Let user control when to move to next question
    
    return answer;
  }

  // New method to manually move to next question
  moveToNextQuestionManually(): void {
    const currentState = this.gameStateSubject.value;
    this.moveToNextQuestion(currentState.score, currentState.coins);
  }

  private endGame(finalScore?: number): void {
    const currentState = this.gameStateSubject.value;
    const score = finalScore ?? currentState.score;
    
    const updatedState: GameState = {
      ...currentState,
      score,
      gameStatus: 'finished'
    };
    
    this.updateGameState(updatedState);
    this.saveScore(score, currentState.category, currentState.currentQuestionIndex);
  }

  private updateGameState(newState: GameState): void {
    this.gameStateSubject.next(newState);
  }

  private saveScore(score: number, category: GameCategory, questionsAnswered: number): void {
    const currentState = this.gameStateSubject.value;
    const timeSpent = Date.now() - currentState.timeStarted.getTime();
    
    const newScore: Score = {
      score,
      category,
      date: new Date(),
      timeSpent,
      questionsAnswered
    };

    const scores = this.getStoredScores();
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores per category
    const categoryScores = scores.filter(s => s.category === category).slice(0, 10);
    const otherScores = scores.filter(s => s.category !== category);
    const finalScores = [...categoryScores, ...otherScores];
    
    localStorage.setItem('emoji-game-scores', JSON.stringify(finalScores));
  }

  getHighScores(category?: GameCategory): Score[] {
    const scores = this.getStoredScores();
    
    if (category) {
      return scores.filter(score => score.category === category);
    }
    
    return scores;
  }

  private getStoredScores(): Score[] {
    const stored = localStorage.getItem('emoji-game-scores');
    if (!stored) return [];
    
    try {
      return JSON.parse(stored).map((score: any) => ({
        ...score,
        date: new Date(score.date)
      }));
    } catch {
      return [];
    }
  }

  resetGame(): void {
    const currentState = this.gameStateSubject.value;
    const resetState: GameState = {
      currentQuestion: null,
      currentQuestionIndex: 0,
      score: 0,
      coins: this.gameConfig.startingCoins,
      usedHints: { easy: false, medium: false, hard: false },
      timeStarted: new Date(),
      category: currentState.category,
      questions: [],
      gameStatus: 'playing'
    };
    
    this.gameStateSubject.next(resetState);
  }

  getCurrentGameState(): GameState {
    return this.gameStateSubject.value;
  }
}
