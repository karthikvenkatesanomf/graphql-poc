import { gql } from '@apollo/client';

// ── Queries ──────────────────────────────────────────────
export const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    allBooks {
      id
      title
      price
      genre
      status
      rating
      author {
        id
        name
      }
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      description
      price
      isbn
      genre
      status
      rating
      pages
      author {
        id
        name
        nationality
      }
    }
  }
`;

export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      bio
      nationality
      books {
        id
        title
      }
    }
  }
`;

export const GET_BOOKS_BY_GENRE = gql`
  query GetBooksByGenre($genre: Genre!) {
    booksByGenre(genre: $genre) {
      id
      title
      price
      rating
      status
      author {
        name
      }
    }
  }
`;

export const GET_BOOKS_BY_AUTHOR = gql`
  query GetBooksByAuthor($authorId: ID!) {
    booksByAuthor(authorId: $authorId) {
      id
      title
      price
      genre
      status
    }
  }
`;

// ── Mutations ────────────────────────────────────────────
export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($input: CreateAuthorInput!) {
    createAuthor(input: $input) {
      id
      name
      bio
      nationality
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      id
      title
      price
      genre
      status
      author {
        name
      }
    }
  }
`;

export const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBook($id: ID!, $price: Float!) {
    updateBook(id: $id, price: $price) {
      id
      title
      price
    }
  }
`;

// ── Query-based update (for caching demo) ────────────────
export const UPDATE_BOOK_QUERY = gql`
  query UpdateBookViaQuery($id: ID!, $price: Float!) {
    updateBook(id: $id, price: $price) {
      id
      title
      price
    }
  }
`;
