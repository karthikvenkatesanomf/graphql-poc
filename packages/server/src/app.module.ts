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
      context: ({ req }: { req: any }) => {
        const useDataLoader = req?.headers?.['x-use-dataloader'] === 'true';
        console.log(`\n${'='.repeat(60)}`);
        console.log(useDataLoader
          ? '\x1b[32m📦 MODE: WITH DataLoader ✅\x1b[0m'
          : '\x1b[31m🐌 MODE: WITHOUT DataLoader (N+1) ❌\x1b[0m');
        console.log('='.repeat(60));
        return { useDataLoader };
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
