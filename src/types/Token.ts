export const enum TokenKind {
  Syntax = 'Syntax',
  Data = 'Data',
  Text = 'Text',
  Whitespace = 'Whitespace',
  EndOfFile = 'EndOfFile',
}

export type SyntaxToken = {
  kind: TokenKind.Syntax;
  value: '<' | '>' | '/' | '=' | '"' | '</' | '/>';
};

export type WhitespaceToken = {
  kind: TokenKind.Whitespace;
  value: ' ' | '\n' | '\r' | '\t';
};

export type TextToken = {
  kind: TokenKind.Text;
  value: string;
};

export type DataToken<T> = {
  kind: TokenKind.Data;
  value: T;
};

export type EndOfFileToken = {
  kind: TokenKind.EndOfFile;
  value: null;
};

export type Token<T> = DataToken<T> | SyntaxToken | TextToken | WhitespaceToken | EndOfFileToken;
export type StaticToken = Exclude<Token<unknown>, DataToken<unknown>>;
