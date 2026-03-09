import { useState } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import client from './apollo/client';
import BookList from './components/BookList';
import AuthorList from './components/AuthorList';
import BooksByGenre from './components/BooksByGenre';
import CreateBook from './components/CreateBook';
import CachingDemo from './components/CachingDemo';
import './App.css';

type Tab = 'books' | 'authors' | 'genre' | 'create' | 'caching';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('books');

  return (
    <ApolloProvider client={client}>
      <div className="app">
        <header>
          <h1>📖 Bookstore — GraphQL React Client</h1>
          <p className="subtitle">
            Consuming NestJS GraphQL API with Apollo Client
          </p>
        </header>

        <nav className="tabs">
          {([
            { key: 'books', label: '📚 All Books' },
            // { key: 'authors', label: '✍️ Authors' },
            // { key: 'genre', label: '🔍 By Genre' },
            { key: 'create', label: '➕ Create Book' },
            // { key: 'caching', label: '⚡ Caching Demo' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key as Tab)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main>
          {activeTab === 'books' && <BookList />}
          {activeTab === 'authors' && <AuthorList />}
          {activeTab === 'genre' && <BooksByGenre />}
          {activeTab === 'create' && <CreateBook />}
          {activeTab === 'caching' && <CachingDemo />}
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
