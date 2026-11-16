import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [TicketsModule, UsersModule],
})
export class AppModule {}
