
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Genre {
    FICTION = "FICTION",
    NON_FICTION = "NON_FICTION",
    SCIENCE = "SCIENCE",
    TECHNOLOGY = "TECHNOLOGY",
    BIOGRAPHY = "BIOGRAPHY",
    HISTORY = "HISTORY",
    FANTASY = "FANTASY",
    MYSTERY = "MYSTERY",
    ROMANCE = "ROMANCE",
    THRILLER = "THRILLER",
    ACTION = "ACTION"
}

export enum BookStatus {
    PUBLISHED = "PUBLISHED",
    DRAFT = "DRAFT",
    OUT_OF_PRINT = "OUT_OF_PRINT",
    UPCOMING = "UPCOMING"
}

export class AuthorInput {
    id?: Nullable<string>;
    name?: Nullable<string>;
    bio?: Nullable<string>;
    birthDate?: Nullable<DateTime>;
    nationality?: Nullable<string>;
}

export class CreateAuthorInput {
    name: string;
    bio?: Nullable<string>;
    birthDate?: Nullable<DateTime>;
    nationality?: Nullable<string>;
}

export class CreateBookInput {
    id?: Nullable<string>;
    title: string;
    description?: Nullable<string>;
    price: number;
    isbn: string;
    authorId: string;
    genre: Genre;
    status?: Nullable<BookStatus>;
    publishedDate?: Nullable<DateTime>;
    rating?: Nullable<number>;
    pages?: Nullable<number>;
}

export class Author {
    __typename?: 'Author';
    id: string;
    name: string;
    bio?: Nullable<string>;
    birthDate?: Nullable<DateTime>;
    nationality?: Nullable<string>;
    books: Book[];
}

export class Book {
    __typename?: 'Book';
    id: string;
    title: string;
    description?: Nullable<string>;
    price: number;
    isbn: string;
    authorId: string;
    author: Author;
    genre: Genre;
    status: BookStatus;
    publishedDate?: Nullable<DateTime>;
    rating?: Nullable<number>;
    pages?: Nullable<number>;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract author(input?: Nullable<AuthorInput>): Nullable<Nullable<Author>[]> | Promise<Nullable<Nullable<Author>[]>>;

    abstract book(id: string): Nullable<Book> | Promise<Nullable<Book>>;

    abstract authors(): Author[] | Promise<Author[]>;

    abstract allBooks(): Book[] | Promise<Book[]>;

    abstract booksByAuthor(authorId: string): Book[] | Promise<Book[]>;

    abstract booksByGenre(genre: Genre): Book[] | Promise<Book[]>;

    abstract createBook(input: CreateBookInput): Book | Promise<Book>;

    abstract updateBook(id: string, price: number): Book | Promise<Book>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract createAuthor(input: CreateAuthorInput): Author | Promise<Author>;

    abstract createBook(input: CreateBookInput): Book | Promise<Book>;

    abstract updateBook(id: string, price: number): Book | Promise<Book>;
}

export type DateTime = Date;
type Nullable<T> = T | null;
