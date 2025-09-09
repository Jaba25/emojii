import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController, IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { GameState, GameCategory } from '../../models/game.model';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GameComponent implements OnInit, OnDestroy {
  
  gameState: GameState | null = null;
  userAnswer = '';
  currentHint = '';
  currentHintLevel: 'easy' | 'medium' | 'hard' | null = null;
  showHint = false;
  showHintOptions = false;
  revealedAnswer = '';
  showRevealedAnswer = false;
  category: GameCategory = 'movies';
  categoryTitle = '';
  private gameSubscription?: Subscription;

  // Answer validation state
  showAnswerResult: boolean = false;
  isAnswerCorrect: boolean = false;

  // Letter boxes for visual display
  letterBoxes: Array<{
    userLetter: string;
    correctLetter: string;
    isCorrect: boolean;
    isIncorrect: boolean;
    spaceAfter: boolean;
  }> = [];

  // Reference to hidden input
  @ViewChild('hiddenInput') hiddenInput!: ElementRef<HTMLInputElement>;

  // Mobile-specific properties
  private isMobile = false;
  private lastInputValue = '';
  private inputCheckInterval: any;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef,
    private platform: Platform,
    private ngZone: NgZone
  ) { 
    this.isMobile = Capacitor.isNativePlatform();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const newCategory = params['category'] as GameCategory;
      
      // Only start new game if category changed or no current game
      if (this.category !== newCategory || !this.gameState || this.gameState.gameStatus === 'finished') {
        this.category = newCategory;
        this.setCategoryTitle();
        this.startNewGame();
      }
    });

    this.gameSubscription = this.gameService.gameState$.subscribe(state => {
      const previousQuestionIndex = this.gameState?.currentQuestionIndex;
      this.gameState = state;
      
      // Create letter boxes when question changes
      if (state.currentQuestion) {
        // If question changed, reset the form immediately
        if (previousQuestionIndex !== undefined && previousQuestionIndex !== state.currentQuestionIndex) {
          this.resetFormImmediate();
        }
        this.createLetterBoxes();
      }
      
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
    // Clean up input monitoring
    this.stopInputMonitoring();
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

    // Use the service's proper validation logic
    const isCorrect = this.gameService.submitAnswer(this.userAnswer.trim());
    
    // Show visual feedback on letter boxes
    this.isAnswerCorrect = isCorrect;
    this.showAnswerResult = true;
    this.updateLetterBoxesWithResult(isCorrect);
    
    if (isCorrect) {
      // Show success message first
      this.showSuccess();
      // Wait longer to show the correct answer, then proceed to next question
      setTimeout(() => {
        this.resetForm();
      }, 3000); // Increased from 2000 to 3000ms
    } else {
      this.showError();
      // Keep the result visible so user can see what's wrong
    }
  }

  useHint(level?: 'easy' | 'medium' | 'hard'): void {
    if (!level) {
      this.showHintOptions = true;
      return;
    }

    if (!this.gameState?.currentQuestion || !this.canUseHint(level)) {
      return;
    }

    const hint = this.gameService.useHint(level);
    if (hint) {
      this.currentHint = hint;
      this.currentHintLevel = level;
      this.showHint = true;
      this.showHintOptions = false;
    }
  }

  canUseHint(level: 'easy' | 'medium' | 'hard'): boolean {
    if (!this.gameState) return false;
    
    const alreadyUsed = this.gameState.usedHints[level];
    if (alreadyUsed) return false;
    
    const costs = { easy: 10, medium: 20, hard: 30 };
    return this.gameState.coins >= costs[level];
  }

  getHintLevelText(): string {
    switch (this.currentHintLevel) {
      case 'easy': return 'მარტივი მინიშნება';
      case 'medium': return 'საშუალო მინიშნება';
      case 'hard': return 'რთული მინიშნება';
      default: return 'მინიშნება';
    }
  }

  closeHintOptions(): void {
    this.showHintOptions = false;
    // Action buttons will reappear automatically due to *ngIf condition
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
    this.showAnswerResult = false;
    this.isAnswerCorrect = false;
    this.updateLetterBoxes(); // Update letter boxes when form resets
  }

  private resetFormImmediate(): void {
    this.userAnswer = '';
    this.currentHint = '';
    this.showHint = false;
    this.revealedAnswer = '';
    this.showRevealedAnswer = false;
    this.showAnswerResult = false;
    this.isAnswerCorrect = false;
    // Don't update letter boxes here as they will be updated by createLetterBoxes
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
      this.revealedAnswer = answer;
      this.showRevealedAnswer = true;
      this.userAnswer = '';
      this.showHint = false;
    }
  }

  goToNextQuestion(): void {
    this.gameService.moveToNextQuestionManually();
    this.resetForm();
  }

  closeHint(): void {
    this.showHint = false;
    this.currentHint = '';
    // Action buttons will reappear automatically due to *ngIf condition
  }

  closeRevealedAnswer(): void {
    this.showRevealedAnswer = false;
    this.revealedAnswer = '';
  }

  getHintsLeft(): number {
    if (!this.gameState) return 3;
    const used = this.gameState.usedHints;
    let count = 0;
    if (!used.easy) count++;
    if (!used.medium) count++;
    if (!used.hard) count++;
    return count;
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
    const emojiCount = this.gameState.currentQuestion.emojis.length;
    return emojiCount > 12;
  }

  clearIncorrectAnswer(): void {
    this.showAnswerResult = false;
    this.isAnswerCorrect = false;
    this.userAnswer = '';
    this.updateLetterBoxes();
  }

  // Letter boxes methods
  createLetterBoxes(): void {
    if (!this.gameState?.currentQuestion?.answer) return;
    
    const correctAnswer = this.gameState.currentQuestion.answer;
    this.letterBoxes = [];
    
    for (let i = 0; i < correctAnswer.length; i++) {
      if (correctAnswer[i] === ' ') {
        // Mark previous box for extra spacing
        if (this.letterBoxes.length > 0) {
          this.letterBoxes[this.letterBoxes.length - 1].spaceAfter = true;
        }
        continue;
      }
      
      this.letterBoxes.push({
        userLetter: '',
        correctLetter: correctAnswer[i].toLowerCase(),
        isCorrect: false,
        isIncorrect: false,
        spaceAfter: false
      });
    }
    
    // Update boxes with current user input
    this.updateLetterBoxes();
  }

  updateLetterBoxes(): void {
    if (!this.gameState?.currentQuestion?.answer) return;
    
    // Reset all boxes (no instant validation)
    this.letterBoxes.forEach(box => {
      box.userLetter = '';
      box.isCorrect = false;
      box.isIncorrect = false;
    });
    
    // Fill boxes with user input (no validation during typing)
    let boxIndex = 0;
    const userInput = this.userAnswer || '';
    
    // Use Array.from to properly handle Unicode characters
    const characters = Array.from(userInput);
    
    for (let i = 0; i < characters.length && boxIndex < this.letterBoxes.length; i++) {
      const userChar = characters[i];
      
      if (userChar === ' ') {
        // Skip spaces in user input
        continue;
      }
      
      if (boxIndex < this.letterBoxes.length) {
        const box = this.letterBoxes[boxIndex];
        // Keep original case for Georgian and other Unicode characters, uppercase for Latin
        if (this.isUnicodeCharacter(userChar)) {
          box.userLetter = userChar;
        } else {
          box.userLetter = userChar.toUpperCase();
        }
        boxIndex++;
      }
    }
    
    // Mobile-specific change detection
    if (this.isMobile) {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      // Additional force update for mobile WebView
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    } else {
      this.cdr.detectChanges();
    }
  }

  // Helper method to check if character is Georgian
  private isGeorgianCharacter(char: string): boolean {
    const georgianRange = /[\u10A0-\u10FF]/;
    return georgianRange.test(char);
  }

  // Helper method to check if character is Unicode (non-Latin)
  private isUnicodeCharacter(char: string): boolean {
    const codePoint = char.codePointAt(0);
    if (!codePoint) return false;
    
    // Check for various Unicode ranges (Georgian, Armenian, Cyrillic, etc.)
    return (
      (codePoint >= 0x10A0 && codePoint <= 0x10FF) || // Georgian
      (codePoint >= 0x0530 && codePoint <= 0x058F) || // Armenian
      (codePoint >= 0x0400 && codePoint <= 0x04FF) || // Cyrillic
      (codePoint >= 0x0370 && codePoint <= 0x03FF) || // Greek
      (codePoint >= 0x0590 && codePoint <= 0x05FF) || // Hebrew
      (codePoint >= 0x0600 && codePoint <= 0x06FF) || // Arabic
      (codePoint > 0x007F) // Any character above basic Latin
    );
  }

  private updateLetterBoxesWithResult(isCorrect: boolean): void {
    if (!this.gameState?.currentQuestion?.answer) return;
    
    // Apply result styling to all boxes
    this.letterBoxes.forEach(box => {
      if (box.userLetter) {
        box.isCorrect = isCorrect;
        box.isIncorrect = !isCorrect;
      }
    });
  }

  // Called when user types in the input field
  onAnswerChange(event?: Event): void {
    if (event && event.target) {
      const inputElement = event.target as HTMLInputElement;
      const newValue = inputElement.value;
      
      if (this.isMobile) {
        // Mobile: Use NgZone for proper change detection
        this.ngZone.run(() => {
          this.userAnswer = newValue;
          this.lastInputValue = newValue;
          this.updateLetterBoxes();
        });
      } else {
        // Web: Standard update
        this.userAnswer = newValue;
        this.updateLetterBoxes();
      }
    }
  }

  // Handle keydown events for immediate response
  onKeyDown(event: KeyboardEvent): void {
    if (this.isMobile) {
      // Mobile: Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        if (event.target) {
          const inputElement = event.target as HTMLInputElement;
          this.ngZone.run(() => {
            this.userAnswer = inputElement.value;
            this.lastInputValue = inputElement.value;
            this.updateLetterBoxes();
          });
        }
      });
    } else {
      // Web: Use minimal timeout
      setTimeout(() => {
        if (event.target) {
          const inputElement = event.target as HTMLInputElement;
          this.userAnswer = inputElement.value;
          this.updateLetterBoxes();
        }
      }, 1);
    }
  }

  // Handle keyup events for immediate response
  onKeyUp(event: KeyboardEvent): void {
    if (event.target) {
      const inputElement = event.target as HTMLInputElement;
      const newValue = inputElement.value;
      
      if (this.isMobile) {
        this.ngZone.run(() => {
          this.userAnswer = newValue;
          this.lastInputValue = newValue;
          this.updateLetterBoxes();
        });
      } else {
        this.userAnswer = newValue;
        this.updateLetterBoxes();
      }
    }
  }

  // Focus hidden input to trigger keyboard
  focusHiddenInput(): void {
    if (this.hiddenInput && this.hiddenInput.nativeElement) {
      // Small delay to ensure the element is ready
      setTimeout(() => {
        this.hiddenInput.nativeElement.focus();
        // For mobile devices, also trigger click
        this.hiddenInput.nativeElement.click();
        // Start monitoring input for Georgian characters
        this.startInputMonitoring();
      }, 100);
    }
  }

  // Mobile-optimized input monitoring
  private startInputMonitoring(): void {
    this.stopInputMonitoring();
    
    if (this.isMobile) {
      // For mobile: Use more aggressive polling with NgZone
      this.inputCheckInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.checkInputValue();
        });
      }, 16); // ~60fps for smooth updates
    } else {
      // For web: Use standard polling
      this.inputCheckInterval = setInterval(() => {
        this.checkInputValue();
      }, 50);
    }
  }

  private stopInputMonitoring(): void {
    if (this.inputCheckInterval) {
      clearInterval(this.inputCheckInterval);
      this.inputCheckInterval = null;
    }
  }

  private checkInputValue(): void {
    if (this.hiddenInput && this.hiddenInput.nativeElement) {
      const currentValue = this.hiddenInput.nativeElement.value;
      if (currentValue !== this.lastInputValue) {
        this.lastInputValue = currentValue;
        this.userAnswer = currentValue;
        this.updateLetterBoxes();
        
        if (this.isMobile) {
          // Force change detection on mobile
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      }
    }
  }

  // Handle input focus
  onInputFocus(): void {
    // Start monitoring when input is focused
    this.startInputMonitoring();
  }

  // Handle input blur
  onInputBlur(): void {
    // Stop monitoring when input loses focus
    this.stopInputMonitoring();
  }

  // Handle composition events for Georgian characters
  onCompositionStart(event: CompositionEvent): void {
    if (event.target) {
      const inputElement = event.target as HTMLInputElement;
      const newValue = inputElement.value;
      
      if (this.isMobile) {
        this.ngZone.run(() => {
          this.userAnswer = newValue;
          this.lastInputValue = newValue;
          this.updateLetterBoxes();
        });
      } else {
        this.userAnswer = newValue;
        this.updateLetterBoxes();
      }
    }
  }

  onCompositionUpdate(event: CompositionEvent): void {
    if (event.target) {
      const inputElement = event.target as HTMLInputElement;
      const newValue = inputElement.value;
      
      if (this.isMobile) {
        this.ngZone.run(() => {
          this.userAnswer = newValue;
          this.lastInputValue = newValue;
          this.updateLetterBoxes();
        });
      } else {
        this.userAnswer = newValue;
        this.updateLetterBoxes();
      }
    }
  }

  onCompositionEnd(event: CompositionEvent): void {
    if (event.target) {
      const inputElement = event.target as HTMLInputElement;
      const newValue = inputElement.value;
      
      if (this.isMobile) {
        this.ngZone.run(() => {
          this.userAnswer = newValue;
          this.lastInputValue = newValue;
          this.updateLetterBoxes();
        });
      } else {
        this.userAnswer = newValue;
        this.updateLetterBoxes();
      }
    }
  }
}