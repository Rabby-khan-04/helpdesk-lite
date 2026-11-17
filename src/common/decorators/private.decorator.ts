import { applyDecorators, Header } from '@nestjs/common';
import { Role } from '../../users/role.js';
import { Roles } from './roles.decorator.js';

export function Private(...roles: Role[]) {
  return applyDecorators(Roles(roles), Header('Cache-Control', 'no-store'));
}
