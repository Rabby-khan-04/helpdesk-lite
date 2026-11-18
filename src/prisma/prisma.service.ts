import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import {
  MODULE_OPTIONS_TOKEN,
  type PrismaModuleOptions,
} from './prisma.module-definition.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: PrismaModuleOptions) {
    super({ adapter: new PrismaPg({ connectionString: options.url }) });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
