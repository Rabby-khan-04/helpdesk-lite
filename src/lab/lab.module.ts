import { Module } from '@nestjs/common';
import { CounterController } from './counter.controller.js';
import { CounterService } from './counter.service.js';
import { LabController } from './lab.controller.js';
import { LabLogger } from './lab.logger.js';
import { LabRepository } from './lab.repository.js';
import { LabService } from './lab.service.js';

@Module({
  controllers: [CounterController, LabController],
  providers: [CounterService, LabService, LabRepository, LabLogger],
})
export class ScopeLabModule {}
