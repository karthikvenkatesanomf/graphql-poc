import { gql } from '@apollo/client';

import {
  AUTHOR_DETAIL_FIELDS,
  AUTHOR_SUMMARY_FIELDS,
  BOOK_CORE_FIELDS,
  BOOK_DETAIL_FIELDS,
  BOOK_UPDATE_FIELDS,
} from './fragments';

// ============================================================
// All operations now use FRAGMENTS for shared field selections.
//
// How it works:
//   1. Spread the fragment inside the selection set:
//        ...BookCoreFields
//   2. Interpolate the fragment definition at the end of the
//      gql template so Apollo knows the field mapping:
//        ${BOOK_CORE_FIELDS}
//   3. When a fragment itself depends on another fragment
//      (e.g. BookDetailFields spreads BookCoreFields), you
//      only need to interpolate the top-level one — its own
//      definition already includes the dependency.
// ============================================================

// ── Queries ──────────────────────────────────────────────

/** All books — core fields + nested author summary */
export const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    allBooks {
      ...BookCoreFields
      author {
        ...AuthorSummaryFields
      }
    }
  }
  ${BOOK_CORE_FIELDS}
  ${AUTHOR_SUMMARY_FIELDS}
`;

/** Single book detail — full fields + author with nationality */
export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      ...BookDetailFields
      author {
        ...AuthorDetailFields
      }
    }
  }
  ${BOOK_DETAIL_FIELDS}
  ${AUTHOR_DETAIL_FIELDS}
`;

/** All authors with their books (minimal book info) */
export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      ...AuthorDetailFields
      books {
        id
        title
      }
    }
  }
  ${AUTHOR_DETAIL_FIELDS}
`;

/** Books filtered by genre — core fields + author name */
export const GET_BOOKS_BY_GENRE = gql`
  query GetBooksByGenre($genre: Genre!) {
    booksByGenre(genre: $genre) {
      ...BookCoreFields
      author {
        ...AuthorSummaryFields
      }
    }
  }
  ${BOOK_CORE_FIELDS}
  ${AUTHOR_SUMMARY_FIELDS}
`;

/** Books by a specific author — core fields only */
export const GET_BOOKS_BY_AUTHOR = gql`
  query GetBooksByAuthor($authorId: ID!) {
    booksByAuthor(authorId: $authorId) {
      ...BookCoreFields
    }
  }
  ${BOOK_CORE_FIELDS}
`;

// ── Mutations ────────────────────────────────────────────

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($input: CreateAuthorInput!) {
    createAuthor(input: $input) {
      ...AuthorDetailFields
    }
  }
  ${AUTHOR_DETAIL_FIELDS}
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      ...BookCoreFields
      author {
        ...AuthorSummaryFields
      }
    }
  }
  ${BOOK_CORE_FIELDS}
  ${AUTHOR_SUMMARY_FIELDS}
`;

export const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBook($id: ID!, $price: Float!) {
    updateBook(id: $id, price: $price) {
      ...BookUpdateFields
    }
  }
  ${BOOK_UPDATE_FIELDS}
`;

// ── Query-based update (for caching demo) ────────────────
export const UPDATE_BOOK_QUERY = gql`
  query UpdateBookViaQuery($id: ID!, $price: Float!) {
    updateBook(id: $id, price: $price) {
      ...BookUpdateFields
    }
  }
  ${BOOK_UPDATE_FIELDS}
`;
