import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

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
import { provideToastr } from 'ngx-toastr';
import { AuthInterceptor } from '@core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideToastr(),
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
