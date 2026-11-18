import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import argon2 from 'argon2';
import { ErrorCode } from '../common/error-codes.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { updateEmailDto, UpdateUserDto } from './dto/update-user.dto.js';
import { UserFilter, UserRepository } from './user.repository.js';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}

  async findAll(filters: UserFilter) {
    return await this.userRepo.findAll(filters);
  }

  async findOne(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user)
      throw new NotFoundException(`User with id: ${id} not found`, {
        errorCode: 'BATPAR_INCOMING',
      });

    return user;
  }

  async create(dto: CreateUserDto) {
    const exist = await this.userRepo.findByEmail(dto.email);

    if (exist)
      throw new ConflictException(
        `User with email: ${dto.email} already exists`,
        { errorCode: ErrorCode.EmailTaken },
      );

    return this.userRepo.create({
      name: dto.name,
      gender: dto.gender,
      age: dto.age,
      email: dto.email,
      password: await argon2.hash(dto.password),
      photo: dto.photo ?? '',
      role: 'user',
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    return this.userRepo.update(id, dto);
  }

  async updateEmail(id: string, emailDto: updateEmailDto) {
    const user = await this.findOne(id);

    if (user.email !== emailDto.oldEmail)
      throw new UnauthorizedException('Unauthorized Access!!');

    return this.userRepo.updateEmail(id, emailDto);
  }
}
