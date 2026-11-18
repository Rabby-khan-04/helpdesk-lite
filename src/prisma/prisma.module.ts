import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './prisma.module-definition.js';
import { PrismaService } from './prisma.service.js';

@Module({
  providers: [
    PrismaService,
    {
      provide: 'DB_READY',
      useFactory: async (prisma: PrismaService) => {
        await prisma.$connect();
        return true;
      },
      inject: [PrismaService],
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule extends ConfigurableModuleClass {}
