import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

export interface GameState {
  score: number;
  currentQuestionIndex: number;
  questions: any[];
  timeStarted: Date;
  coins: number;
  category: string;
}

export interface GameResult {
  movieTitle: string;
  userGuess: string;
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
}

export interface GameResults {
  results: GameResult[];
  totalScore: number;
  totalTime: number;
  correctAnswers: number;
  hintsUsed: number;
}

export interface HighScore {
  playerName: string;
  score: number;
  correctAnswers: number;
  timeSpent: number;
  category: string;
  date: Date;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResultComponent implements OnInit {
  @Input() gameResults: GameResults | null = null;
  @Input() gameState: GameState | null = null;
  @Input() totalScore: number = 0;
  @Input() totalTime: number = 0;
  
  totalCorrectAnswers: number = 0;
  userLeaderboardPosition: number = 0;
  accuracy: number = 0;
  averageTimePerMovie: number = 0;
  showScores: boolean = false;
  selectedCategory: string = 'all';
  highScores: HighScore[] = [];

  ngOnInit(): void {
    this.calculateCorrectAnswers();
    this.calculateStats();
    this.calculateLeaderboardPosition();
    this.loadHighScores();
  }

  calculateCorrectAnswers(): void {
    this.totalCorrectAnswers = this.gameResults?.correctAnswers || 0;
    
    if (this.gameResults?.results) {
      this.totalCorrectAnswers = this.gameResults.results.filter(result => result.isCorrect).length;
    }
  }

  calculateLeaderboardPosition(): void {
    const totalPlayers = 1000;
    const scorePercentile = Math.min(this.totalCorrectAnswers / 50, 1);
    this.userLeaderboardPosition = Math.max(1, Math.floor(totalPlayers * (1 - scorePercentile)));
  }

  calculateStats(): void {
    if (this.gameResults?.results) {
      const totalMovies = this.gameResults.results.length;
      this.accuracy = totalMovies > 0 ? Math.round((this.totalCorrectAnswers / totalMovies) * 100) : 0;
      this.averageTimePerMovie = totalMovies > 0 ? Math.round(this.totalTime / totalMovies) : 0;
    }
  }

  formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? \\m \s\ : \\s\;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('ka-GE');
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'movies': return '??';
      case 'series': return '??';
      case 'songs': return '??';
      default: return '??';
    }
  }

  getCategoryTitle(category: string): string {
    switch (category) {
      case 'movies': return '???????';
      case 'series': return '?????????';
      case 'songs': return '?????????';
      default: return '?????';
    }
  }

  playAgain(): void {
    window.location.reload();
  }

  changeCategory(): void {
    // Navigate to category selection
    console.log('Change category');
  }

  loadHighScores(): void {
    // Mock high scores data for Georgian emoji movie game
    this.highScores = [
      {
        playerName: '??????? ????? ????????',
        score: 2500,
        correctAnswers: 48,
        timeSpent: 900000,
        category: 'movies',
        date: new Date()
      },
      {
        playerName: '???????? ?????????',
        score: 2200,
        correctAnswers: 42,
        timeSpent: 1200000,
        category: 'movies',
        date: new Date()
      },
      {
        playerName: '????? ??????????',
        score: 2000,
        correctAnswers: 38,
        timeSpent: 1500000,
        category: 'movies',
        date: new Date()
      }
    ];
  }

  onCategoryChange(): void {
    this.loadHighScores();
  }

  goToMenu(): void {
    window.location.href = '/';
  }

  shareResults(): void {
    const message = \?? Georgian Emoji Movie Game Results!
? Correct: \/50
?? Accuracy: \%
?? Time: \ minutes
?? Rank: #\

Play the amazing Georgian movie guessing game!\;
    
    if (navigator.share) {
      navigator.share({
        title: 'Georgian Emoji Movie Game Results',
        text: message
      });
    } else {
      navigator.clipboard.writeText(message);
      alert('Results copied to clipboard! ??');
    }
  }

  getPerformanceMessage(): string {
    const accuracy = this.accuracy;
    
    if (accuracy >= 90) {
      return '?? Georgian Movie Expert! ??????? ????? ????????!';
    } else if (accuracy >= 80) {
      return '?? Movie Enthusiast! ????? ?????????!';
    } else if (accuracy >= 70) {
      return '?? Good Knowledge! ????? ?????!';
    } else if (accuracy >= 60) {
      return '?? Keep Learning! ???????? ??????!';
    } else {
      return '?? Room for Improvement! ????????????? ???????!';
    }
  }
}
