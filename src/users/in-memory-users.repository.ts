import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UpdateEmail, UserFilter, UserRepository } from './user.repository.js';
import { User } from './users.interface.js';

@Injectable()
export class InMemoryUsersRepository implements UserRepository {
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

  async findAll(filters: UserFilter): Promise<User[]> {
    let users = this.users ?? [];

    if (filters?.gender)
      users = users.filter((user) => user.gender === filters?.gender);

    return [...users];
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const user: User = { id: randomUUID().slice(0, 8), ...data };
    this.users.push(user);
    return user;
  }

  async update(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    const user = this.users.find((candidate) => candidate.id === id);

    if (!user)
      throw new NotFoundException(`User with id: ${id} not found`, {
        errorCode: 'BATPAR_INCOMING',
      });

    Object.assign(user, { ...data });

    return user;
  }

  async updateEmail(id: string, data: UpdateEmail): Promise<User> {
    const user = this.users.find((candidate) => candidate.id === id);

    if (!user)
      throw new NotFoundException(`User with id: ${id} not found`, {
        errorCode: 'BATPAR_INCOMING',
      });

    Object.assign(user, { email: data.newEmail });

    return user;
  }
}
