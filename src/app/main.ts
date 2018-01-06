import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

export const API_URL = 'http://127.0.0.1:17334';

platformBrowserDynamic().bootstrapModule(AppModule);
