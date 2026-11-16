import { MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { RootLoggerMiddlewareMiddleware } from './common/root-logger.middleware.middleware.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [TicketsModule, UsersModule],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RootLoggerMiddlewareMiddleware).forRoutes('*');

    // Can run multiple middleware like this
    // consumer.apply(cors(), helmet(), logger).forRoutes("*")
  }
}
