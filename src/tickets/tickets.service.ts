import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorCode } from '../common/error-codes.js';
import { PublicUser } from '../users/public-user.js';
import { UsersService } from '../users/users.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { TicketCloseExceptions } from './exceptions/ticket-close.exceptions.js';
import { Ticket } from './ticket.interface.js';
import { TicketFilter, TicketsRepository } from './tickets.repository.js';

@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersService: UsersService,
  ) {}

  findAll(filters: TicketFilter): Promise<Ticket[]> {
    return this.ticketsRepository.findAll(filters);
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket)
      throw new NotFoundException(`Ticket with Id: ${id} not found`, {
        errorCode: ErrorCode.TicketNotFound,
      });

    return ticket;
  }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    await this.usersService.findOne(createTicketDto.reporterId);

    return this.ticketsRepository.create({
      subject: createTicketDto.subject,
      description: createTicketDto.description,
      reporterId: createTicketDto.reporterId,
      priority: createTicketDto.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (ticket.status === 'closed')
      throw new TicketCloseExceptions('Closed ticket cannot be updated!');

    return this.ticketsRepository.update(id, updateTicketDto);
  }

  async closeTicket(id: number): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (ticket.status === 'closed')
      throw new BadRequestException('Ticket is already closed');

    return this.ticketsRepository.update(id, { status: 'closed' });
  }

  async stats() {
    const tickets = await this.ticketsRepository.findAll({});
    const open = tickets.filter((ticket) => ticket.status === 'open').length;

    return {
      open,
      closed: tickets.length - open,
      total: tickets.length,
    };
  }

  async delete(id: number): Promise<Ticket> {
    const ticket = await this.findOne(id);

    await this.ticketsRepository.remove(id);

    return ticket;
  }

  async renect(limit: number, page: number): Promise<Ticket[]> {
    const tickets = await this.ticketsRepository.findAll({});

    return tickets
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, Math.min(limit, 50));
  }

  assertCanAccess(ticket: Ticket, user: PublicUser) {
    if (user.role === 'user' && ticket.reporterId !== user.id) {
      throw new ForbiddenException('You can only access your own tickets');
    }
  }
}
