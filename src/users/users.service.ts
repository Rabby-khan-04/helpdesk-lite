import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { Ticket } from '../tickets/ticket.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { updateEmailDto, UpdateUserDto } from './dto/update-user.dto.js';
import { PublicUser } from './public-user.js';
import { User } from './users.interface.js';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 'u001',
      name: 'Amina Staff',
      email: 'amina.staff@example.com',
      role: 'staff',
      password: 'placeholder_hash_1',
      age: 31,
      gender: 'female',
    },
    {
      id: 'u002',
      name: 'Adam Admin',
      email: 'adam.admin@example.com',
      role: 'admin',
      password: 'placeholder_hash_2',
      age: 40,
      gender: 'male',
    },
    {
      id: 'u003',
      name: 'Chen Wei',
      email: 'chen.wei@example.com',
      role: 'user',
      password: 'hashed_pw_chen_2024',
      photo: 'https://example.com/photos/chen.jpg',
      age: 41,
      gender: 'male',
    },
    {
      id: 'u004',
      name: 'Diana Kowalski',
      email: 'diana.kowalski@example.com',
      role: 'staff',
      password: 'hashed_pw_diana_2024',
      photo: 'https://example.com/photos/diana.jpg',
      age: 35,
      gender: 'female',
    },
    {
      id: 'u005',
      name: 'Emeka Okafor',
      email: 'emeka.okafor@example.com',
      role: 'user',
      password: 'hashed_pw_emeka_2024',
      // photo omitted (optional field)
      age: 24,
      gender: 'male',
    },
  ];

  findAll(gender?: string) {
    let users = this.users ?? [];

    if (gender) users = users.filter((user) => user.gender === gender);

    return users;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);

    if (!user)
      throw new NotFoundException(`User with id: ${id} not found`, {
        errorCode: 'BATPAR_INCOMING',
      });

    return user;
  }

  async create(dto: CreateUserDto) {
    const exist = this.users.find((user) => user.email === dto.email);

    if (exist)
      throw new ConflictException(
        `User with email: ${dto.email} already exists`,
      );
    const user: User = {
      id: randomUUID().slice(0, 8),
      name: dto.name,
      gender: dto.gender,
      age: dto.age,
      email: dto.email,
      password: await argon2.hash(dto.password),
      photo: dto.photo ?? '',
      role: 'user',
    };

    this.users.push(user);

    return user;
  }

  update(id: string, dto: UpdateUserDto) {
    const user = this.findOne(id);

    Object.assign(user, dto);

    return user;
  }

  updateEmail(id: string, emailDto: updateEmailDto) {
    const user = this.findOne(id);

    if (user.email !== emailDto.oldEmail)
      throw new UnauthorizedException('Unauthorized Access!!');

    Object.assign(user, { email: emailDto.newEmail });

    return user;
  }
}
