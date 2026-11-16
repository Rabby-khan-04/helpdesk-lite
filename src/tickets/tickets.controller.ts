import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { FilterTicketsQueryDto } from './dto/filter-tickets-query.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { StaffGuard } from './guards/staff.guard.js';
import { TicketsService } from './tickets.service.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Get()
  findAll(@Query() filters: FilterTicketsQueryDto) {
    return this.ticketService.findAll(filters.status, filters.priority);
  }

  @Get(':id')
  @Header('Cache-Control', 'no-store')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.findOne(id);
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, updateTicketDto);
  }

  // Scopped for only the close route, but for now it's dead weight, cause the app module used it with APP_FILTER
  // @UseFilters(HttpExceptionFilter)
  @UseGuards(StaffGuard)
  @Patch(':id/close')
  // @HttpCode(204)
  closeTicket(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.closeTicket(id);
  }
}
