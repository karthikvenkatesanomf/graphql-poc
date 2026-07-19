import { useQuery, useSubscription } from '@apollo/client/react';
import { GET_ALL_BOOKS, BOOK_CREATED } from '../graphql/operations';

interface Book {
  id: string;
  title: string;
  author: { name: string };
  genre: string;
  price: number;
  rating?: number;
  status: string;
}

interface GetAllBooksData {
  allBooks: Book[];
}

export default function BookList() {
  const { loading, error, data, refetch } = useQuery<GetAllBooksData>(GET_ALL_BOOKS);
  const { data: subData } = useSubscription(BOOK_CREATED, {
    onData: () => {
      void refetch();
    },
  });

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const lastCreated = subData?.bookCreated;

  return (
    <div className="section">
      <div className="section-header">
        <h2>📚 All Books</h2>
        <button className="btn btn-secondary" onClick={() => refetch()}>
          Refresh
        </button>
      </div>
      <p className="subtitle" style={{ marginTop: 0, marginBottom: '1rem' }}>
        <strong>Realtime:</strong> subscribed to <code>bookCreated</code>
        {lastCreated
          ? ` — latest event: “${lastCreated.title}”`
          : '. Create a book in another tab to see the list update.'}
      </p>
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
          {data?.allBooks.map((book: Book) => (
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
