import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator.js';
import { AuthRequest } from '../middleware/current-user.middleware.js';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride(Roles, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!roles) return true;

    const { user } = ctx.switchToHttp().getRequest<AuthRequest>();

    if (!user) throw new UnauthorizedException('Login required!!');

    if (roles.length > 0 && !roles.includes(user.role)) {
      throw new ForbiddenException('Access Denied!!');
    }

    return true;
  }
}
