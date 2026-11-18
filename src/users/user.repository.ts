import { User } from './users.interface.js';

export interface UserFilter {
  gender?: string;
}

export interface UpdateEmail {
  oldEmail: string;
  newEmail: string;
}

export abstract class UserRepository {
  abstract findAll(filters: UserFilter): Promise<User[]>;
  abstract findById(id: string): Promise<User | undefined>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract create(data: User): Promise<User>;
  abstract update(id: string, data: Partial<Omit<User, 'id'>>): Promise<User>;
  abstract updateEmail(id: string, data: UpdateEmail): Promise<User>;
}
