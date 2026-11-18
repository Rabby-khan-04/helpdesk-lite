import { Injectable } from '@nestjs/common';
import { LabLogger } from './lab.logger.js';

@Injectable()
export class LabRepository {
  constructor(private readonly log: LabLogger) {
    console.log('LabRepository created');
    this.log.log('repository ready');
  }

  find() {
    this.log.log('find()');
    return { id: 1, source: 'LabRepository' };
  }
}
