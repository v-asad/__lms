import { AuthContext } from '@/utils/auth';
import { UnAuthorizedError } from '@/utils/errors';
import { createMethodMiddlewareDecorator } from 'type-graphql';

export function Protected() {
  return createMethodMiddlewareDecorator<AuthContext>(
    async ({ context }, next) => {
      if (!context.user) {
        throw new UnAuthorizedError();
      }

      return next();
    },
  );
}
