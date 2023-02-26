export type AstAttribute<T = unknown> = {
  key: string;
  value: (string | number | T)[];
};
