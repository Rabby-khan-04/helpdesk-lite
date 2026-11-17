import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PublicUser } from '../../users/public-user.js';

export const User = createParamDecorator(
  (data: keyof PublicUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as PublicUser | undefined;

    return data ? user?.[data] : user;
  },
);
