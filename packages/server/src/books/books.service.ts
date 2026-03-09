import { Injectable, Inject } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../drizzle/drizzle.module';
import { books, Book, NewBook } from '../drizzle/schema';
import { BaseService } from '../common/base.service';

@Injectable()
export class BooksService extends BaseService<Book, NewBook, typeof books> {
  protected readonly table = books;
  protected readonly entityName = 'books';

  constructor(@Inject(DRIZZLE) protected readonly db: DrizzleDB) {
    super();
  }

  // ── Book-specific methods ───────────────────────────────────

  async findByAuthorId(authorId: string): Promise<Book[]> {
    console.log(`  \x1b[33m[DB Query]\x1b[0m SELECT * FROM books WHERE author_id = '${authorId}'`);
    return this.db.select().from(books).where(eq(books.authorId, authorId));
  }

  async findByAuthorIdsBatch(authorIds: string[]): Promise<Book[]> {
    console.log(`  \x1b[32m[DB Query - BATCH]\x1b[0m SELECT * FROM books WHERE author_id IN (${authorIds.map(i => `'${i}'`).join(', ')})`);
    return this.db.select().from(books).where(inArray(books.authorId, authorIds));
  }

  async findByGenre(genre: string): Promise<Book[]> {
    console.log(`  \x1b[33m[DB Query]\x1b[0m SELECT * FROM books WHERE genre = '${genre}'`);
    return this.db.select().from(books).where(eq(books.genre, genre));
  }
}
