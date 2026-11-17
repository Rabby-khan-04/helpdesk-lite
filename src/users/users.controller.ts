import {
  Body,
  Controller,
  Get,
  Inject,
  Optional,
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
import { toPublicUsers } from './public-user.js';
import type { AppConfig } from './users.interface.js';
import { UsersService } from './users.service.js';

@Controller({ path: 'users' })
export class UsersController {
  constructor(
    private users: UsersService,
    @Inject('TEST_CONFIG') private config: AppConfig,

    // If nothing register as HTTP_OPTIONS then nest give undefined, don't through errors;
    @Optional() @Inject('HTTP_OPTIONS') private options: unknown,
  ) {}

  @Get()
  findAll(@Query() filter: FilterUserQueryDto) {
    return this.users.findAll(filter.gender);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return toPublicUsers(this.users.findOne(id));
  }

  @Post()
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateUserDto,
  ) {
    const user = await this.users.create(dto);

    res.cookie('user', { email: user.email, password: user.password });

    return toPublicUsers(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Patch(':id/email')
  updateEmail(@Param('id') id: string, @Body() emailDto: updateEmailDto) {
    return this.users.updateEmail(id, emailDto);
  }

  @Get('/config')
  getConfig() {
    return this.config;
  }
}
