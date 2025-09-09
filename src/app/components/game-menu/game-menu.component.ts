import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GameCategory } from '../../models/game.model';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class GameMenuComponent {

  constructor(private router: Router) { }

  startGame(category: GameCategory): void {
    this.router.navigate(['/game', category]);
  }

  viewHighScores(): void {
    this.router.navigate(['/result'], { queryParams: { showScores: true } });
  }
}