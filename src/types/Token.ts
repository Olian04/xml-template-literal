export enum TokenKind {
  Syntax = 'Syntax',
  Dynamic = 'Dynamic',
  Static = 'Static',
}

export enum StaticTokenContext {
  Unknown = 'Unknown',
  Text = 'Text',
  Value = 'Value',
  Label = 'Label',
}

export enum SyntaxToken {
  TagStart = '<',
  TagEnd = '>',
  TagCloseIndicator = '/',
  AttributeAssign = '=',
  AttributeOpenOrClose = '"',
  WhiteSpace = ' ',
}

export type Token<T> =
  | {
      kind: TokenKind.Dynamic;
      value: T;
      codeContext: string;
    }
  | {
      kind: TokenKind.Syntax;
      value: SyntaxToken;
      codeContext: string;
    }
  | {
      kind: TokenKind.Static;
      context: StaticTokenContext;
      value: string;
      codeContext: string;
    };
