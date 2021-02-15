import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Movie {
  readonly id: string;
  readonly title?: string;
  readonly thoughts?: string;
  readonly tags?: (string | null)[];
  readonly rateSeb?: number;
  readonly rateAmy?: number;
  readonly rateDov?: number;
  readonly rateShane?: number;
  readonly corkedBy?: string;
  readonly pickedBy?: string;
  readonly watchedBy?: (string | null)[];
  readonly date?: string;
  constructor(init: ModelInit<Movie>);
  static copyOf(source: Movie, mutator: (draft: MutableModel<Movie>) => MutableModel<Movie> | void): Movie;
}

export declare class Person {
  readonly id: string;
  readonly name?: string;
  constructor(init: ModelInit<Person>);
  static copyOf(source: Person, mutator: (draft: MutableModel<Person>) => MutableModel<Person> | void): Person;
}

export declare class Suggestion {
  readonly id: string;
  readonly name?: string;
  readonly movie?: string;
  readonly description?: string;
  constructor(init: ModelInit<Suggestion>);
  static copyOf(source: Suggestion, mutator: (draft: MutableModel<Suggestion>) => MutableModel<Suggestion> | void): Suggestion;
}