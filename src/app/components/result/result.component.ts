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
  showScores = false;
  selectedCategory: GameCategory | 'all' = 'all';
  Date = Date; // Add Date property for template access

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
    this.loadHighScores();
  }

  loadHighScores(): void {
    if (this.selectedCategory === 'all') {
      this.highScores = this.gameService.getHighScores();
    } else {
      this.highScores = this.gameService.getHighScores(this.selectedCategory);
    }
  }

  onCategoryChange(): void {
    this.loadHighScores();
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
      case 'songs': return 'სიმღერები';
      default: return category;
    }
  }

  getResultMessage(): string {
    if (!this.gameState) return '';
    
    const percentage = (this.gameState.currentQuestionIndex / this.gameState.questions.length) * 100;
    
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
}
