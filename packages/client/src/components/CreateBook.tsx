import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { GET_AUTHORS } from '../graphql/operations';
import client from '../apollo/client';

interface AuthorsResponse {
  authors: { id: string; name: string }[];
}

export default function CreateBook() {
  const { data: authorsData } = useQuery<AuthorsResponse>(GET_AUTHORS);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ createBook: { id: string; title: string; price: number; genre: string; status: string; author: { name: string } } } | null>(null);
  const [mode, setMode] = useState<'query' | 'mutation'>('mutation');

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    isbn: '',
    authorId: '',
    genre: 'FICTION',
    status: 'DRAFT',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createBookQuery = async (input: any) => {
    const { data } = await client.query({
      query: gql`
        query CreateBook($input: CreateBookInput!) {
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
      `,
      variables: {
        input
      },
    });

    console.log('Query result:', data);
    return data;
  }

  const createBookMutation = async (input: any): Promise<any> => {
    const { data } = await client.mutate({
      mutation: gql`
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
      `,
      variables: {
        input
      },
    });

    console.log('Mutation result:', data);
    return data;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null)

    try {
      const input = {
        ...form,
        price: parseFloat(form.price),
      }
      const result = mode === 'query'
        ? await createBookQuery(input)
        : await createBookMutation(input);


      if (result?.error) {
        setError(result?.error[0].message);
      } else {
        setData(result.data);
        // Refetch allBooks in Apollo cache so other components stay in sync
        await client.refetchQueries({ include: ['GetAllBooks'] });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    setForm({ title: '', description: '', price: '', isbn: '', authorId: '', genre: 'FICTION', status: 'DRAFT' });
  };

  return (
    <div className="section">
      <h2>➕ Create Book</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value as 'query' | 'mutation')}>
          <option value="query">Query</option>
          <option value="mutation">Mutation</option>
        </select>
      </div>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>ISBN *</label>
          <input name="isbn" value={form.isbn} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Price *</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Author *</label>
          <select name="authorId" value={form.authorId} onChange={handleChange} required>
            <option value="">Select author</option>
            {authorsData?.authors.map((a: any) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Genre</label>
          <select name="genre" value={form.genre} onChange={handleChange}>
            {['FICTION', 'NON_FICTION', 'SCIENCE', 'TECHNOLOGY', 'BIOGRAPHY', 'HISTORY', 'FANTASY', 'MYSTERY', 'ROMANCE', 'THRILLER', 'ACTION'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            {['DRAFT', 'PUBLISHED', 'OUT_OF_PRINT', 'UPCOMING'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="form-group full-width">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
        </div>
        <div className="form-group full-width">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Book'}
          </button>
        </div>
      </form>

      {error && <div className="error">Error: {error}</div>}
      {data && (
        <div className="success">
          ✅ Created: <strong>{data.createBook.title}</strong> (ID: {data.createBook.id})
        </div>
      )}
    </div>
  );
}
