import { User } from './users.interface.js';

export type PublicUser = Omit<User, 'password'>;

export function toPublicUsers(user: User): PublicUser {
  const { password: _password, ...rest } = user;

  return rest;
}
