import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  Context,
  ResolveField,
} from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { IDataLoaders, AuthorEntity, BookEntity } from '../dataloader/dataloader.interface';

@Resolver('Author')
export class AuthorsResolver {
  constructor(
    private readonly authorsService: AuthorsService,
  ) {}

  /* ─────────────────────── QUERIES ──────────────────────── */

  /**
   * Fetch a single author by ID.
   *
   * Example:
   *   query { author(id: "a1") { id name bio books { title } } }
   */
  @Query('author')
  getAuthor(@Args('id') id: string): AuthorEntity | undefined {
    return this.authorsService.findById(id);
  }

  /**
   * Paginated author list using Relay-style cursor connections.
   *
   * Example:
   *   query {
   *     authors(pagination: { first: 3 }) {
   *       edges { cursor node { id name } }
   *       pageInfo { hasNextPage totalCount }
   *     }
   *   }
   */
  @Query('authors')
  getAuthors(
    @Args('pagination') pagination?: { first?: number; after?: string },
  ) {
    const all = this.authorsService.findAll();
    return this.paginate(all, pagination);
  }

  /* ─────────────────── FIELD RESOLVERS ──────────────────── */

  /**
   * Resolves Author.books via DataLoader (N+1 safe).
   *
   * Without DataLoader: if a query lists 10 authors, this field
   * resolver would fire 10 separate book lookups. DataLoader
   * batches them into a single call.
   */
  @ResolveField('books')
  getBooks(
    @Parent() author: AuthorEntity,
    @Context('loaders') loaders: IDataLoaders,
  ): Promise<BookEntity[]> {
    return loaders.booksByAuthorLoader.load(author.id);
  }

  /** Derived field: count of books by this author. */
  @ResolveField('bookCount')
  async getBookCount(
    @Parent() author: AuthorEntity,
    @Context('loaders') loaders: IDataLoaders,
  ): Promise<number> {
    const books = await loaders.booksByAuthorLoader.load(author.id);
    return books.length;
  }

  /* ────────────────────── MUTATIONS ─────────────────────── */

  /**
   * Create a new author and publish an event for subscribers.
   *
   * Example:
   *   mutation {
   *     createAuthor(input: { name: "New Author", nationality: "Canadian" }) {
   *       id name
   *     }
   *   }
   */
  @Mutation('createAuthor')
  createAuthor(
    @Args('input')
    input: { name: string; bio?: string; birthDate?: string; nationality?: string },
  ): AuthorEntity {
    return this.authorsService.create(input);
  }

  /**
   * Update an existing author by ID.
   */
  @Mutation('updateAuthor')
  updateAuthor(
    @Args('id') id: string,
    @Args('input')
    input: { name?: string; bio?: string; birthDate?: string; nationality?: string },
  ): AuthorEntity {
    return this.authorsService.update(id, input);
  }

  /**
   * Delete an author by ID. Returns true on success.
   */
  @Mutation('deleteAuthor')
  deleteAuthor(@Args('id') id: string): boolean {
    return this.authorsService.delete(id);
  }

  /* ────────────────────── HELPERS ────────────────────────── */

  private paginate(
    items: AuthorEntity[],
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
