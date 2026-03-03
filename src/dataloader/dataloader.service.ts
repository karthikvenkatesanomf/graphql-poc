import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { AuthorsService } from '../authors/authors.service';
import { BooksService } from '../books/books.service';
import {
  IDataLoaders,
  AuthorEntity,
  BookEntity,
} from './dataloader.interface';

/**
 * Creates a fresh set of DataLoader instances per request.
 *
 * WHY DataLoader?
 * ───────────────
 * When a query fetches a list of books and each book resolves
 * its `author` field, without DataLoader we'd fire N individual
 * lookups (one per book). DataLoader collects all IDs from the
 * current event-loop tick and issues a single batch call.
 *
 * The same applies in reverse: an Author's `books` field
 * resolver uses booksByAuthorLoader to batch-load books for
 * multiple authors at once.
 */
@Injectable()
export class DataLoaderService {
  constructor(
    private readonly authorsService: AuthorsService,
    private readonly booksService: BooksService,
  ) {}

  /**
   * Call once per request (from the GraphQL context factory)
   * to get per-request caching + batching.
   */
  createLoaders(): IDataLoaders {
    return {
      // ── Author by ID (used by Book.author field resolver) ──
      authorLoader: new DataLoader<string, AuthorEntity | undefined>(
        async (ids: readonly string[]) => {
          const authors = this.authorsService.findByIds([...ids]);
          const authorMap = new Map(authors.map((a) => [a.id, a]));
          // Return in same order as requested IDs
          return ids.map((id) => authorMap.get(id));
        },
      ),

      // ── Books by authorId (used by Author.books field resolver) ─
      booksByAuthorLoader: new DataLoader<string, BookEntity[]>(
        async (authorIds: readonly string[]) => {
          const allBooks = this.booksService.findByAuthorIds([...authorIds]);
          // Group books by authorId, preserving requested order
          return authorIds.map((authorId) =>
            allBooks.filter((b) => b.authorId === authorId),
          );
        },
      ),
    };
  }
}
