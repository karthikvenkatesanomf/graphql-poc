import { Inject } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './pubsub.token';

/** Event name must match what we pass to `pubSub.publish` in `BooksResolver`. */
export const BOOK_CREATED = 'BOOK_CREATED';

/**
 * Subscriptions live on the root `Subscription` type. A separate small resolver
 * keeps the pattern obvious: `asyncIterator` = "stream of events" for this field.
 */
@Resolver()
export class BooksSubscriptionResolver {
  constructor(@Inject(PUB_SUB) private readonly pubSub: PubSub) {}

  @Subscription('bookCreated')
  bookCreated() {
    return this.pubSub.asyncIterator(BOOK_CREATED);
  }
}
