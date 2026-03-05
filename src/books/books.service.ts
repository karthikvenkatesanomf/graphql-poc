import { Injectable } from '@nestjs/common';
import { BookEntity } from '../common/entities';
import booksData from '../data/books.json';

@Injectable()
export class BooksService {
  private books: BookEntity[] = JSON.parse(JSON.stringify(booksData));

  findAll(): BookEntity[] {
    return this.books;
  };

  findById(id: string): BookEntity | undefined {
    return this.books.find((b) => b.id === id);
  };

  findByAuthorId(authorId: string): BookEntity[] {
    return this.books.filter((b) => b.authorId === authorId);
  };

  findByGenre(genre: string): BookEntity[] {
    return this.books.filter((b) => b.genre === genre);
  };

  create(input: Partial<BookEntity>): BookEntity {
    const book: BookEntity = {
      id: input.id!,
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
  };

  update(id: string, input: Partial<BookEntity>): BookEntity | [] {
    const book = this.findById(id);
    if (!book) {
      return [];
    }
    Object.assign(book, input);
    return book;
  };

}
