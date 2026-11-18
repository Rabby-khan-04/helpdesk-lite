import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface PrismaModuleOptions {
  url: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<PrismaModuleOptions>()
    .setClassMethodName('forRoot')
    .setExtras({ isGlobal: false }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .build();
