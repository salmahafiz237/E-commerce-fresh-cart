import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { headerInterceptor } from './core/interceptors/header-interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration:'enabled',anchorScrolling:'enabled'}),
    withViewTransitions()), 
    provideClientHydration(),
    importProvidersFrom(NgxSpinnerModule),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true
    }),
    provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor, headerInterceptor]))
  ]
};
