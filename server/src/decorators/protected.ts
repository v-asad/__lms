import { AuthContext } from '@/utils/auth';
import { UnAuthorizedError } from '@/utils/errors';
import { createMethodMiddlewareDecorator } from 'type-graphql';

export function Protected(...permissionNames: string[]) {
  return createMethodMiddlewareDecorator<AuthContext>(
    async ({ context }, next) => {
      const { user, permissions } = context;

      if (!user) {
        throw new UnAuthorizedError();
      }

      // If no permissions specified, just check authentication
      if (permissionNames.length === 0) {
        return next();
      }

      // Require *all* listed permissions
      const missing = permissionNames.filter(
        (name) => !permissions.includes(name),
      );

      if (missing.length > 0) {
        throw new UnAuthorizedError(missing.join(', '));
      }

      return next();
    },
  );
}
