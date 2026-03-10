import { gql } from '@apollo/client';

// ============================================================
// GraphQL Fragments — Reusable Field Selections
// ============================================================
//
// Fragments let you define a set of fields on a type ONCE and
// reuse them across multiple queries / mutations.
//
// Benefits:
//   1. DRY — shared field lists are defined in one place
//   2. Consistency — every consumer gets the same shape
//   3. Maintainability — add a field once, all queries get it
//   4. Composability — fragments can include other fragments
//
// Syntax:
//   fragment <Name> on <TypeName> { ...fields }
//
// Usage inside a query:
//   query { allBooks { ...BookCoreFields } }
//
// In Apollo Client you interpolate the fragment into the gql
// template literal so the document includes the definition:
//   gql`
//     query { allBooks { ...BookCoreFields } }
//     ${BOOK_CORE_FIELDS}
//   `;
// ============================================================

// ── Author Fragments ───────────────────────────────────────

/**
 * Minimal author info — just enough for a book card / listing.
 * Used when an author is nested inside a book result.
 */
export const AUTHOR_SUMMARY_FIELDS = gql`
  fragment AuthorSummaryFields on Author {
    price
  }
`;

/**
 * Full author profile fields (excludes the `books` relation
 * to avoid circular fragments — fetch books separately).
 */
export const AUTHOR_DETAIL_FIELDS = gql`
  fragment AuthorDetailFields on Author {
    id
    name
    bio
    nationality
  }
`;

// ── Book Fragments ─────────────────────────────────────────

/**
 * Core book fields used in every listing / card view.
 */
export const BOOK_CORE_FIELDS = gql`
  fragment BookCoreFields on Book {
    id
    title
    price
    genre
    status
    rating
  }
`;

/**
 * Full book detail — extends core fields with description,
 * isbn, and page count.  Demonstrates FRAGMENT COMPOSITION:
 * one fragment spreading another.
 */
export const BOOK_DETAIL_FIELDS = gql`
  fragment BookDetailFields on Book {
    ...BookCoreFields
    description
    isbn
    pages
  }
  ${BOOK_CORE_FIELDS}
`;

/**
 * Minimal fields returned after a price update — only the
 * fields the cache needs to reconcile the change.
 */
export const BOOK_UPDATE_FIELDS = gql`
  fragment BookUpdateFields on Book {
    id
    title
    price
  }
`;
