export type DynamicToken<T> = {
  kind: 'dynamic';
  value: T;
  position: {
    row: number;
    col: number;
  };
};
