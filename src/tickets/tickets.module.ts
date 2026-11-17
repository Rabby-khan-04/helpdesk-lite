import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';

@Module({
  imports: [UsersModule],
  controllers: [TicketsController],
  providers: [TicketsService],
  // exports: [TicketsService],
  // would produce cricurer depencency on user module if imports
})
export class TicketsModule {
  //  implements NestModule
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestLoggerMiddleware).forRoutes(TicketsController);
  // }
}
