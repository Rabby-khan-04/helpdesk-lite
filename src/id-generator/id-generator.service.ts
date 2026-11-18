import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MODULE_OPTIONS_TOKEN } from './id-generator.module-defination.js';
import { type IdGeneratorOptions } from './id-generator.options.js';

@Injectable()
export class IdGenerator {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: IdGeneratorOptions,
  ) {
    console.log(`Generator created prefix: ${this.options.prefix}`);
  }

  generate(): string {
    return `${this.options.prefix}_${randomUUID().slice(0, 8)}`;
  }
}
