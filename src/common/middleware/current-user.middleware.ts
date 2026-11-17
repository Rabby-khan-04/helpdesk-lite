import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PublicUser, toPublicUsers } from '../../users/public-user.js';
import { UsersService } from '../../users/users.service.js';

export interface AuthRequest extends Request {
  user?: PublicUser;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly users: UsersService) {}

  use(req: AuthRequest, _res: Response, next: NextFunction) {
    const id = req.headers['x-user-id'];

    if (typeof id === 'string' && id.length > 0) {
      try {
        req.user = toPublicUsers(this.users.findOne(id));
      } catch (error) {
        throw new UnauthorizedException('Unauthorized access');
      }
    }

    next();
  }
}
