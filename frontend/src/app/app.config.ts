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
                0: '{zinc.900}',
                50: '{zinc.900}',
                100: '{zinc.900}',
                200: '{zinc.900}',
                300: '{zinc.900}',
                400: '{zinc.900}',
                500: '{zinc.900}',
                600: '{zinc.900}',
                700: '{zinc.900}',
                800: '{zinc.900}',
                900: '{zinc.900}',
                950: '{zinc.900}',
              },
            },
          },
        },
        //   components: {
        //     button: {
        //       colorScheme: {
        //         dark: {
        //           root: {
        //             ...Aura.components?.button,
        //             primary: {
        //               color: '#ffffff',
        //             },
        //           },
        //         },
        //       },
        //     },
        //     slider: {
        //       colorScheme: {
        //         ...Aura.components?.slider,
        //       },
        //     },
        //   },
        // },
      },
    }),
  ],
};
