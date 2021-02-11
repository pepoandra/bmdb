// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Person, Movie } = initSchema(schema);

export {
  Person,
  Movie
};