import { useQuery } from '@apollo/client/react';
import { GET_ALL_BOOKS } from '../graphql/operations';

export default function BookList() {
  const { loading, error, data, refetch } = useQuery(GET_ALL_BOOKS);

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="section">
      <div className="section-header">
        <h2>📚 All Books</h2>
        <button className="btn btn-secondary" onClick={() => refetch()}>
          Refresh
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.allBooks.map((book: any) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>
                <span className="badge genre">{book.genre}</span>
              </td>
              <td>${book.price.toFixed(2)}</td>
              <td>⭐ {book.rating ?? 'N/A'}</td>
              <td>
                <span className={`badge status-${book.status.toLowerCase()}`}>
                  {book.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
