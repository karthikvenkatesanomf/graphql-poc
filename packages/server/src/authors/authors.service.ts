import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../drizzle/drizzle.module';
import { authors, Author, NewAuthor } from '../drizzle/schema';
import { BaseService } from '../common/base.service';

@Injectable()
export class AuthorsService extends BaseService<Author, NewAuthor, typeof authors> {
  protected readonly table = authors;
  protected readonly entityName = 'authors';

  constructor(@Inject(DRIZZLE) protected readonly db: DrizzleDB) {
    super();
  }

  // ── Author-specific methods ─────────────────────────────────

  async findByField(field: keyof Author, value: string): Promise<Author[]> {
    console.log(`  \x1b[33m[DB Query]\x1b[0m SELECT * FROM authors WHERE ${String(field)} = '${value}'`);
    const col = authors[field as keyof typeof authors];
    if (!col) return [];
    return this.db.select().from(authors).where(eq(col as any, value));
  }
}
