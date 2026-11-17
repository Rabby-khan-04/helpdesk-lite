import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { InMemoryTicketsRepository } from './in-memory-tickets.repository.js';
import { TicketsController } from './tickets.controller.js';
import { TicketsRepository } from './tickets.repository.js';
import { TicketsService } from './tickets.service.js';

@Module({
  imports: [UsersModule],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    { provide: TicketsRepository, useClass: InMemoryTicketsRepository },
  ],
  // exports: [TicketsService],
  // would produce cricurer depencency on user module if imports
})
export class TicketsModule {
  //  implements NestModule
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestLoggerMiddleware).forRoutes(TicketsController);
  // }
}
