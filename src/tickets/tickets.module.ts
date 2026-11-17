import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from '../common/request-logger.middleware.js';
import { UsersModule } from '../users/users.module.js';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';

@Module({
  imports: [UsersModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes(TicketsController);
  }
}
