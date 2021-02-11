import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Person {
  readonly id: string;
  readonly Movies?: (Movie | null)[];
  readonly name?: string;
  constructor(init: ModelInit<Person>);
  static copyOf(source: Person, mutator: (draft: MutableModel<Person>) => MutableModel<Person> | void): Person;
}

export declare class Movie {
  readonly id: string;
  readonly title?: string;
  readonly date?: string;
  readonly personID?: string;
  readonly worst?: number;
  readonly best?: number;
  constructor(init: ModelInit<Movie>);
  static copyOf(source: Movie, mutator: (draft: MutableModel<Movie>) => MutableModel<Movie> | void): Movie;
}