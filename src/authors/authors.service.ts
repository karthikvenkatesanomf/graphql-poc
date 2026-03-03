import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AuthorEntity } from '../dataloader/dataloader.interface';
import authorsData from '../data/authors.json';

/**
 * In-memory service backed by static JSON data.
 * Replace with a real database / ORM in production.
 */
@Injectable()
export class AuthorsService {
  private authors: AuthorEntity[] = JSON.parse(JSON.stringify(authorsData));

  /* ── Read ───────────────────────────────────────────────── */

  findAll(): AuthorEntity[] {
    return this.authors;
  }

  findById(id: string): AuthorEntity | undefined {
    return this.authors.find((a) => a.id === id);
  }

  /**
   * Batch lookup used by DataLoader.
   * Returns authors whose id is in the given list — order may differ.
   */
  findByIds(ids: string[]): AuthorEntity[] {
    const idSet = new Set(ids);
    return this.authors.filter((a) => idSet.has(a.id));
  }

  /**
   * Text search across name + bio (used by the Search / union query).
   */
  search(term: string): AuthorEntity[] {
    const lower = term.toLowerCase();
    return this.authors.filter(
      (a) =>
        a.name.toLowerCase().includes(lower) ||
        (a.bio && a.bio.toLowerCase().includes(lower)),
    );
  }

  /* ── Write ──────────────────────────────────────────────── */

  create(input: Partial<AuthorEntity>): AuthorEntity {
    const author: AuthorEntity = {
      id: uuidv4(),
      name: input.name!,
      bio: input.bio,
      birthDate: input.birthDate,
      nationality: input.nationality,
    };
    this.authors.push(author);
    return author;
  }

  update(id: string, input: Partial<AuthorEntity>): AuthorEntity {
    const idx = this.authors.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Author with id "${id}" not found`);
    }
    this.authors[idx] = { ...this.authors[idx], ...input };
    return this.authors[idx];
  }

  delete(id: string): boolean {
    const idx = this.authors.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Author with id "${id}" not found`);
    }
    this.authors.splice(idx, 1);
    return true;
  }
}
