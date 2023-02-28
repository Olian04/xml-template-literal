export const enum TokenKind {
  Syntax = 'Syntax',
  Data = 'Data',
  Text = 'Text',
}

export type SyntaxToken = {
  kind: TokenKind.Syntax;
  value: '<' | '>' | '/' | '=' | '"' | ' ' | '</' | '/>';
};

export type TextToken = {
  kind: TokenKind.Text;
  value: string;
};

export type DataToken<T> = {
  kind: TokenKind.Data;
  value: T;
};

export type Token<T> = DataToken<T> | SyntaxToken | TextToken;
