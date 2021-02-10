import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Person {
  readonly id: string;
  readonly name?: string;
  readonly points?: number;
  readonly movies?: (Movie | null)[];
  constructor(init: ModelInit<Person>);
  static copyOf(source: Person, mutator: (draft: MutableModel<Person>) => MutableModel<Person> | void): Person;
}

export declare class Movie {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly date?: string;
  readonly worstVotes?: number;
  readonly bestVotes?: number;
  readonly personID: string;
  constructor(init: ModelInit<Movie>);
  static copyOf(source: Movie, mutator: (draft: MutableModel<Movie>) => MutableModel<Movie> | void): Movie;
}