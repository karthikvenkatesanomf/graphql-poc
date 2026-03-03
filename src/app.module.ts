import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { DataLoaderModule } from './dataloader/dataloader.module';
import { DataLoaderService } from './dataloader/dataloader.service';
import { DateTimeScalar } from './common/scalars/date.scalar';
import { LoggingPlugin } from './common/plugins/logging.plugin';

@Module({
  imports: [
    // ── GraphQL (Schema-First with Apollo) ──────────────────
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataLoaderModule],
      inject: [DataLoaderService],
      useFactory: (dataLoaderService: DataLoaderService) => ({
        // Schema-first: load .graphql files
        typePaths: [join(__dirname, '**/*.graphql')],
        // Playground & introspection (disable in production)
        playground: process.env.NODE_ENV !== 'production',
        introspection: process.env.NODE_ENV !== 'production',
        // Per-request context with DataLoaders (solves N+1)
        context: () => ({
          loaders: dataLoaderService.createLoaders(),
        }),
        // Union & Interface type resolution
        resolvers: {
          SearchResult: {
            __resolveType(obj: Record<string, unknown>) {
              if ('title' in obj) return 'Book';
              if ('bio' in obj) return 'Author';
              return null;
            },
          },
          Node: {
            __resolveType(obj: Record<string, unknown>) {
              if ('title' in obj) return 'Book';
              if ('bio' in obj) return 'Author';
              return null;
            },
          },
        },
        // Production error formatting
        formatError: (error) => ({
          message: error.message,
          locations: error.locations,
          path: error.path,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        }),
        // Sort schema for deterministic output
        sortSchema: true,
      }),
    }),

    // ── Feature modules ─────────────────────────────────────
    AuthorsModule,
    BooksModule,
    DataLoaderModule,
  ],
  providers: [DateTimeScalar, LoggingPlugin],
  controllers: [],
})
export class AppModule {}
