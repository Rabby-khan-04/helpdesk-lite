import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import type { Response } from 'express';
import { Private } from '../common/decorators/private.decorator.js';
import { ResponseMessage } from '../common/decorators/response-message.decorator.js';
import { CurrentUser } from '../common/decorators/user.decorator.js';
import { ZodValidationPipea } from '../common/pipes/zod-validation.pipe.js';
import { WithMessage } from '../common/response.interceptor.js';
import type { PublicUser } from '../users/public-user.js';
import { FilterTicketsQueryDto } from './dto/filter-tickets-query.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { TicketByIdPipe } from './pipe/ticket-by-id.pipe.js';
import {
  createTicketSchema,
  type CreateTicketInput,
} from './schema/ticket-schema.js';
import type { Ticket } from './ticket.interface.js';
import { TicketsService } from './tickets.service.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Private('admin')
  @Get()
  findAll(@Query() filters: FilterTicketsQueryDto) {
    return this.ticketService.findAll({
      status: filters.status,
      priority: filters.priority,
    });
  }

  @Private('staff', 'admin')
  @Get('stats')
  stats() {
    return this.ticketService.stats();
  }

  @Get('recent')
  recent(
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.ticketService.renect(limit, page);
  }

  // @Get(':id')
  // @Header('Cache-Control', 'no-store')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.ticketService.findOne(id);
  // }

  @Private()
  @Get(':id')
  @Private('admin', 'staff', 'user')
  findOne(
    @Param('id', TicketByIdPipe) ticket: Ticket,
    @CurrentUser() user: PublicUser,
  ) {
    this.ticketService.assertCanAccess(ticket, user);
    return ticket;
  }

  @Post()
  @UsePipes(new ZodValidationPipea(createTicketSchema))
  async create(
    @Body() createTicketDto: CreateTicketInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ticket = await this.ticketService.create(createTicketDto);
    res.setHeader('Location', `/api/tickets/${ticket.id}`);
    return new WithMessage(`Ticket ${ticket.id} created!!`, ticket);
  }

  @ResponseMessage('Ticket updated')
  @Private()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, updateTicketDto);
  }

  // Scopped for only the close route, but for now it's dead weight, cause the app module used it with APP_FILTER
  // @UseFilters(HttpExceptionFilter)
  @ResponseMessage('Ticket closed')
  @Private('staff', 'admin')
  @Patch(':id/close')
  // @HttpCode(204)
  closeTicket(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.closeTicket(id);
  }

  @ResponseMessage('Ticket deleted')
  @Private('admin')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.delete(id);
  }
}
