import { Prisma } from '@prisma/client';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

enum Errors {
  NOT_FOUND = 'NOT_FOUND',
}

export function formatError(
  formattedError: GraphQLFormattedError,
  _: unknown,
): GraphQLFormattedError {
  switch (formattedError.extensions?.code) {
    case Errors.NOT_FOUND:
      return {
        message: formattedError.message,
        extensions: formattedError.extensions,
      };
  }

  return formattedError;
}

export class NotFoundError extends GraphQLError {
  constructor(entity: Prisma.ModelName, id: string) {
    super(`${entity} not found for ID: [${id}]`, {
      extensions: { code: Errors.NOT_FOUND, entity },
    });
  }
}
