import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Ticket } from '../ticket.interface.js';
import { TicketsService } from '../tickets.service.js';

@Injectable()
export class TicketByIdPipe implements PipeTransform<string, Ticket> {
  constructor(private ticketService: TicketsService) {}

  transform(value: string): Ticket {
    const id = Number.parseInt(value, 10);
    if (Number.isNaN(id)) throw new BadRequestException('Id must be a number');
    return this.ticketService.findOne(id);
  }
}
