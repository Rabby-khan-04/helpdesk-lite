import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { Ticket } from './ticket.interface.js';

@Injectable()
export class TicketsService {
  constructor(private usersService: UsersService) {}
  private readonly tickets: Ticket[] = [
    {
      id: 1,
      subject: 'Cannot login to account',
      description: 'User cannot access the dashboard after login.',
      reporterId: 'u001',
      priority: 'high',
      status: 'open',
      createdAt: '2026-09-01T10:00:00.000Z',
    },
    {
      id: 2,
      subject: 'Payment failed',
      description: 'Card payment fails at the checkout step.',
      reporterId: 'u002',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-09-01T11:30:00.000Z',
    },
    {
      id: 3,
      subject: 'Invoice download not working',
      description: 'Invoice PDF download returns an empty file.',
      reporterId: 'u003',
      priority: 'low',
      status: 'closed',
      createdAt: '2026-09-01T12:45:00.000Z',
    },
    {
      id: 4,
      subject: 'Password reset email not arriving',
      description: 'Reset email never arrives in inbox or spam folder.',
      reporterId: 'u004',
      priority: 'high',
      status: 'open',
      createdAt: '2026-09-02T08:15:00.000Z',
    },
    {
      id: 5,
      subject: 'Profile photo upload fails',
      description: 'Uploading a JPEG avatar returns a 500 error.',
      reporterId: 'u005',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-09-02T09:40:00.000Z',
    },
    {
      id: 6,
      subject: 'Two-factor authentication code invalid',
      description: 'Valid 2FA code from authenticator app is rejected.',
      reporterId: 'u001',
      priority: 'high',
      status: 'open',
      createdAt: '2026-09-02T14:05:00.000Z',
    },
    {
      id: 7,
      subject: 'Search returns no results',
      description: 'Searching for existing tickets shows an empty list.',
      reporterId: 'u002',
      priority: 'medium',
      status: 'closed',
      createdAt: '2026-09-03T07:20:00.000Z',
    },
    {
      id: 8,
      subject: 'App crashes on startup',
      description: 'Mobile app closes immediately on launch on Android 14.',
      reporterId: 'u003',
      priority: 'high',
      status: 'open',
      createdAt: '2026-09-03T10:55:00.000Z',
    },
    {
      id: 9,
      subject: 'Dark mode text unreadable',
      description: 'Some labels appear white-on-white in dark mode.',
      reporterId: 'u004',
      priority: 'low',
      status: 'closed',
      createdAt: '2026-09-03T16:30:00.000Z',
    },
    {
      id: 10,
      subject: 'Notification emails duplicated',
      description: 'Each ticket update sends two identical emails.',
      reporterId: 'u005',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-09-04T09:10:00.000Z',
    },
  ];
  private nextTicketId = 4;

  findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
    let tickets = this.tickets;

    if (status) tickets = tickets.filter((ticket) => ticket.status === status);

    if (priority)
      tickets = tickets.filter((ticket) => ticket.priority === priority);

    return tickets;
  }

  findOne(id: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);

    if (!ticket) throw new NotFoundException(`Ticket with Id: ${id} not found`);

    return ticket;
  }

  create(createTicketDto: CreateTicketDto) {
    const user = this.usersService.findOne(createTicketDto.reporterId);
    console.log(user);
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
      throw new BadRequestException('Closed ticket cannot be updated!');

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
}
