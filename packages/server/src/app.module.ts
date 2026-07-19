import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { join } from 'path';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [join(__dirname, '**/*.graphql')],
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      sortSchema: true,
      subscriptions: {
        'graphql-ws': true,
      },
      context: (ctx: {
        req?: { headers?: Record<string, string | string[] | undefined> };
        connectionParams?: Record<string, unknown>;
      }) => {
        const header =
          ctx.req?.headers?.['x-use-dataloader'] ??
          ctx.connectionParams?.['x-use-dataloader'];
        const useDataLoader =
          header === 'true' || header === true;
        const logReq = !!ctx.req;
        if (logReq) {
          console.log(`\n${'='.repeat(60)}`);
          console.log(
            useDataLoader
              ? '\x1b[32m📦 MODE: WITH DataLoader ✅\x1b[0m'
              : '\x1b[31m🐌 MODE: WITHOUT DataLoader (N+1) ❌\x1b[0m',
          );
          console.log('='.repeat(60));
        }
        // WebSocket subscriptions have no `req`; default to DataLoader on.
        return { useDataLoader: logReq ? useDataLoader : true };
      },
      plugins: [
    ApolloServerPluginCacheControl({ defaultMaxAge: 60 }),
  ],
    }),
    AuthorsModule,
    BooksModule,
  ],
})
export class AppModule {}
