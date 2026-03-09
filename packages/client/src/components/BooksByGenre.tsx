import { useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { GET_BOOKS_BY_GENRE } from '../graphql/operations';

const GENRES = [
  'FICTION', 'NON_FICTION', 'SCIENCE', 'TECHNOLOGY',
  'BIOGRAPHY', 'HISTORY', 'FANTASY', 'MYSTERY',
  'ROMANCE', 'THRILLER', 'ACTION',
];

export default function BooksByGenre() {
  const [genre, setGenre] = useState('FICTION');
  const [fetchBooks, { loading, error, data }] = useLazyQuery(GET_BOOKS_BY_GENRE);

  const handleSearch = () => {
    fetchBooks({ variables: { genre } });
  };

  return (
    <div className="section">
      <h2>🔍 Books by Genre</h2>
      <div className="form-row">
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error.message}</div>}

      {data?.booksByGenre && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.booksByGenre.map((book: any) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>⭐ {book.rating ?? 'N/A'}</td>
                <td>
                  <span className={`badge status-${book.status.toLowerCase()}`}>
                    {book.status}
                  </span>
                </td>
              </tr>
            ))}
            {data.booksByGenre.length === 0 && (
              <tr><td colSpan={5} className="text-muted">No books found</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
