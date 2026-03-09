import { NotFoundException } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';
import { DrizzleDB } from '../drizzle/drizzle.module';

/**
 * Abstract base service that provides common CRUD operations for any Drizzle
 * Postgres table whose primary key column is a `varchar` named `id`.
 *
 * Subclasses only need to supply the Drizzle DB instance, the table reference,
 * and a human-readable entity name — everything else is inherited.
 *
 * TSelect = inferred SELECT model  (e.g. `Book`)
 * TInsert = inferred INSERT model  (e.g. `NewBook`)
 * TTable  = the Drizzle table type (e.g. `typeof books`)
 */
export abstract class BaseService<
  TSelect extends { id: string },
  TInsert extends { id: string },
  TTable extends PgTable & { id: any },
> {
  protected abstract readonly db: DrizzleDB;
  protected abstract readonly table: TTable;
  protected abstract readonly entityName: string;

  // ── Read ────────────────────────────────────────────────────

  async findAll(): Promise<TSelect[]> {
    console.log(`  \x1b[33m[DB Query]\x1b[0m SELECT * FROM ${this.entityName}`);
    return this.db.select().from(this.table as any) as unknown as Promise<TSelect[]>;
  }

  async findById(id: string): Promise<TSelect | null> {
    console.log(`  \x1b[33m[DB Query]\x1b[0m SELECT * FROM ${this.entityName} WHERE id = '${id}'`);
    const rows: any[] = await (this.db
      .select()
      .from(this.table as any)
      .where(eq(this.table.id, id)) as any);
    return (rows[0] as TSelect) ?? null;
  }

  async findByIds(ids: string[]): Promise<TSelect[]> {
    console.log(
      `  \x1b[32m[DB Query - BATCH]\x1b[0m SELECT * FROM ${this.entityName} WHERE id IN (${ids.map(i => `'${i}'`).join(', ')})`,
    );
    return this.db
      .select()
      .from(this.table as any)
      .where(inArray(this.table.id, ids)) as unknown as Promise<TSelect[]>;
  }

  // ── Create ──────────────────────────────────────────────────

  async create(input: Partial<TInsert>): Promise<TSelect> {
    const rows: any[] = await (this.db
      .insert(this.table)
      .values({ id: (input as any).id || uuidv4(), ...input } as any)
      .returning() as any);
    return rows[0] as TSelect;
  }

  // ── Update ──────────────────────────────────────────────────

  async update(id: string, input: Partial<TInsert>): Promise<TSelect> {
    const rows: any[] = await (this.db
      .update(this.table)
      .set(input as any)
      .where(eq(this.table.id, id))
      .returning() as any);
    if (!rows.length) {
      throw new NotFoundException(`${this.entityName} with id "${id}" not found`);
    }
    return rows[0] as TSelect;
  }
}
