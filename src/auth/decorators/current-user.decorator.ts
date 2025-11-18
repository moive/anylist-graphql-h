import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (roles = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: Request }>().req.user;

    if (!user)
      throw new InternalServerErrorException(
        'No user inside the request - make sure that we used the AuthGuard',
      );

    return user;
  },
);
