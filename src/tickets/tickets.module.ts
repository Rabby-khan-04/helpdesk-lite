import { forwardRef, Module } from '@nestjs/common';
import { IdGeneratorModule } from '../id-generator/id-denerator.module.js';
import { NotificationModule } from '../notifications/notifications.module.js';
import { UsersModule } from '../users/users.module.js';
import { InMemoryTicketsRepository } from './in-memory-tickets.repository.js';
import { PrismaTicketsRepository } from './prisma-tickets.repository.js';
import { TicketsController } from './tickets.controller.js';
import { TicketsRepository } from './tickets.repository.js';
import { TicketsService } from './tickets.service.js';

@Module({
  imports: [
    UsersModule,
    IdGeneratorModule.register({ prefix: 'tkt' }),
    forwardRef(() => UsersModule),
    NotificationModule,
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    {
      provide: TicketsRepository,
      useClass:
        process.env.REPOSITORY === 'memory'
          ? InMemoryTicketsRepository
          : PrismaTicketsRepository,
    },
  ],
  exports: [TicketsService],
  // would produce cricurer depencency on user module if imports
})
export class TicketsModule {
  //  implements NestModule
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestLoggerMiddleware).forRoutes(TicketsController);
  // }
}
