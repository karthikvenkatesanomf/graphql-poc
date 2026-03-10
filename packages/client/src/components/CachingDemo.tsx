import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { UPDATE_BOOK_MUTATION, UPDATE_BOOK_QUERY } from '../graphql/operations';

interface LogEntry {
  id: number;
  time: string;
  type: 'query' | 'mutation';
  cached: boolean;
  bookId: string;
  price: number;
  duration: number;
  result: any;
}

interface UpdateBookResponse {
  updateBook: {
    id: string;
    title: string;
    price: number;
  };
}

export default function CachingDemo() {
  const [bookId, setBookId] = useState('b1');
  const [price, setPrice] = useState(19.99);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [queryCount, setQueryCount] = useState({ total: 0, cached: 0, server: 0 });
  const [mutationCount, setMutationCount] = useState({ total: 0, server: 0 });

  // Query — uses Apollo cache (cache-first by default)
  const [runUpdateQuery] = useLazyQuery<UpdateBookResponse>(UPDATE_BOOK_QUERY, {
    fetchPolicy: 'cache-first',
  });

  // Mutation — always hits server
  const [runUpdateMutation] = useMutation<UpdateBookResponse>(UPDATE_BOOK_MUTATION);

  const now = () => new Date().toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  const addLog = (entry: Omit<LogEntry, 'id' | 'time'>) => {
    setLogs(prev => [{ ...entry, id: Date.now(), time: now() }, ...prev]);
  };

  // ── Run as Query (cached) ──
  const handleQuery = async () => {
    const start = performance.now();
    try {
      const { data, error } = await runUpdateQuery({
        variables: { id: bookId, price },
      });
      const duration = Math.round(performance.now() - start);
      const isCached = duration < 5; // Under 5ms = likely from cache

      setQueryCount(prev => ({
        total: prev.total + 1,
        cached: prev.cached + (isCached ? 1 : 0),
        server: prev.server + (isCached ? 0 : 1),
      }));

      addLog({
        type: 'query',
        cached: isCached,
        bookId,
        price,
        duration,
        result: error ? error.message : data?.updateBook,
      });
    } catch (err: any) {
      addLog({
        type: 'query',
        cached: false,
        bookId,
        price,
        duration: Math.round(performance.now() - start),
        result: err.message,
      });
    }
  };

  // ── Run as Mutation (always server) ──
  const handleMutation = async () => {
    const start = performance.now();
    try {
      const result = await runUpdateMutation({
        variables: { id: bookId, price },
      });
      const duration = Math.round(performance.now() - start);
      const { data, errors } = result as any;

      setMutationCount(prev => ({
        total: prev.total + 1,
        server: prev.server + 1,
      }));

      addLog({
        type: 'mutation',
        cached: false,
        bookId,
        price,
        duration,
        result: errors ? errors[0].message : data?.updateBook,
      });
    } catch (err: any) {
      addLog({
        type: 'mutation',
        cached: false,
        bookId,
        price,
        duration: Math.round(performance.now() - start),
        result: err.message,
      });
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setQueryCount({ total: 0, cached: 0, server: 0 });
    setMutationCount({ total: 0, server: 0 });
  };

  return (
    <div className="section">
      <h2>⚡ Caching Demo — Query vs Mutation</h2>
      <p className="text-muted">
        Click "Run as Query" multiple times with the same values. 
        The first call hits the server, subsequent calls return <strong>cached</strong> data.
        "Run as Mutation" <strong>always</strong> hits the server.
        <br />Watch your NestJS terminal for server logs!
      </p>

      <div className="demo-controls">
        <div className="form-row">
          <div className="form-group">
            <label>Book ID</label>
            <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
              <option value="b1">b1 — 1984</option>
              <option value="b2">b2 — Animal Farm</option>
              <option value="b3">b3 — Harry Potter 1</option>
              <option value="b5">b5 — The Shining</option>
            </select>
          </div>
          <div className="form-group">
            <label>New Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="demo-buttons">
          <button className="btn btn-danger" onClick={handleQuery}>
            ⚠️ Run as QUERY (cached)
          </button>
          <button className="btn btn-success" onClick={handleMutation}>
            ✅ Run as MUTATION (always server)
          </button>
          <button className="btn btn-secondary" onClick={clearLogs}>
            Clear Logs
          </button>
        </div>
      </div>

      {/* Counters */}
      <div className="counter-row">
        <div className="counter-box danger">
          <div className="counter-label">Query Calls</div>
          <div className="counter-stats">
            <span>Total: <strong>{queryCount.total}</strong></span>
            <span>Cache Hits: <strong className="text-danger">{queryCount.cached}</strong></span>
            <span>Server Hits: <strong>{queryCount.server}</strong></span>
          </div>
        </div>
        <div className="counter-box success">
          <div className="counter-label">Mutation Calls</div>
          <div className="counter-stats">
            <span>Total: <strong>{mutationCount.total}</strong></span>
            <span>Server Hits: <strong>{mutationCount.server}</strong></span>
            <span className="text-muted">(Always hits server)</span>
          </div>
        </div>
      </div>

      {/* Log Entries */}
      <div className="log-container">
        {logs.length === 0 && (
          <div className="text-muted" style={{ padding: '20px', textAlign: 'center' }}>
            Click a button above to start the demo
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className={`log-entry ${log.type} ${log.cached ? 'cached' : 'server'}`}>
            <span className="log-time">{log.time}</span>
            <span className={`log-badge ${log.cached ? 'badge-cached' : log.type === 'query' ? 'badge-query' : 'badge-mutation'}`}>
              {log.cached ? '📦 CACHED' : log.type === 'query' ? '🔴 QUERY→SERVER' : '🟢 MUTATION→SERVER'}
            </span>
            <span className="log-detail">
              Book: {log.bookId} → ${log.price} ({log.duration}ms)
            </span>
            <span className="log-result">
              {typeof log.result === 'object'
                ? `✓ ${log.result?.title} [$${log.result?.price}]`
                : log.result}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
