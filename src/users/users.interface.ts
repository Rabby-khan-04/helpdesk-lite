import { Role } from './role.js';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
  photo?: string;
  age: number;
  gender: string;
}

export interface AppConfig {
  port: number;
  host: string;
  me: string;
}
