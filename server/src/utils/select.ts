// decorators/provide-fields.decorator.ts
import { createParameterDecorator } from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo } from 'graphql';

export type PrismaSelection<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? { select: PrismaSelection<U> } // relations (arrays)
    : T[K] extends object
      ? { select: PrismaSelection<T[K]> } // relations (single objects)
      : true; // scalars
};

function normalize<T>(obj: Record<string, unknown>): PrismaSelection<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (typeof v === 'object' && v && Object.keys(v as object).length > 0) {
        return [k, { select: normalize(v as Record<string, unknown>) }];
      }
      return [k, true];
    }),
  ) as PrismaSelection<T>;
}

export function ProvideFields<T>() {
  return createParameterDecorator<GraphQLResolveInfo>(({ info }) => {
    const raw = graphqlFields(info) as Record<string, unknown>;
    return normalize<T>(raw) as PrismaSelection<T>;
  });
}
