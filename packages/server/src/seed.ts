import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { authors, books, NewAuthor, NewBook } from './drizzle/schema';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  user: process.env.DB_USERNAME || 'graphql_user',
  password: process.env.DB_PASSWORD || 'graphql_pass',
  database: process.env.DB_NAME || 'bookstore',
});

const db = drizzle(pool);

const authorData: NewAuthor[] = [
  { id: 'a1', name: 'George Orwell', bio: "English novelist, essayist, and critic known for his sharp criticism of political oppression. His works, particularly '1984' and 'Animal Farm', remain among the most influential books of the 20th century.", birthDate: '1903-06-25', nationality: 'British' },
  { id: 'a2', name: 'J.K. Rowling', bio: 'British author best known for writing the Harry Potter fantasy series, which has won multiple awards and sold more than 500 million copies worldwide.', birthDate: '1965-07-31', nationality: 'British' },
  { id: 'a3', name: 'Stephen King', bio: 'American author of horror, supernatural fiction, suspense, and fantasy novels. His books have sold more than 350 million copies and have been adapted into numerous films and TV series.', birthDate: '1947-09-21', nationality: 'American' },
  { id: 'a4', name: 'Agatha Christie', bio: 'English writer known for her 66 detective novels and 14 short story collections, particularly those revolving around Hercule Poirot and Miss Marple.', birthDate: '1890-09-15', nationality: 'British' },
  { id: 'a5', name: 'Isaac Asimov', bio: "American writer and professor of biochemistry, known for his works of science fiction and popular science. He is considered one of the 'Big Three' science-fiction writers.", birthDate: '1920-01-02', nationality: 'American' },
];

const bookData: NewBook[] = [
  { id: 'b1', title: '1984', description: 'A dystopian novel set in a totalitarian society ruled by Big Brother, exploring themes of surveillance, propaganda, and individual freedom.', price: '12.99', isbn: '978-0451524935', authorId: 'a1', genre: 'FICTION', status: 'PUBLISHED', publishedDate: '1949-06-08', pages: 328 },
  { id: 'b2', title: 'Animal Farm', description: 'An allegorical novella reflecting events leading up to the Russian Revolution and the Stalinist era of the Soviet Union.', price: '9.99', isbn: '978-0451526342', authorId: 'a1', genre: 'FICTION', status: 'PUBLISHED', publishedDate: '1945-08-17', rating: '4.6', pages: 112 },
  { id: 'b3', title: "Harry Potter and the Philosopher's Stone", description: 'The first novel in the Harry Potter series, following a young wizard who discovers his magical heritage on his eleventh birthday.', price: '14.99', isbn: '978-0747532699', authorId: 'a2', genre: 'FANTASY', status: 'PUBLISHED', publishedDate: '1997-06-26', rating: '4.9', pages: 223 },
  { id: 'b4', title: 'Harry Potter and the Chamber of Secrets', description: 'Harry returns to Hogwarts for his second year to find the school plagued by a series of mysterious attacks on students.', price: '14.99', isbn: '978-0747538486', authorId: 'a2', genre: 'FANTASY', status: 'PUBLISHED', publishedDate: '1998-07-02', rating: '4.8', pages: 251 },
  { id: 'b5', title: 'The Shining', description: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.', price: '11.99', isbn: '978-0307743657', authorId: 'a3', genre: 'THRILLER', status: 'PUBLISHED', publishedDate: '1977-01-28', rating: '4.5', pages: 447 },
  { id: 'b6', title: 'It', description: 'A group of children confront a shapeshifting evil clown that exploits the fears of its victims to disguise itself while hunting its prey.', price: '13.99', isbn: '978-1501142970', authorId: 'a3', genre: 'THRILLER', status: 'PUBLISHED', publishedDate: '1986-09-15', rating: '4.4', pages: 1138 },
  { id: 'b7', title: 'Murder on the Orient Express', description: 'Detective Hercule Poirot investigates the murder of a wealthy American aboard the famous Orient Express train.', price: '10.99', isbn: '978-0062693662', authorId: 'a4', genre: 'MYSTERY', status: 'PUBLISHED', publishedDate: '1934-01-01', rating: '4.6', pages: 274 },
  { id: 'b8', title: 'And Then There Were None', description: 'Ten strangers are lured to a remote island and are killed one by one in accordance with a children\'s nursery rhyme.', price: '10.99', isbn: '978-0062073488', authorId: 'a4', genre: 'MYSTERY', status: 'PUBLISHED', publishedDate: '1939-11-06', rating: '4.7', pages: 272 },
  { id: 'b9', title: 'Foundation', description: 'A mathematician develops a theory to predict the future and creates a foundation to preserve knowledge as the Galactic Empire crumbles.', price: '15.99', isbn: '978-0553293357', authorId: 'a5', genre: 'SCIENCE', status: 'PUBLISHED', publishedDate: '1951-05-01', rating: '4.5', pages: 244 },
  { id: 'b10', title: 'I, Robot', description: 'A collection of interconnected stories about the interaction of humans and robots, exploring the Three Laws of Robotics.', price: '12.99', isbn: '978-0553294385', authorId: 'a5', genre: 'SCIENCE', status: 'PUBLISHED', publishedDate: '1950-12-02', rating: '4.3', pages: 224 },
  { id: 'b11', title: 'The Dark Tower: The Gunslinger', description: "The first book in Stephen King's epic Dark Tower series, following Roland Deschain as he pursues the Man in Black.", price: '12.99', isbn: '978-1501143519', authorId: 'a3', genre: 'FANTASY', status: 'PUBLISHED', publishedDate: '1982-06-10', rating: '4.2', pages: 224 },
  { id: 'b12', title: 'Harry Potter and the Prisoner of Azkaban', description: "Harry's third year at Hogwarts is marked by the escape of Sirius Black, a convicted murderer believed to be after Harry.", price: '15.99', isbn: '978-0747542155', authorId: 'a2', genre: 'FANTASY', status: 'PUBLISHED', publishedDate: '1999-07-08', rating: '4.9', pages: 317 },
];

async function seed() {
  console.log('Connecting to database...');

  // Clear existing data (books first due to FK)
  await db.execute(sql`DELETE FROM books`);
  await db.execute(sql`DELETE FROM authors`);
  console.log('Cleared existing data.');

  // Insert authors
  await db.insert(authors).values(authorData);
  console.log(`Seeded ${authorData.length} authors.`);

  // Insert books
  await db.insert(books).values(bookData);
  console.log(`Seeded ${bookData.length} books.`);

  await pool.end();
  console.log('Done! Database seeded successfully.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
