import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpUri = 'http://localhost:8080/graphql';
const wsUri = 'ws://localhost:8080/graphql';

const httpLink = new HttpLink({
  uri: httpUri,
  headers: {
    'Content-Type': 'application/json',
    'x-use-dataloader': 'true',
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUri,
    connectionParams: { 'x-use-dataloader': 'true' },
  }),
);

const link = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === 'OperationDefinition' && def.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: ApolloLink.from([link]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default client;
