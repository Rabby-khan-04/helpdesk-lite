import { DynamicModule, Module } from '@nestjs/common';
import {
  ID_GENERATOR_OPTIONS,
  IdGeneratorOptions,
} from './id-generator.options.js';
import { IdGenerator } from './id-generator.service.js';

@Module({})
export class IdGeneratorModule {
  static register(options: IdGeneratorOptions): DynamicModule {
    console.log(`register() called, prefix: ${options.prefix}`);

    return {
      module: IdGeneratorModule,
      providers: [
        IdGenerator,
        { provide: ID_GENERATOR_OPTIONS, useValue: options },
      ],
      exports: [IdGenerator],
    };
  }
}
