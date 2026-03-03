import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

/**
 * Custom DateTime scalar for parsing / serialising date values
 * in ISO-8601 format across the GraphQL boundary.
 */
@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = 'DateTime custom scalar — ISO-8601 string ↔ JS Date';

  parseValue(value: unknown): Date {
    return new Date(value as string);
  }

  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return new Date(value as string).toISOString();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return new Date();
  }
}
