import { Ticket } from './ticket.interface.js';

export interface TicketFilter {
  status?: Ticket['status'];
  priority?: Ticket['priority'];
  reporterId?: string;
}

// The port. Storage only - business rules live in TicketsService.
export abstract class TicketsRepository {
  abstract findAll(filters: TicketFilter): Promise<Ticket[]>;
  abstract findById(id: number): Promise<Ticket | undefined>;
  abstract create(data: Omit<Ticket, 'id'>): Promise<Ticket>;
  abstract update(
    id: number,
    data: Partial<Omit<Ticket, 'id'>>,
  ): Promise<Ticket>;
  abstract remove(id: number): Promise<void>;
}
