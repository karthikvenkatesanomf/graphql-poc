import { pgTable, varchar, text, decimal, integer } from 'drizzle-orm/pg-core';

// ── Authors table ───────────────────────────────────────────
export const authors = pgTable('authors', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  bio: text('bio'),
  birthDate: varchar('birth_date'),
  nationality: varchar('nationality'),
});

// ── Books table ─────────────────────────────────────────────
export const books = pgTable('books', {
  id: varchar('id').primaryKey(),
  title: varchar('title').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isbn: varchar('isbn').unique().notNull(),
  authorId: varchar('author_id').notNull().references(() => authors.id),
  genre: varchar('genre').notNull(),
  status: varchar('status').notNull().default('DRAFT'),
  publishedDate: varchar('published_date'),
  rating: decimal('rating', { precision: 3, scale: 1 }),
  pages: integer('pages'),
});

// ── Inferred TypeScript types ───────────────────────────────
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Author = InferSelectModel<typeof authors>;
export type NewAuthor = InferInsertModel<typeof authors>;

export type Book = InferSelectModel<typeof books>;
export type NewBook = InferInsertModel<typeof books>;
