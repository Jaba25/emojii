import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Score, GameState, GameCategory } from '../../models/game.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResultComponent implements OnInit {
  
  gameState: GameState | null = null;
  highScores: Score[] = [];
  top30Scores: Score[] = [];
  showScores = false;
  selectedCategory: GameCategory = 'movies';
  Date = Date; // Add Date property for template access
  totalCorrectAnswers: number = 0;
  totalQuestions: number = 0;
  score: number = 0;
  totalTime: number = 0;
  userRank: number = 0;
  username: string = '';

  constructor(
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.showScores = params['showScores'] === 'true';
    });

    this.gameState = this.gameService.getCurrentGameState();
    if (this.gameState && !this.showScores) {
      this.selectedCategory = this.gameState.category;
    }
    this.calculateStats();
    this.loadHighScores();
  }

  loadHighScores(): void {
    this.highScores = this.gameService.getHighScores(this.selectedCategory).sort((a, b) => b.score - a.score);
    this.top30Scores = this.highScores.slice(0, 30);
    this.calculateUserRank();
  }

  onCategoryChange(): void {
    this.loadHighScores();
  }

  private calculateUserRank(): void {
    if (!this.gameState || this.highScores.length === 0 || this.showScores) {
      this.userRank = 0;
      return;
    }

    const userScore = this.gameState.score;
    const categoryScores = this.highScores;

    // Check if user is in the list
    const userIndex = categoryScores.findIndex(s => s.username === this.username && s.score === userScore);
    if (userIndex !== -1) {
      this.userRank = userIndex + 1;
    } else {
      // Calculate rank based on scores better than user
      this.userRank = categoryScores.filter(s => s.score > userScore).length + 1;
    }
  }

  getUserPositionDisplay(): string {
    if (this.userRank === 0) return 'N/A';
    if (this.userRank <= 30) return this.userRank.toString();
    return '30+';
  }

  getPerformanceIcon(): string {
    const percentage = this.totalQuestions > 0 ? (this.totalCorrectAnswers / this.totalQuestions) * 100 : 0;
    
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🌟';
    if (percentage >= 70) return '👏';
    if (percentage >= 60) return '💪';
    return '📚';
  }

  playAgain(): void {
    if (this.gameState) {
      this.router.navigate(['/game', this.gameState.category]);
    } else {
      this.router.navigate(['/menu']);
    }
  }

  goToMenu(): void {
    this.router.navigate(['/menu']);
  }

  changeCategory(): void {
    this.router.navigate(['/menu']);
  }

  formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}წუთ ${remainingSeconds}წმ`;
    }
    return `${remainingSeconds}წმ`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ka-GE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getCategoryIcon(category: GameCategory): string {
    switch (category) {
      case 'movies': return '🎬';
      case 'series': return '📺';
      case 'songs': return '🎵';
      default: return '🎮';
    }
  }

  getCategoryTitle(category: GameCategory): string {
    switch (category) {
      case 'movies': return 'ფილმები';
      case 'series': return 'სერიალები';
      case 'songs': return 'ფრაზები სიმღერებიდან';
      default: return category;
    }
  }

  getResultMessage(): string {
    if (!this.gameState) return '';
    
    const percentage = this.totalQuestions > 0 ? (this.totalCorrectAnswers / this.totalQuestions) * 100 : 0;
    
    if (percentage === 100) {
      return 'შესანიშნავი! ყველა კითხვა გამოიცანი! 🏆';
    } else if (percentage >= 80) {
      return 'ძალიან კარგი შედეგი! 🌟';
    } else if (percentage >= 60) {
      return 'კარგი შედეგი! 👏';
    } else if (percentage >= 40) {
      return 'არცუშავს, შემდეგჯერ უკეთესი იქნება! 💪';
    } else {
      return 'სცადე კიდევ ერთხელ! 🎮';
    }
  }

  calculateStats(): void {
    if (this.gameState) {
      this.totalCorrectAnswers = this.gameState.correctAnswers;
      this.totalQuestions = this.gameState.questions.length;
      this.score = this.gameState.score;
      this.username = this.gameState.username || 'Anonymous';
      this.totalTime = this.gameState.timeStarted ? Date.now() - this.gameState.timeStarted.getTime() : 0;
      this.calculateUserRank();
    }
  }

  getPerformanceMessage(): string {
    const percentage = this.totalQuestions > 0 ? (this.totalCorrectAnswers / this.totalQuestions) * 100 : 0;
    
    if (percentage >= 90) {
      return '🎯 ექსპერტი! შესანიშნავი შედეგი!';
    } else if (percentage >= 80) {
      return '🌟 კარგი შედეგი! კონგრატულაცია!';
    } else if (percentage >= 70) {
      return '👏 კარგი ცოდნა!';
    } else if (percentage >= 60) {
      return '💪 გააგრძელე შესწავლა!';
    } else {
      return '📚 აუმჯობესე შედეგი!';
    }
  }

}
