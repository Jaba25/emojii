import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GameService } from '../../services/game.service';
import { GameState, GameCategory } from '../../models/game.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GameComponent implements OnInit, OnDestroy {
  
  gameState: GameState | null = null;
  userAnswer = '';
  currentHint = '';
  showHint = false;
  revealedAnswer = '';
  showRevealedAnswer = false;
  category: GameCategory = 'movies';
  categoryTitle = '';
  private gameSubscription?: Subscription;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'] as GameCategory;
      this.setCategoryTitle();
      this.startNewGame();
    });

    this.gameSubscription = this.gameService.gameState$.subscribe(state => {
      this.gameState = state;
      
      if (state.gameStatus === 'finished') {
        setTimeout(() => {
          this.router.navigate(['/result']);
        }, 1500);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  setCategoryTitle(): void {
    switch (this.category) {
      case 'movies':
        this.categoryTitle = '🎬 ფილმები';
        break;
      case 'series':
        this.categoryTitle = '📺 სერიალები';
        break;
      case 'songs':
        this.categoryTitle = '🎵 სიმღერები';
        break;
    }
  }

  startNewGame(): void {
    this.gameService.startGame(this.category);
    this.resetForm();
  }

  submitAnswer(): void {
    if (!this.userAnswer.trim() || !this.gameState) return;

    const isCorrect = this.gameService.submitAnswer(this.userAnswer.trim());
    
    if (isCorrect) {
      this.showSuccess();
      this.resetForm(); // Only reset form on correct answer
    } else {
      this.showError();
      // Don't reset form on wrong answer, let user modify their input
    }
  }

  useHint(): void {
    const hint = this.gameService.useHint();
    if (hint) {
      this.currentHint = hint;
      this.showHint = true;
    }
  }

  private async showSuccess(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'სწორია! 🎉',
      duration: 1500,
      position: 'top',
      color: 'success',
      cssClass: 'success-toast',
      buttons: [
        {
          text: '✕',
          role: 'cancel'
        }
      ]
    });
    
    await toast.present();
  }

  private async showError(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'პასუხი არასწორია! სცადეთ კიდევ.',
      duration: 2000,
      position: 'top',
      color: 'danger',
      cssClass: 'error-toast',
      buttons: [
        {
          text: '✕',
          role: 'cancel'
        }
      ]
    });
    
    await toast.present();
  }

  private resetForm(): void {
    this.userAnswer = '';
    this.currentHint = '';
    this.showHint = false;
    this.revealedAnswer = '';
    this.showRevealedAnswer = false;
  }

  goBackToMenu(): void {
    this.router.navigate(['/menu']);
  }

  goToMainPage(): void {
    this.router.navigate(['/']);
  }

  getProgressPercentage(): number {
    if (!this.gameState || this.gameState.questions.length === 0) return 0;
    return (this.gameState.currentQuestionIndex / this.gameState.questions.length) * 100;
  }

  canAffordHint(): boolean {
    if (!this.gameState) return false;
    return this.gameState.coins >= 10;
  }

  canAffordShowAnswer(): boolean {
    if (!this.gameState) return false;
    return this.gameState.coins >= 50;
  }

  showAnswer(): void {
    const answer = this.gameService.showAnswer();
    if (answer) {
      // Show the answer to the user visually
      this.revealedAnswer = answer;
      this.showRevealedAnswer = true;
      this.userAnswer = '';
      this.showHint = false;
    }
  }

  goToNextQuestion(): void {
    // Move to the next question manually
    this.gameService.moveToNextQuestionManually();
    this.resetForm(); // Clear all form data for the new question
  }

  closeHint(): void {
    this.showHint = false;
    this.currentHint = '';
  }

  closeRevealedAnswer(): void {
    this.showRevealedAnswer = false;
    this.revealedAnswer = '';
  }

  getHintsLeft(): number {
    if (!this.gameState) return 3;
    return 3 - this.gameState.usedHints;
  }

  getDifficultyText(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'მარტივი';
      case 'medium': return 'საშუალო';
      case 'hard': return 'რთული';
      default: return difficulty;
    }
  }

  isLongEmojiSequence(): boolean {
    if (!this.gameState?.currentQuestion?.emojis) return false;
    // Count the number of emoji characters (rough estimation)
    const emojiCount = this.gameState.currentQuestion.emojis.length;
    return emojiCount > 15; // Consider it long if more than 15 characters (roughly 8+ emojis)
  }
}
