export interface AuthorEntity {
  id: string;
  name: string;
  bio?: string;
  birthDate?: string;
  nationality?: string;
}

export interface BookEntity {
  id: string;
  title: string;
  description?: string;
  price: number;
  isbn: string;
  authorId: string;
  genre: string;
  status: string;
  publishedDate?: string;
  rating?: number;
  pages?: number;
}
