
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

export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}

export class CreateAuthorInput {
    name: string;
    bio?: Nullable<string>;
    birthDate?: Nullable<DateTime>;
    nationality?: Nullable<string>;
}

export class UpdateAuthorInput {
    name?: Nullable<string>;
    bio?: Nullable<string>;
    birthDate?: Nullable<DateTime>;
    nationality?: Nullable<string>;
}

export class CreateBookInput {
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

export class UpdateBookInput {
    title?: Nullable<string>;
    description?: Nullable<string>;
    price?: Nullable<number>;
    isbn?: Nullable<string>;
    authorId?: Nullable<string>;
    genre?: Nullable<Genre>;
    status?: Nullable<BookStatus>;
    publishedDate?: Nullable<DateTime>;
    rating?: Nullable<number>;
    pages?: Nullable<number>;
}

export class BookFilterInput {
    genre?: Nullable<Genre>;
    status?: Nullable<BookStatus>;
    minPrice?: Nullable<number>;
    maxPrice?: Nullable<number>;
    minRating?: Nullable<number>;
}

export class PaginationInput {
    first?: Nullable<number>;
    after?: Nullable<string>;
}

export interface Node {
    id: string;
}

export class Author implements Node {
    __typename?: 'Author';
    id: string;
    name: string;
    bio?: Nullable<string>;
    birthDate?: Nullable<DateTime>;
    nationality?: Nullable<string>;
    books: Book[];
    bookCount: number;
}

export class Book implements Node {
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

export class PageInfo {
    __typename?: 'PageInfo';
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
}

export class BookEdge {
    __typename?: 'BookEdge';
    node: Book;
    cursor: string;
}

export class BookConnection {
    __typename?: 'BookConnection';
    edges: BookEdge[];
    pageInfo: PageInfo;
}

export class AuthorEdge {
    __typename?: 'AuthorEdge';
    node: Author;
    cursor: string;
}

export class AuthorConnection {
    __typename?: 'AuthorConnection';
    edges: AuthorEdge[];
    pageInfo: PageInfo;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract author(id: string): Nullable<Author> | Promise<Nullable<Author>>;

    abstract book(id: string): Nullable<Book> | Promise<Nullable<Book>>;

    abstract authors(pagination?: Nullable<PaginationInput>): AuthorConnection | Promise<AuthorConnection>;

    abstract books(filter?: Nullable<BookFilterInput>, pagination?: Nullable<PaginationInput>, sortBy?: Nullable<string>, sortOrder?: Nullable<SortOrder>): BookConnection | Promise<BookConnection>;

    abstract booksByAuthor(authorId: string): Book[] | Promise<Book[]>;

    abstract search(term: string): SearchResult[] | Promise<SearchResult[]>;

    abstract allBooks(): Book[] | Promise<Book[]>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract createAuthor(input: CreateAuthorInput): Author | Promise<Author>;

    abstract updateAuthor(id: string, input: UpdateAuthorInput): Author | Promise<Author>;

    abstract deleteAuthor(id: string): boolean | Promise<boolean>;

    abstract createBook(input: CreateBookInput): Book | Promise<Book>;

    abstract updateBook(id: string, input: UpdateBookInput): Book | Promise<Book>;

    abstract deleteBook(id: string): boolean | Promise<boolean>;
}

export type DateTime = Date;
export type SearchResult = Author | Book;
type Nullable<T> = T | null;
