import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DRIZZLE = Symbol('DRIZZLE');
export type DrizzleDB = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const pool = new Pool({
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 5433),
          user: config.get<string>('DB_USERNAME', 'graphql_user'),
          password: config.get<string>('DB_PASSWORD', 'graphql_pass'),
          database: config.get<string>('DB_NAME', 'bookstore'),
        });
        console.log('✅ Drizzle ORM connected to PostgreSQL');
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
