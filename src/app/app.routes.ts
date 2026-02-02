import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout').then((c) => c.Layout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((c) => c.Dashboard),
      },
      {
        path: 'goals',
        loadComponent: () => import('./pages/goals/goals').then((c) => c.Goals),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./pages/tasks/tasks').then((c) => c.Tasks),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((c) => c.Settings),
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
