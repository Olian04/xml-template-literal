export type SyntaxToken = {
  kind: 'syntax';
  value: '<' | '>' | '/' | '=' | '"';
  position: {
    row: number;
    col: number;
  };
};
