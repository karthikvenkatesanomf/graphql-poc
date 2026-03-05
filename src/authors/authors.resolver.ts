import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { BooksService } from '../books/books.service';
import { AuthorEntity } from '../common/entities';
import { AuthorInput } from 'src/graphql-types';

@Resolver('Author')
export class AuthorsResolver {
  constructor(
    private readonly authorsService: AuthorsService,
    private readonly booksService: BooksService,
  ) {}

  @Query('author')
  getAuthor(@Args('input') input: AuthorInput) {
    console.log('getAuthor called with input:', input);
    const payload =  Object.keys(input).map((key) => {
      return {key, value: input[key as keyof AuthorInput]};
    })[0];
    return this.authorsService.findByField(payload.key as keyof AuthorEntity, payload.value);
  }

  @Query('authors')
  getAuthors() {
    return this.authorsService.findAll();
  }

  @ResolveField('books')
  getBooks(@Parent() author: AuthorEntity) {
    return this.booksService.findByAuthorId(author.id);
  }

  @Mutation('createAuthor')
  createAuthor(
    @Args('input')
    input: { name: string; bio?: string; birthDate?: string; nationality?: string },
  ) {
    return this.authorsService.create(input);
  }
}
