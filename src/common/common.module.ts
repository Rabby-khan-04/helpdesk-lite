import { Global, Module } from '@nestjs/common';
import { Clock, CLOCK } from './clock.js';
import { APP_SETTINGS, loadAppSettings } from './settings.js';

@Global()
@Module({
  providers: [
    { provide: CLOCK, useValue: (() => new Date()) as Clock },
    { provide: APP_SETTINGS, useFactory: loadAppSettings, inject: [CLOCK] },
  ],
  exports: [CLOCK, APP_SETTINGS],
})
export class CommonModule {}
