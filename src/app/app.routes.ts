import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/goals',
    pathMatch: 'full',
    children: [
      {
        path: 'goals',
        loadComponent: () => import('./pages/goals/goals').then((c) => c.Goals),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((c) => c.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((c) => c.Register),
  },
];
