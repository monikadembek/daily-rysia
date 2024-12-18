import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isAdminGuard } from './auth/guards/is-admin.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.component').then((m) => m.TabsComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'gallery',
        loadComponent: () => import('./gallery/gallery.page').then((m) => m.GalleryPage),
      },
      {
        path: 'photos-manager',
        loadComponent: () =>
          import('./photos-manager/photos-manager.page').then((m) => m.PhotosManagerPage),
        canActivate: [isAuthenticatedGuard, isAdminGuard],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'set-auth-claim',
    loadComponent: () =>
      import('./auth/auth-claim/auth-claim.component').then((m) => m.AuthClaimComponent),
    canActivate: [isAuthenticatedGuard, isAdminGuard],
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];
