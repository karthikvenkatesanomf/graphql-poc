import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AuthorEntity } from '../common/entities';
import authorsData from '../data/authors.json';

@Injectable()
export class AuthorsService {
  private authors: AuthorEntity[] = JSON.parse(JSON.stringify(authorsData));

  findAll(): AuthorEntity[] {
    return this.authors;
  }

  findById(id: string): AuthorEntity | undefined {
    return this.authors.find((a) => a.id === id);
  }

  findByField(field: keyof AuthorEntity, value: any): AuthorEntity[] | undefined {
    return this.authors.filter((a) => a[field] === value);
  }

  create(input: Partial<AuthorEntity>): AuthorEntity {
    const author: AuthorEntity = {
      id: uuidv4(),
      name: input.name!,
      bio: input.bio,
      birthDate: input.birthDate,
      nationality: input.nationality,
    };
    this.authors.push(author);
    return author;
  }
}
