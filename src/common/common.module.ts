import { Global, Module } from '@nestjs/common';
import { Clock, CLOCK } from './clock.js';

@Global()
@Module({
  providers: [{ provide: CLOCK, useValue: (() => new Date()) as Clock }],
  exports: [CLOCK],
})
export class CommonModule {}
