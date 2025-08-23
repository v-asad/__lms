import { handleGQLError } from '@/utils/errors';
import { GraphQLError } from 'graphql';

export function HandleErrors() {
  return function (constructor: Function) {
    for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
      if (key === 'constructor') continue;
      const original = constructor.prototype[key];
      if (typeof original !== 'function') continue;

      constructor.prototype[key] = async function (...args: any[]) {
        try {
          return await original.apply(this, args);
        } catch (err) {
          // TODO: Use Logger here
          if (err instanceof GraphQLError) {
            throw handleGQLError(err);
          }

          throw err; // To be caught by Apollo Server
        }
      };
    }
  };
}
