import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import {
  heroArrowDownTray,
  heroArrowPath,
  heroArrowRightOnRectangle,
  heroArrowUpTray,
  heroCheckCircle,
  heroChevronLeft,
  heroChevronRight,
  heroClock,
  heroCog6Tooth,
  heroDocumentArrowDown,
  heroDocumentDuplicate,
  heroDocumentText,
  heroHome,
  heroIdentification,
  heroInformationCircle,
  heroLockClosed,
  heroMagnifyingGlass,
  heroMagnifyingGlassCircle,
  heroPlusCircle,
  heroTrash,
  heroUser,
  heroUserCircle,
  heroUserPlus,
  heroUsers,
} from '@ng-icons/heroicons/outline';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/token.interceptor';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideClientHydration(withEventReplay()),
    provideIcons({
      heroIdentification,
      heroLockClosed,
      heroUser,
      heroHome,
      heroDocumentDuplicate,
      heroDocumentText,
      heroArrowRightOnRectangle,
      heroClock,
      heroInformationCircle,
      heroMagnifyingGlassCircle,
      heroMagnifyingGlass,
      heroArrowPath,
      heroArrowDownTray,
      heroDocumentArrowDown,
      heroUsers,
      heroCheckCircle,
      heroTrash,
      heroUserPlus,
      heroArrowUpTray,
      heroPlusCircle,
      heroChevronLeft,
      heroChevronRight,
      heroCog6Tooth,
      heroUserCircle,
    }),
  ],
};
