import { User } from './users.interface.js';

export interface UserFilter {
  gender?: string;
}

// The port. Storage only - rules live in UsersService.
export abstract class UsersRepository {
  abstract findAll(filters: UserFilter): Promise<User[]>;
  abstract findById(id: string): Promise<User | undefined>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract create(data: Omit<User, 'id'>): Promise<User>;
  abstract update(id: string, data: Partial<Omit<User, 'id'>>): Promise<User>;
}
