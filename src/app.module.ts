import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RootLoggerMiddlewareMiddleware } from './common/root-logger.middleware.middleware.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [TicketsModule, UsersModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RootLoggerMiddlewareMiddleware).forRoutes('*');
  }
}
