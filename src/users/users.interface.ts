export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
