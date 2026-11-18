import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  type Ticket as TicketRow,
} from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Ticket } from './ticket.interface.js';
import { TicketFilter, TicketsRepository } from './tickets.repository.js';

@Injectable()
export class PrismaTicketsRepository implements TicketsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: TicketFilter): Promise<Ticket[]> {
    const rows = await this.prisma.ticket.findMany({
      where: {
        status: filters.status,
        priority: filters.priority,
        reporterId: filters.reporterId,
      },
      orderBy: { id: 'asc' },
    });

    return rows.map(toTicket);
  }

  async findOne(id: number): Promise<Ticket | undefined> {
    const row = await this.prisma.ticket.findUnique({ where: { id } });
    return row ? toTicket(row) : undefined;
  }

  async create(data: Omit<Ticket, 'id'>): Promise<Ticket> {
    const row = await this.prisma.ticket.create({ data });
    return toTicket(row);
  }

  async update(id: number, data: Partial<Omit<Ticket, 'id'>>): Promise<Ticket> {
    // createdAt is set once, by the clock, when the ticket is created.
    const { createdAt: _ignored, ...rest } = data;

    try {
      const row = await this.prisma.ticket.update({
        where: { id },
        data: rest,
      });
      return toTicket(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Ticket with Id: ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    // deleteMany instead of delete: same "silently does nothing when the row is
    // gone" behaviour as the in-memory adapter, instead of P2025.
    await this.prisma.ticket.deleteMany({ where: { id } });
  }

  async closeTicket(id: number): Promise<Ticket> {
    // One statement does the check and the write, so two concurrent closes
    // cannot both see status = 'open'. Doing findOne-then-update in application
    // code leaves that window open.
    const { count } = await this.prisma.ticket.updateMany({
      where: { id, status: 'open' },
      data: { status: 'closed' },
    });

    if (count === 0) {
      const exists = await this.prisma.ticket.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!exists) {
        throw new NotFoundException(`Ticket with Id: ${id} not found`);
      }

      throw new BadRequestException('Ticket is already closed');
    }

    const row = await this.prisma.ticket.findUniqueOrThrow({ where: { id } });
    return toTicket(row);
  }

  async stats(): Promise<{ open: number; closed: number; total: number }> {
    const groups = await this.prisma.ticket.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const open =
      groups.find((group) => group.status === 'open')?._count._all ?? 0;
    const closed =
      groups.find((group) => group.status === 'closed')?._count._all ?? 0;

    return { open, closed, total: open + closed };
  }
}

// The row is the database shape, Ticket is the domain shape. Spelling the
// fields out keeps the boundary honest: adding `include: { reporter: true }`
// later cannot leak extra columns (or a password) into an API response.
function toTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    reference: row.reference,
    subject: row.subject,
    description: row.description,
    priority: row.priority,
    status: row.status,
    createdAt: row.createdAt,
    reporterId: row.reporterId,
  };
}
