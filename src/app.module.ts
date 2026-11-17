import {
  MiddlewareConsumer,
  Module,
  ValidationPipe,
  type NestModule,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { RoleGuard } from './common/guards/role.guard.js';
import { CurrentUserMiddleware } from './common/middleware/current-user.middleware.js';
import { ResponseInterceptor } from './common/response.interceptor.js';
import { TimeoutInterceptor } from './common/timeout.interceptor.js';
import { TimingInterceptor } from './common/timing.interceptor.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [TicketsModule, UsersModule],
  providers: [
    // { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

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
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');

    // Can run multiple middleware like this
    // consumer.apply(cors(), helmet(), logger).forRoutes("*")
  }
}
