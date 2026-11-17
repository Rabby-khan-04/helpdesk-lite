import {
  MiddlewareConsumer,
  Module,
  ValidationPipe,
  type NestModule,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { RoleGuard } from './common/guards/role.guard.js';
import { CurrentUserMiddleware } from './common/middleware/current-user.middleware.js';
import { RootLoggerMiddlewareMiddleware } from './common/root-logger.middleware.middleware.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [TicketsModule, UsersModule],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware, RootLoggerMiddlewareMiddleware)
      .forRoutes('*');

    // Can run multiple middleware like this
    // consumer.apply(cors(), helmet(), logger).forRoutes("*")
  }
}
