import { ConfigurableModuleBuilder } from '@nestjs/common';
import type { IdGeneratorOptions } from './id-generator.options.js';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<IdGeneratorOptions>().build();
