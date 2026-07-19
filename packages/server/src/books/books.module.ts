import { Module, forwardRef } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { BooksSubscriptionResolver } from './books-subscription.resolver';
import { PUB_SUB } from './pubsub.token';
import { AuthorsModule } from '../authors/authors.module';

@Module({
  imports: [forwardRef(() => AuthorsModule)],
  providers: [
    BooksService,
    BooksResolver,
    BooksSubscriptionResolver,
    { provide: PUB_SUB, useValue: new PubSub() },
  ],
  exports: [BooksService],
})
export class BooksModule {}
