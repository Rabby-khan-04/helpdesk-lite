import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ID_GENERATOR_OPTIONS,
  type IdGeneratorOptions,
} from './id-generator.options.js';

@Injectable()
export class IdGenerator {
  constructor(
    @Inject(ID_GENERATOR_OPTIONS) private readonly options: IdGeneratorOptions,
  ) {
    console.log(`Generator created prefix: ${this.options.prefix}`);
  }

  generate(): string {
    return `${this.options.prefix}_${randomUUID().slice(0, 8)}`;
  }
}
