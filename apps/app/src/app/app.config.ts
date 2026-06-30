import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideUiTheme } from '@ojiepermana/angular/theme/styles';
import { layoutLoadingInterceptor } from '@ojiepermana/angular/theme/layout/services';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // layoutLoadingInterceptor drives the layout's top progress bar while
    // HTTP requests are in flight.
    provideHttpClient(withFetch(), withInterceptors([layoutLoadingInterceptor])),
    // @ojiepermana/angular design-system theme defaults (each axis persists, so a
    // user's runtime choice wins over these). `icons.materialSymbols` preloads the
    // Material Symbols font (Google Fonts) so layout/nav icons render — drop it for
    // offline / strict-CSP builds and self-host the font instead.
    provideUiTheme({
      mode: 'light',
      color: 'rose',
      neutral: 'base',
      radius: 'md',
      space: 'compact',
      icons: { materialSymbols: true },
    }),
  ],
};
