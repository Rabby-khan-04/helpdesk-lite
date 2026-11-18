import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';
import { PasswordHasher } from './password-hasher.js';

@Injectable()
export class Argon2PasswordHasher implements PasswordHasher {
  hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }

  verify(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }
}
