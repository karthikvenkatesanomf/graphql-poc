import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    user: process.env.DB_USERNAME || 'graphql_user',
    password: process.env.DB_PASSWORD || 'graphql_pass',
    database: process.env.DB_NAME || 'bookstore',
    ssl: false,
  },
});
