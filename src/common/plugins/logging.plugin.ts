import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';

/**
 * Apollo Server plugin that logs every GraphQL operation for
 * observability. In production, swap console logging for a
 * structured logger (e.g. Winston / Pino).
 */
@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger('GraphQL');

  async requestDidStart(): Promise<GraphQLRequestListener<Record<string, unknown>>> {
    const logger = this.logger;
    const start = Date.now();

    return {
      async willSendResponse() {
        const duration = Date.now() - start;
        logger.log(`Request completed in ${duration}ms`);
      },

      async didEncounterErrors(ctx) {
        for (const err of ctx.errors) {
          logger.error(`GraphQL Error: ${err.message}`, err.extensions?.stacktrace);
        }
      },
    };
  }
}
