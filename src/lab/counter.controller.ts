import { Controller, Get } from '@nestjs/common';
import { SkipEnvelope } from '../common/decorators/skip-envelope.decorator.js';
import { CounterService } from './counter.service.js';

@Controller('lab')
export class CounterController {
  constructor(private readonly counter: CounterService) {}

  @Get('counter')
  @SkipEnvelope()
  count() {
    return { count: this.counter.next() };
  }
}
