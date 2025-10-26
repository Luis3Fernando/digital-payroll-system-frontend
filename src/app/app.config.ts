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
  heroCheckCircle,
  heroClock,
  heroDocumentArrowDown,
  heroDocumentDuplicate,
  heroDocumentText,
  heroHome,
  heroIdentification,
  heroInformationCircle,
  heroLockClosed,
  heroMagnifyingGlass,
  heroMagnifyingGlassCircle,
  heroTrash,
  heroUser,
  heroUserPlus,
  heroUsers,
} from '@ng-icons/heroicons/outline';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
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
    }),
  ],
};
