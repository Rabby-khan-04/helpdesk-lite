import { Module } from '@nestjs/common';
import { Argon2PasswordHasher } from './argon2-password-hasher.js';
import { InMemoryUsersRepository } from './in-memory-users.repository.js';
import { PasswordHasher } from './password-hasher.js';
import { UserRepository } from './user.repository.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  // imports: [TicketsService],
  // --> this is circuler dependency
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UserRepository, useClass: InMemoryUsersRepository },
    { provide: PasswordHasher, useClass: Argon2PasswordHasher },

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
