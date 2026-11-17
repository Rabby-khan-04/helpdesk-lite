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
import { User } from './users.interface.js';
import { UserFilter, UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll(filters: UserFilter): Promise<User[]> {
    return this.usersRepository.findAll(filters);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user)
      throw new NotFoundException(`User with id: ${id} not found`, {
        errorCode: 'BATPAR_INCOMING',
      });

    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const exist = await this.usersRepository.findByEmail(dto.email);

    if (exist)
      throw new ConflictException(
        `User with email: ${dto.email} already exists`,
        { errorCode: ErrorCode.EmailTaken },
      );

    return this.usersRepository.create({
      name: dto.name,
      gender: dto.gender,
      age: dto.age,
      email: dto.email,
      password: await argon2.hash(dto.password),
      photo: dto.photo ?? '',
      role: 'user',
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    return this.usersRepository.update(id, dto);
  }

  async updateEmail(id: string, emailDto: updateEmailDto): Promise<User> {
    const user = await this.findOne(id);

    if (user.email !== emailDto.oldEmail)
      throw new UnauthorizedException('Unauthorized Access!!');

    return this.usersRepository.update(id, { email: emailDto.newEmail });
  }
}
