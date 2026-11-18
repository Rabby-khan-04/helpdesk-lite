import { Controller, Get } from '@nestjs/common';
import { SkipEnvelope } from '../common/decorators/skip-envelope.decorator.js';
import { LabService } from './lab.service.js';

@Controller('lab')
export class LabController {
  constructor(private readonly lab: LabService) {
    console.log('LabController created');
  }

  @Get('bubble')
  @SkipEnvelope()
  bubble() {
    return this.lab.read();
  }

  @Get('whoami')
  @SkipEnvelope()
  whoAmI() {
    return { user: this.lab.whoAmI() ?? null };
  }
}
