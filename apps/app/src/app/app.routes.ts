import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Bungkit · App',
    loadComponent: () => import('./home').then((m) => m.Home),
  },
  {
    path: 'about',
    title: 'Bungkit · About',
    loadComponent: () => import('./about').then((m) => m.About),
  },
];
