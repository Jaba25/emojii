import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { GameCategory } from '../../models/game.model';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GameMenuComponent {

  username: string = '';
  usernameInput: string = '';

  constructor(
    private router: Router,
    private gameService: GameService
  ) { }

  setUsername(): void {
    if (this.usernameInput && this.usernameInput.trim()) {
      this.username = this.usernameInput.trim();
    } else {
      this.username = 'Anonymous';
    }
    this.usernameInput = '';
  }

  startGame(category: GameCategory): void {
    if (this.username) {
      this.gameService.startGame(category, this.username);
      this.router.navigate(['/game', category]);
    }
  }

  viewHighScores(): void {
    this.router.navigate(['/result'], { queryParams: { showScores: true } });
  }

}
