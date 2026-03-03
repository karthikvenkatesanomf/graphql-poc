import DataLoader from 'dataloader';

/**
 * Typed DataLoader map — one set of loaders is created per
 * incoming GraphQL request via the context factory.
 *
 * This is the key mechanism that solves the N+1 problem:
 * instead of loading one author per book, the DataLoader
 * batches all author-IDs from a single request tick into
 * one bulk lookup.
 */
export interface IDataLoaders {
  /** Batch-load authors by their IDs */
  authorLoader: DataLoader<string, AuthorEntity | undefined>;

  /** Batch-load books grouped by authorId */
  booksByAuthorLoader: DataLoader<string, BookEntity[]>;
}

/* ── Lightweight entity shapes matching the JSON data ────── */

export interface AuthorEntity {
  id: string;
  name: string;
  bio?: string;
  birthDate?: string;
  nationality?: string;
}

export interface BookEntity {
  id: string;
  title: string;
  description?: string;
  price: number;
  isbn: string;
  authorId: string;
  genre: string;
  status: string;
  publishedDate?: string;
  rating?: number;
  pages?: number;
}
