import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserLoggerMiddlewareMiddleware } from '../common/user-logger-middleware.middleware.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,

    // injecting something not a class
    {
      provide: 'TEST_CONFIG',
      useValue: { port: 3000, host: 'localhost', me: 'Depressed developer' },
    },
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserLoggerMiddlewareMiddleware).forRoutes(UsersController);
  }
}
