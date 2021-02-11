import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Movie {
  readonly id: string;
  readonly title?: string;
  readonly date?: string;
  readonly points?: number;
  readonly personID: string;
  constructor(init: ModelInit<Movie>);
  static copyOf(source: Movie, mutator: (draft: MutableModel<Movie>) => MutableModel<Movie> | void): Movie;
}

export declare class Person {
  readonly id: string;
  readonly name?: string;
  readonly Movies?: (Movie | null)[];
  constructor(init: ModelInit<Person>);
  static copyOf(source: Person, mutator: (draft: MutableModel<Person>) => MutableModel<Person> | void): Person;
}