import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto.js';
import { FilterUserQueryDto } from './dto/filter-user-query.dto.js';
import { updateEmailDto, UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@Controller({ path: 'users' })
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  findAll(@Query() filter: FilterUserQueryDto) {
    return this.users.findAll(filter.gender);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Post()
  create(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateUserDto,
  ) {
    const user = this.users.create(dto);

    res.cookie('user', { email: user.email, password: user.password });

    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Patch(':id/email')
  updateEmail(@Param('id') id: string, @Body() emailDto: updateEmailDto) {
    return this.users.updateEmail(id, emailDto);
  }
}
