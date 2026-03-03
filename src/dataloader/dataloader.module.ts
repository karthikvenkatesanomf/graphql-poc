import { Module, forwardRef } from '@nestjs/common';
import { DataLoaderService } from './dataloader.service';
import { AuthorsModule } from '../authors/authors.module';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [
    forwardRef(() => AuthorsModule),
    forwardRef(() => BooksModule),
  ],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}
