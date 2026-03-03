import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  Context,
  ResolveField,
} from '@nestjs/graphql';
import { BooksService } from './books.service';
import { IDataLoaders, AuthorEntity, BookEntity } from '../dataloader/dataloader.interface';

@Resolver('Book')
export class BooksResolver {
  constructor(
    private readonly booksService: BooksService,
  ) {}

  /* ─────────────────────── QUERIES ──────────────────────── */

  /**
   * Single book by ID.
   *
   *   query { book(id: "b1") { title author { name } genre } }
   */
  @Query('book')
  getBook(@Args('id') id: string): BookEntity | undefined {
    return this.booksService.findById(id);
  }

  /**
   * Paginated + filterable + sortable book list.
   *
   *   query {
   *     books(
   *       filter: { genre: FANTASY, minRating: 4.5 }
   *       pagination: { first: 5 }
   *       sortBy: "price"
   *       sortOrder: ASC
   *     ) {
   *       edges { cursor node { title price rating } }
   *       pageInfo { hasNextPage totalCount }
   *     }
   *   }
   */
  @Query('books')
  getBooks(
    @Args('filter')
    filter?: {
      genre?: string;
      status?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
    },
    @Args('pagination') pagination?: { first?: number; after?: string },
    @Args('sortBy') sortBy?: string,
    @Args('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const items = this.booksService.findFiltered(filter, sortBy, sortOrder);
    return this.paginate(items, pagination);
  }

  /**
   * All books by a specific author (non-paginated convenience query).
   */
  @Query('booksByAuthor')
  getBooksByAuthor(@Args('authorId') authorId: string): BookEntity[] {
    return this.booksService.findByAuthorId(authorId);
  }


  @Query('allBooks')
  getAllBooks(): BookEntity[] {
    return this.booksService.findAll();
  }

  @ResolveField('author')
  getAuthor(
    @Parent() book: BookEntity,
    @Context('loaders') loaders: IDataLoaders,
  ): Promise<AuthorEntity | undefined> {
    return loaders.authorLoader.load(book.authorId);
  }

  /* ────────────────────── MUTATIONS ─────────────────────── */

  /**
   * Create a new book.
   *
   *   mutation {
   *     createBook(input: {
   *       title: "New Book"
   *       price: 19.99
   *       isbn: "978-0000000000"
   *       authorId: "a1"
   *       genre: FICTION
   *     }) { id title }
   *   }
   */
  @Mutation('createBook')
  createBook(@Args('input') input: Partial<BookEntity>): BookEntity {
    return this.booksService.create(input);
  }

  /**
   * Update an existing book.
   */
  @Mutation('updateBook')
  updateBook(
    @Args('id') id: string,
    @Args('input') input: Partial<BookEntity>,
  ): BookEntity {
    return this.booksService.update(id, input);
  }

  /**
   * Delete a book by ID.
   */
  @Mutation('deleteBook')
  deleteBook(@Args('id') id: string): boolean {
    return this.booksService.delete(id);
  }

  /* ────────────────────── HELPERS ────────────────────────── */

  private paginate(
    items: BookEntity[],
    pagination?: { first?: number; after?: string },
  ) {
    const first = pagination?.first ?? 10;
    const after = pagination?.after;

    let startIndex = 0;
    if (after) {
      const decodedId = Buffer.from(after, 'base64').toString('utf-8');
      const afterIdx = items.findIndex((i) => i.id === decodedId);
      if (afterIdx !== -1) startIndex = afterIdx + 1;
    }

    const slice = items.slice(startIndex, startIndex + first);

    return {
      edges: slice.map((node) => ({
        node,
        cursor: Buffer.from(node.id).toString('base64'),
      })),
      pageInfo: {
        hasNextPage: startIndex + first < items.length,
        hasPreviousPage: startIndex > 0,
        totalCount: items.length,
      },
    };
  }
}
