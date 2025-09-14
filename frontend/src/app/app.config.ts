import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/lara';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: {
          ...Aura,
          semantic: {
            colorScheme: {
              ...Aura.semantic,
              primary: {
                50:  '#ffffff',
                100: '#ffffff',
                200: '#ffffff',
                300: '#ffffff',
                400: '#ffffff',
                500: '#ffffff',
                600: '#ffffff',
                700: '#ffffff',
                800: '#ffffff',
                900: '#ffffff',
                950: '#ffffff'
              },
              surface: {
                0:   '#3D3D42',
                50:  '#3D3D42',
                100: '#3D3D42',
                200: '#3D3D42',
                300: '#3D3D42',
                400: '#3D3D42',
                500: '#3D3D42',
                600: '#3D3D42',
                700: '#3D3D42',
                800: '#3D3D42',
                900: '#3D3D42',
                950: '#3D3D42',
              },
            },
          },
        },
      },
    }),
  ],
};
