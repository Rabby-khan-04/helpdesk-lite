import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ticket } from './ticket.interface.js';
import { TicketFilter, TicketsRepository } from './tickets.repository.js';

@Injectable()
export class InMemoryTicketsRepository implements TicketsRepository {
  private readonly tickets: Ticket[] = [
    {
      id: 1,
      subject: 'Cannot login to account',
      description: 'User cannot access the dashboard after login.',
      reporterId: 'u001',
      priority: 'high',
      status: 'open',
      createdAt: new Date('2026-09-01T10:00:00.000Z'),
      reference: 'tkt_seed0001',
    },
    {
      id: 2,
      subject: 'Payment failed',
      description: 'Card payment fails at the checkout step.',
      reporterId: 'u002',
      priority: 'medium',
      status: 'open',
      createdAt: new Date('2026-09-01T11:30:00.000Z'),
      reference: 'tkt_seed0002',
    },
    {
      id: 3,
      subject: 'Invoice download not working',
      description: 'Invoice PDF download returns an empty file.',
      reporterId: 'u003',
      priority: 'low',
      status: 'closed',
      createdAt: new Date('2026-09-01T12:45:00.000Z'),
      reference: 'tkt_seed00010',
    },
    {
      id: 4,
      subject: 'Password reset email not arriving',
      description: 'Reset email never arrives in inbox or spam folder.',
      reporterId: 'u004',
      priority: 'high',
      status: 'open',
      createdAt: new Date('2026-09-02T08:15:00.000Z'),
      reference: 'tkt_seed0003',
    },
    {
      id: 5,
      subject: 'Profile photo upload fails',
      description: 'Uploading a JPEG avatar returns a 500 error.',
      reporterId: 'u005',
      priority: 'medium',
      status: 'open',
      createdAt: new Date('2026-09-02T09:40:00.000Z'),
      reference: 'tkt_seed0004',
    },
    {
      id: 6,
      subject: 'Two-factor authentication code invalid',
      description: 'Valid 2FA code from authenticator app is rejected.',
      reporterId: 'u001',
      priority: 'high',
      status: 'open',
      createdAt: new Date('2026-09-02T14:05:00.000Z'),
      reference: 'tkt_seed0005',
    },
    {
      id: 7,
      subject: 'Search returns no results',
      description: 'Searching for existing tickets shows an empty list.',
      reporterId: 'u002',
      priority: 'medium',
      status: 'closed',
      createdAt: new Date('2026-09-03T07:20:00.000Z'),
      reference: 'tkt_seed0006',
    },
    {
      id: 8,
      subject: 'App crashes on startup',
      description: 'Mobile app closes immediately on launch on Android 14.',
      reporterId: 'u003',
      priority: 'high',
      status: 'open',
      createdAt: new Date('2026-09-03T10:55:00.000Z'),
      reference: 'tkt_seed0007',
    },
    {
      id: 9,
      subject: 'Dark mode text unreadable',
      description: 'Some labels appear white-on-white in dark mode.',
      reporterId: 'u004',
      priority: 'low',
      status: 'closed',
      createdAt: new Date('2026-09-03T16:30:00.000Z'),
      reference: 'tkt_seed0008',
    },
    {
      id: 10,
      subject: 'Notification emails duplicated',
      description: 'Each ticket update sends two identical emails.',
      reporterId: 'u005',
      priority: 'medium',
      status: 'open',
      createdAt: new Date('2026-09-04T09:10:00.000Z'),
      reference: 'tkt_seed0009',
    },
  ];
  private nextTicketId = 11;

  async findAll(filters: TicketFilter): Promise<Ticket[]> {
    let tickets = this.tickets;

    if (filters.status)
      tickets = tickets.filter((ticket) => ticket.status === filters.status);

    if (filters.priority)
      tickets = tickets.filter(
        (ticket) => ticket.priority === filters.priority,
      );

    if (filters.reporterId)
      tickets = tickets.filter(
        (ticket) => ticket.reporterId === filters.reporterId,
      );

    return [...tickets];
  }

  async findOne(id: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    return ticket;
  }

  async create(data: Omit<Ticket, 'id'>): Promise<Ticket> {
    const ticket: Ticket = {
      id: this.nextTicketId++,
      ...data,
    };

    this.tickets.push(ticket);

    return ticket;
  }

  async update(id: number, data: Partial<Omit<Ticket, 'id'>>): Promise<Ticket> {
    const ticket = this.tickets.find((candidate) => candidate.id === id);

    if (!ticket) {
      // Callers check findById first; this guards against misuse.
      throw new Error(`Ticket with id: ${id} not found`);
    }

    Object.assign(ticket, data);

    return ticket;
  }

  async remove(id: number): Promise<void> {
    const index = this.tickets.findIndex((ticket) => ticket.id === id);

    if (index !== -1) this.tickets.splice(index, 1);
  }

  async closeTicket(id: number): Promise<Ticket> {
    const ticket = await this.findOne(id);
    if (!ticket) throw new NotFoundException(`Ticket with Id: ${id} not found`);

    if (ticket.status === 'closed')
      throw new BadRequestException('Ticket is already closed');

    Object.assign(ticket, { status: 'closed' });
    return ticket;
  }

  async stats(): Promise<{ open: number; closed: number; total: number }> {
    const open = this.tickets.filter(
      (ticket) => ticket.status === 'open',
    ).length;

    return {
      open,
      closed: this.tickets.length - open,
      total: this.tickets.length,
    };
  }
}
