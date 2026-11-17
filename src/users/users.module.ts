import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  // imports: [TicketsService],
  // --> this is circuler dependency
  controllers: [UsersController],
  providers: [
    UsersService,

    // injecting something not a class
    {
      provide: 'TEST_CONFIG',
      useValue: { port: 3000, host: 'localhost', me: 'Depressed developer' },
    },
  ],

  exports: [UsersService],
})
export class UsersModule {
  // implements NestModule
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(UserLoggerMiddlewareMiddleware).forRoutes(UsersController);
  // }
}
