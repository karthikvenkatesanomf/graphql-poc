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
import { AuthorsService } from './authors.service';
import { BooksService } from '../books/books.service';
import { Author, Book } from '../drizzle/schema';

@Resolver('Author')
export class AuthorsResolver {
  constructor(
    private readonly authorsService: AuthorsService,
    private readonly booksService: BooksService,
  ) {}

  @Query('author')
  getAuthor(@Args('input') input: Record<string, any>) {
    console.log('getAuthor called with input:', input);
    const payload = Object.keys(input).map((key) => {
      return { key, value: input[key] };
    })[0];
    return this.authorsService.findByField(payload.key as keyof Author, payload.value);
  }

  @Query('authors')
  getAuthors() {
    return this.authorsService.findAll();
  }

  @ResolveField('books')
  getBooks(@Parent() author: Author, @Context() ctx: any) {
    if (ctx.useDataLoader) {
      if (!ctx._booksByAuthorIdLoader) {
        console.log(`  \x1b[32m📦 [DataLoader]-Karthik ${JSON.stringify(author)}`);
        ctx._booksByAuthorIdLoader = new DataLoader<string, Book[]>(async (authorIds) => {
          console.log(`  \x1b[32m📦 [DataLoader] Batching ${authorIds.length} book lookups into 1 query\x1b[0m`);
          const books = await this.booksService.findByAuthorIdsBatch([...authorIds]);
          return authorIds.map(id => books.filter(b => b.authorId === id));
        });
      }
      return ctx._booksByAuthorIdLoader.load(author.id);
    }
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
