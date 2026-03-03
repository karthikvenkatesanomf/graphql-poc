import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BookEntity } from '../dataloader/dataloader.interface';
import booksData from '../data/books.json';

/**
 * In-memory book data service backed by static JSON.
 * Supports filtering, sorting, and batch lookups for DataLoader.
 */
@Injectable()
export class BooksService {
  private books: BookEntity[] = JSON.parse(JSON.stringify(booksData));

  /* ── Read ───────────────────────────────────────────────── */

  findAll(): BookEntity[] {
    return this.books;
  }

  findById(id: string): BookEntity | undefined {
    return this.books.find((b) => b.id === id);
  }

  /**
   * Batch lookup by authorId — used by DataLoader to solve N+1
   * when resolving Author.books for multiple authors at once.
   */
  findByAuthorIds(authorIds: string[]): BookEntity[] {
    const idSet = new Set(authorIds);
    return this.books.filter((b) => idSet.has(b.authorId));
  }

  findByAuthorId(authorId: string): BookEntity[] {
    return this.books.filter((b) => b.authorId === authorId);
  }

  /**
   * Text search across title + description (used by Search / union query).
   */
  search(term: string): BookEntity[] {
    const lower = term.toLowerCase();
    return this.books.filter(
      (b) =>
        b.title.toLowerCase().includes(lower) ||
        (b.description && b.description.toLowerCase().includes(lower)),
    );
  }

  /**
   * Filtered + sorted list of books.
   */
  findFiltered(
    filter?: {
      genre?: string;
      status?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
    },
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): BookEntity[] {
    let result = [...this.books];

    if (filter) {
      if (filter.genre) {
        result = result.filter((b) => b.genre === filter.genre);
      }
      if (filter.status) {
        result = result.filter((b) => b.status === filter.status);
      }
      if (filter.minPrice !== undefined && filter.minPrice !== null) {
        result = result.filter((b) => b.price >= filter.minPrice!);
      }
      if (filter.maxPrice !== undefined && filter.maxPrice !== null) {
        result = result.filter((b) => b.price <= filter.maxPrice!);
      }
      if (filter.minRating !== undefined && filter.minRating !== null) {
        result = result.filter(
          (b) => b.rating !== undefined && b.rating >= filter.minRating!,
        );
      }
    }

    if (sortBy) {
      const order = sortOrder === 'DESC' ? -1 : 1;
      result.sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[sortBy];
        const bVal = (b as unknown as Record<string, unknown>)[sortBy];
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;
        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
      });
    }

    return result;
  }

  /* ── Write ──────────────────────────────────────────────── */

  create(input: Partial<BookEntity>): BookEntity {
    const book: BookEntity = {
      id: uuidv4(),
      title: input.title!,
      description: input.description,
      price: input.price!,
      isbn: input.isbn!,
      authorId: input.authorId!,
      genre: input.genre!,
      status: input.status || 'DRAFT',
      publishedDate: input.publishedDate,
      rating: input.rating,
      pages: input.pages,
    };
    this.books.push(book);
    return book;
  }

  update(id: string, input: Partial<BookEntity>): BookEntity {
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Book with id "${id}" not found`);
    }
    this.books[idx] = { ...this.books[idx], ...input };
    return this.books[idx];
  }

  delete(id: string): boolean {
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Book with id "${id}" not found`);
    }
    this.books.splice(idx, 1);
    return true;
  }
}
