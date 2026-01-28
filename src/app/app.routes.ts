import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'goals', pathMatch: 'full' },
  {
    path: 'goals',
    loadComponent: () => import('./pages/goals/goals').then((c) => c.Goals),
  },
];
