import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class LabLogger {
  constructor(@Inject(INQUIRER) private readonly parent: object) {
    console.log('LabLogger created for', this.parent?.constructor?.name);
  }

  log(message: string) {
    console.log(`${this.parent?.constructor?.name}: ${message}`);
  }
}
