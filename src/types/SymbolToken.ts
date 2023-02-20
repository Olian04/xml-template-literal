export type SymbolToken = {
  kind: 'symbol';
  value: string;
  position: {
    row: number;
    col: number;
  };
};
