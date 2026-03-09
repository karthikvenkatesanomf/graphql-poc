import { useQuery } from '@apollo/client/react';
import { GET_AUTHORS } from '../graphql/operations';

export default function AuthorList() {
  const { loading, error, data } = useQuery(GET_AUTHORS);

  if (loading) return <div className="loading">Loading authors...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="section">
      <h2>✍️ Authors</h2>
      <div className="card-grid">
        {data.authors.map((author: any) => (
          <div className="card" key={author.id}>
            <h3>{author.name}</h3>
            <p className="text-muted">{author.nationality}</p>
            <p className="bio">{author.bio?.slice(0, 120)}...</p>
            <div className="book-tags">
              {author.books.map((b: any) => (
                <span key={b.id} className="badge genre">
                  {b.title}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
