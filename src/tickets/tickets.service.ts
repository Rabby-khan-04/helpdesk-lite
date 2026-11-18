import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type Clock, CLOCK } from '../common/clock.js';
import { ErrorCode } from '../common/error-codes.js';
import { PublicUser } from '../users/public-user.js';
import { UsersService } from '../users/users.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { TicketCloseExceptions } from './exceptions/ticket-close.exceptions.js';
import { Ticket } from './ticket.interface.js';
import { TicketsRepository } from './tickets.repository.js';

@Injectable()
export class TicketsService {
  constructor(
    private repo: TicketsRepository,
    private usersService: UsersService,
    @Inject(CLOCK) private readonly now: Clock,
  ) {}

  findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
    return this.repo.findAll({ status, priority });
  }

  async findOne(id: number) {
    const ticket = await this.repo.findOne(id);

    if (!ticket)
      throw new NotFoundException(`Ticket with Id: ${id} not found`, {
        errorCode: ErrorCode.TicketNotFound,
      });

    return ticket;
  }

  async create(createTicketDto: CreateTicketDto) {
    await this.usersService.findOne(createTicketDto.reporterId);

    return this.repo.create({
      subject: createTicketDto.subject,
      description: createTicketDto.description,
      reporterId: createTicketDto.reporterId,
      priority: createTicketDto.priority,
      status: 'open',
      createdAt: this.now(),
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.findOne(id);

    if (ticket.status === 'closed')
      throw new TicketCloseExceptions('Closed ticket cannot be updated!');

    return this.repo.update(id, updateTicketDto);
  }

  async closeTicket(id: number) {
    const ticket = await this.findOne(id);

    if (ticket.status === 'closed')
      throw new BadRequestException('Ticket is already closed');

    return this.repo.closeTicket(id);
  }

  async stats() {
    return this.repo.stats();
  }

  async delete(id: number) {
    const ticket = await this.findOne(id);
    await this.repo.remove(id);
    return ticket;
  }

  async renect(limit: number, page: number) {
    return await this.repo.renect(limit, page);
  }

  assertCanAccess(ticket: Ticket, user: PublicUser) {
    if (user.role === 'user' && ticket.reporterId !== user.id) {
      throw new ForbiddenException('You can only access your own tickets');
    }
  }
}
