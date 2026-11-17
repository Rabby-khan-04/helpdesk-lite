import { Ticket } from './ticket.interface.js';

export interface TicketFilter {
  status?: Ticket['status'];
  priority?: Ticket['priority'];
  reporterId?: string;
}

export abstract class TicketsRepository {
  abstract findAll(filters: TicketFilter): Promise<Ticket[]>;
  abstract findOne(id: number): Promise<Ticket | undefined>;
  abstract create(data: Omit<Ticket, 'id'>): Promise<Ticket>;
  abstract update(
    id: number,
    data: Partial<Omit<Ticket, 'id'>>,
  ): Promise<Ticket>;
  abstract closeTicket(id: number): Promise<Ticket>;
  abstract stats(): Promise<{ open: number; closed: number; total: number }>;
  abstract renect(limit?: number, page?: number): Promise<Ticket[]>;
}
