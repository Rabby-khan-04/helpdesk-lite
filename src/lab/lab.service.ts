import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { type AuthRequest } from '../common/middleware/current-user.middleware.js';
import { LabLogger } from './lab.logger.js';
import { LabRepository } from './lab.repository.js';

@Injectable({ scope: Scope.REQUEST })
export class LabService {
  constructor(
    private readonly repo: LabRepository,
    private readonly log: LabLogger,
    @Inject(REQUEST) private readonly request: AuthRequest,
  ) {
    console.log('LabService created');
    this.log.log('service ready');
  }

  read() {
    return this.repo.find();
  }

  whoAmI() {
    return this.request.user;
  }
}
