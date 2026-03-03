import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Security ──────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  // ── Compression ───────────────────────────────────────────
  app.use(compression());

  // ── CORS ──────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // ── Swagger / OpenAPI ─────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bookstore GraphQL API')
    .setDescription(
      'REST interface documenting the GraphQL Bookstore API.\n\n' +
      '**GraphQL Playground** → `/graphql`\n\n' +
      'This Swagger UI mirrors every GraphQL query and mutation as a REST endpoint ' +
      'for documentation and quick testing purposes.',
    )
    .setVersion('1.0')
    .addTag('Authors', 'CRUD operations for authors')
    .addTag('Books', 'CRUD operations for books (filterable, sortable, paginated)')
    .addTag('Search', 'Union-type search across authors and books')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);

  logger.log(`🚀 GraphQL  → http://localhost:${port}/graphql`);
  logger.log(`📖 Swagger  → http://localhost:${port}/api/docs`);
}

bootstrap();
