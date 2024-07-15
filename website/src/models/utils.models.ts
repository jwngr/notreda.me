export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Optional<T> = {
  [P in keyof T]?: T[P];
};

export type QueryParams = Record<string, string>;
