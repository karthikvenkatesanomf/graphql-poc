# GraphQL POC — NestJS + Apollo (Schema-First)

A production-ready **Bookstore API** built with NestJS, Apollo Server, and GraphQL using the **schema-first** approach. Types are auto-generated from `.graphql` files, and **DataLoader** solves the N+1 query problem.

---

## Architecture

```
src/
├── graphql/schema.graphql        # Single source of truth (schema-first)
├── graphql-types.ts              # Auto-generated TypeScript types
├── data/
│   ├── authors.json              # Static author data (5 authors)
│   └── books.json                # Static book data (12 books, FK → authorId)
├── authors/
│   ├── authors.module.ts
│   ├── authors.service.ts        # CRUD + batch lookups
│   └── authors.resolver.ts       # Queries, mutations, subscriptions, field resolvers
├── books/
│   ├── books.module.ts
│   ├── books.service.ts          # CRUD + filtering/sorting + batch lookups
│   └── books.resolver.ts         # Queries, mutations, subscriptions, field resolvers
├── search/
│   ├── search.module.ts
│   └── search.resolver.ts        # Union type (SearchResult = Author | Book)
├── dataloader/
│   ├── dataloader.module.ts
│   ├── dataloader.service.ts     # Per-request DataLoader factory (N+1 fix)
│   └── dataloader.interface.ts   # Typed loader map
├── common/
│   ├── scalars/date.scalar.ts    # Custom DateTime scalar
│   └── plugins/logging.plugin.ts # Apollo logging plugin
├── generate-typings.ts           # Schema → TypeScript codegen script
├── app.module.ts
└── main.ts                       # Helmet, compression, CORS
```

## Data Model (Relation)

```
Author  1 ──── ∞  Book
  id ◄──────────── authorId
```

**5 authors × 12 books** — e.g. J.K. Rowling → 3 Harry Potter books, Stephen King → 3 books, etc.

---

## GraphQL Concepts Covered

| Concept | Where |
|---|---|
| **Queries** | `author`, `authors`, `book`, `books`, `booksByAuthor`, `search`, `allBooks` |
| **Mutations** | `createAuthor`, `updateAuthor`, `deleteAuthor`, `createBook`, `updateBook`, `deleteBook` |
| **Subscriptions** | `bookAdded`, `bookUpdated`, `authorAdded` (via `graphql-ws`) |
| **Custom Scalar** | `DateTime` — ISO-8601 ↔ JS Date |
| **Enums** | `Genre`, `BookStatus`, `SortOrder` |
| **Input Types** | `CreateAuthorInput`, `UpdateAuthorInput`, `CreateBookInput`, `UpdateBookInput`, `BookFilterInput`, `PaginationInput` |
| **Interface** | `Node { id: ID! }` — implemented by Author & Book |
| **Union Type** | `SearchResult = Author \| Book` (inline fragments) |
| **Cursor Pagination** | Relay-style `Connection / Edge / PageInfo` for both entities |
| **Field Resolvers** | `Author.books`, `Author.bookCount`, `Book.author` |
| **DataLoader (N+1)** | `authorLoader` (Book→Author), `booksByAuthorLoader` (Author→Books) |
| **Directives** | `@deprecated` on `allBooks` query |
| **Filtering & Sorting** | `books(filter: {...}, sortBy, sortOrder)` |
| **Error Formatting** | Custom `formatError` in Apollo config |
| **Apollo Plugin** | `LoggingPlugin` logs request duration & errors |

---

## Quick Start

```bash
# Install
npm install

# Generate types from schema
npm run generate:typings

# Development (watch mode)
npm run start:dev

# Production build & run
npm run build
npm run start:prod
```

Server starts at **http://localhost:3000/graphql** (Apollo Sandbox).

---

## Example Queries

### Paginated authors with nested books (DataLoader)
```graphql
query {
  authors(pagination: { first: 2 }) {
    edges {
      cursor
      node {
        id
        name
        bookCount
        books { title genre rating }
      }
    }
    pageInfo { hasNextPage totalCount }
  }
}
```

### Filtered + sorted books with author (DataLoader)
```graphql
query {
  books(
    filter: { genre: FANTASY, minRating: 4.5 }
    sortBy: "rating"
    sortOrder: DESC
    pagination: { first: 5 }
  ) {
    edges {
      node {
        title
        price
        rating
        author { name nationality }
      }
    }
    pageInfo { totalCount }
  }
}
```

### Union type search (inline fragments)
```graphql
query {
  search(term: "robot") {
    ... on Author { id name nationality }
    ... on Book   { id title price genre }
  }
}
```

### Create book (mutation + subscription trigger)
```graphql
mutation {
  createBook(input: {
    title: "New Novel"
    price: 19.99
    isbn: "978-0000000000"
    authorId: "a1"
    genre: FICTION
  }) {
    id title author { name }
  }
}
```

### Real-time subscription
```graphql
subscription {
  bookAdded {
    id title price
    author { name }
  }
}
```

---

## DataLoader — How It Solves N+1

Without DataLoader, querying 10 books with their author triggers **1 + 10 = 11 queries**:
1. Fetch 10 books
2. For each book, fetch its author individually

With DataLoader, the `authorLoader` **batches** all 10 author IDs into a **single** lookup call:
1. Fetch 10 books
2. Fetch all 10 authors **in one batch**

This is configured in `DataLoaderService.createLoaders()` and injected per-request via the GraphQL context factory.

---

## Production Features

- **Helmet** — HTTP security headers
- **Compression** — gzip response compression
- **CORS** — configurable origin
- **Error formatting** — strips internal details
- **Logging plugin** — request timing and error logging
- **Schema-first codegen** — type-safe resolvers from `.graphql` schema
- **Asset copying** — `.graphql` and `.json` files bundled into `dist/`