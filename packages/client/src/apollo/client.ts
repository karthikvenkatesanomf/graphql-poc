import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:8080/graphql', headers: { 'Content-Type': 'application/json' , 'x-use-dataloader': 'true' } }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first'
    },
    mutate: {
      fetchPolicy: 'no-cache'
    },
  },
});

export default client;
