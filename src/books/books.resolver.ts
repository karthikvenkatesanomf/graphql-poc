import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { BooksService } from './books.service';
import { AuthorsService } from '../authors/authors.service';
import { BookEntity } from '../common/entities';

@Resolver('Book')
export class BooksResolver {
  constructor(
    private readonly booksService: BooksService,
    private readonly authorsService: AuthorsService,
  ) {}

  @Query('book')
  getBook(@Args('id') id: string): BookEntity | undefined {
    return this.booksService.findById(id);
  };

  @Query('booksByAuthor')
  getBooksByAuthor(@Args('authorId') authorId: string): BookEntity[] {
    console.log('getBooksByAuthor called with authorId:', authorId);
    return this.booksService.findByAuthorId(authorId);
  };

  @Query('allBooks')
  getAllBooks(): BookEntity[] {
    return this.booksService.findAll();
  };

  @Query('booksByGenre')
  getBooksByGenre(@Args('genre') genre: string): BookEntity[] {
    console.log('getBooksByGenre called with genre:', genre);
    return this.booksService.findByGenre(genre);
  };

  @ResolveField('author')
  getAuthor(@Parent() book: BookEntity) {
    return this.authorsService.findById(book.authorId);
  };

  @Query('createBook')
  createBookViaQuery(@Args('input') input: Partial<BookEntity>): Promise<BookEntity> {
    console.log('[Query] createBook called');
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.booksService.create(input)), 3000);
    });
  }

  @Query('updateBook')
  updateBookViaQuery(
    @Args('id') id: string,
    @Args('price') price: number,
  ): Promise<BookEntity | []> {
    console.log('[Query] - updateBook called');
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.booksService.update(id, { price })), 1000);
    });
  }

  @Mutation('createBook')
  createBook(@Args('input') input: Partial<BookEntity>): Promise<BookEntity> {
    console.log('[Mutation] createBook called');
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.booksService.create(input)), 3000);
    });
  }

  @Mutation('updateBook')
  updateBook(
    @Args('id') id: string,
    @Args('price') price: number,
  ): Promise<BookEntity | []> {
    console.log('[Mutation] updateBook called');
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.booksService.update(id, { price })), 1000);
    });
  }
}
