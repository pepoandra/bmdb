// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Movie, Person } = initSchema(schema);

export {
  Movie,
  Person
};