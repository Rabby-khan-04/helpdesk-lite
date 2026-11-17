import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PublicUser } from '../users/public-user.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { TicketCloseExceptions } from './exceptions/ticket-close.exceptions.js';
import { Ticket } from './ticket.interface.js';
import { TicketsRepository } from './tickets.repository.js';

@Injectable()
export class TicketsService {
  constructor(private repo: TicketsRepository) {}

  findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
    this.repo.findAll({ status, priority });
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  create(createTicketDto: CreateTicketDto) {
    const user = this.usersService.findOne(createTicketDto.reporterId);
    const ticket: Ticket = {
      id: this.nextTicketId++,
      subject: createTicketDto.subject,
      description: createTicketDto.description,
      reporterId: createTicketDto.reporterId,
      priority: createTicketDto.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    this.tickets.push(ticket);

    return ticket;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = this.findOne(id);

    if (ticket.status === 'closed')
      throw new TicketCloseExceptions('Closed ticket cannot be updated!');

    Object.assign(ticket, updateTicketDto);

    return ticket;
  }

  closeTicket(id: number) {
    const ticket = this.findOne(id);

    if (ticket.status === 'closed')
      throw new BadRequestException('Ticket is already closed');

    Object.assign(ticket, { status: 'closed' });

    return ticket;
  }

  stats() {
    const open = this.tickets.filter(
      (ticket) => ticket.status === 'open',
    ).length;

    return {
      open,
      closed: this.tickets.length - open,
      total: this.tickets.length,
    };
  }

  delete(id: number) {
    const ticket = this.findOne(id);
    this.tickets.splice(this.tickets.indexOf(ticket), 1);

    return ticket;
  }

  renect(limit: number, page: number) {
    return [...this.tickets]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, Math.min(limit, 50));
  }

  assertCanAccess(ticket: Ticket, user: PublicUser) {
    if (user.role === 'user' && ticket.reporterId !== user.id) {
      throw new ForbiddenException('You can only access your own tickets');
    }
  }
}
