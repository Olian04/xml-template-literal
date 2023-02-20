export type ValueToken = {
  kind: 'value';
  value: string;
  position: {
    row: number;
    col: number;
  };
};
