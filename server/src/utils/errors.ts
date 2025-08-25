import { Prisma } from '@prisma/client';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

export enum ErrorCodes {
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE = 'DUPLICATE',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export function formatError(
  formattedError: GraphQLFormattedError,
  _: unknown,
): GraphQLFormattedError {
  switch (formattedError.extensions?.code) {
    case ErrorCodes.NOT_FOUND:
    case ErrorCodes.DUPLICATE:
    case ErrorCodes.UNAUTHORIZED:
      return {
        message: formattedError.message,
        extensions: formattedError.extensions,
      };
  }

  return formattedError;
}

export function handleGQLError(err: GraphQLError): GraphQLError {
  // TODO: Code to run when a GQL Error hits
  return err;
}

export class NotFoundError extends GraphQLError {
  constructor(entity: Prisma.ModelName, field: string, value: string) {
    super(`${entity} not found for ${field}: [${value}]`, {
      extensions: { code: ErrorCodes.NOT_FOUND, entity },
    });
  }
}

export class DuplicateError extends GraphQLError {
  constructor(entity: Prisma.ModelName, field: string, value: string) {
    super(`${entity} already exists for ${field}: [${value}]`, {
      extensions: { code: ErrorCodes.DUPLICATE, entity },
    });
  }
}

export class UnAuthorizedError extends GraphQLError {
  constructor() {
    super(`Unauthorized`, {
      extensions: { code: ErrorCodes.UNAUTHORIZED },
    });
  }
}
