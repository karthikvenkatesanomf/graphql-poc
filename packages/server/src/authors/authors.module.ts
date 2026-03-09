import { Module, forwardRef } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [forwardRef(() => BooksModule)],
  providers: [AuthorsService, AuthorsResolver],
  exports: [AuthorsService],
})
export class AuthorsModule {}
