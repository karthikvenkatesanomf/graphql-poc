import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { BooksService } from './books.service';
import { AuthorsService } from '../authors/authors.service';
import { Book, Author } from '../drizzle/schema';

@Resolver('Book')
export class BooksResolver {
  constructor(
    private readonly booksService: BooksService,
    private readonly authorsService: AuthorsService,
  ) {}

  @Query('book')
  getBook(@Args('id') id: string) {
    return this.booksService.findById(id);
  }

  @Query('booksByAuthor')
  getBooksByAuthor(@Args('authorId') authorId: string) {
    console.log('getBooksByAuthor called with authorId:', authorId);
    return this.booksService.findByAuthorId(authorId);
  }

  @Query('allBooks')
  getAllBooks() {
    return this.booksService.findAll();
  }

  @Query('booksByGenre')
  getBooksByGenre(@Args('genre') genre: string) {
    console.log('getBooksByGenre called with genre:', genre);
    return this.booksService.findByGenre(genre);
  }

  @ResolveField('author')
  getAuthor(@Parent() book: Book, @Context() ctx: any) {
    if (ctx.useDataLoader) {
      if (!ctx._authorByIdLoader) {
        ctx._authorByIdLoader = new DataLoader<string, Author | null>(async (ids) => {
          console.log(`  \x1b[32m📦 [DataLoader] Batching ${ids.length} author lookups into 1 query\x1b[0m`);
          const authors = await this.authorsService.findByIds([...ids]);
          const authorMap = new Map(authors.map(a => [a.id, a]));
          return ids.map(id => authorMap.get(id) ?? null);
        });
      }
      return ctx._authorByIdLoader.load(book.authorId);
    }
    return this.authorsService.findById(book.authorId);
  }

  @Query('createBook')
  createBookViaQuery(@Args('input') input: Partial<Book>) {
    console.log('[Query] createBook called');
    return this.booksService.create(input);
  }

  @Query('updateBook')
  updateBookViaQuery(
    @Args('id') id: string,
    @Args('price') price: number,
  ) {
    console.log('[Query] - updateBook called');
    return this.booksService.update(id, { price: String(price) });
  }

  @Mutation('createBook')
  createBook(@Args('input') input: Partial<Book>) {
    console.log('[Mutation] createBook called');
    return this.booksService.create(input);
  }

  @Mutation('updateBook')
  updateBook(
    @Args('id') id: string,
    @Args('price') price: number,
  ) {
    console.log('[Mutation] updateBook called');
    return this.booksService.update(id, { price: String(price) });
  }
}
