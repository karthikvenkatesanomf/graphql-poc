import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();

definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql-types.ts'),
  outputAs: 'class',
  watch: false,
  emitTypenameField: true,
  customScalarTypeMapping: {
    DateTime: 'Date',
  },
});
