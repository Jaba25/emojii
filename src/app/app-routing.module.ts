import { Routes } from '@angular/router';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { GameComponent } from './components/game/game.component';
import { ResultComponent } from './components/result/result.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    component: GameMenuComponent
  },
  {
    path: 'game/:category',
    component: GameComponent
  },
  {
    path: 'result',
    component: ResultComponent
  }
];