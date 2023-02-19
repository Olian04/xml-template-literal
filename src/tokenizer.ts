import { UnexpectedToken } from './errors/UnexpectedToken';

const isStaticSegment = (v: number) => v % 2 === 0;

type DynamicToken<T> = {
  kind: 'dynamic';
  position: {
    row: number;
    col: number;
  };
  value: T;
};

type SyntaxToken = {
  kind: 'syntax';
  type: '<' | '>' | '/' | '=' | '"';
  position: {
    row: number;
    col: number;
  };
};

type SymbolToken = {
  kind: 'symbol';
  value: string;
  position: {
    row: number;
    col: number;
  };
};

type Token<T> = DynamicToken<T> | SyntaxToken | SymbolToken;

export function* tokenizer<T>(segments: {
  static: string[];
  dynamic: T[];
}): Generator<Token<T>, null, unknown> {
  let currentRow = 0;
  let currentCol = 0;
  let staticIndex = 0;
  let dynamicIndex = 0;
  for (let i = 0; i < segments.static.length + segments.dynamic.length; i++) {
    if (isStaticSegment(i)) {
      const staticSegment = segments.static[staticIndex];
      let index = 0;
      while (index < staticSegment.length) {
        const maybeWhiteSpace = /^ +/.exec(staticSegment.substring(index));
        if (maybeWhiteSpace) {
          index += maybeWhiteSpace[0].length;
          continue;
        }

        const maybeSyntax = /^[<>/="]/.exec(staticSegment.substring(index));
        if (maybeSyntax) {
          yield {
            kind: 'syntax',
            type: maybeSyntax[0] as any,
            position: {
              row: currentRow,
              col: currentCol,
            },
          };
          index += maybeSyntax[0].length;
          currentCol += maybeSyntax[0].length;
          continue;
        }

        const maybeSymbol = /^\S+(?<=[^<>/="])/.exec(
          staticSegment.substring(index)
        );
        if (maybeSymbol) {
          yield {
            kind: 'symbol',
            value: maybeSymbol[0],
            position: {
              row: currentRow,
              col: currentCol,
            },
          };
          index += maybeSymbol[0].length;
          currentCol += maybeSymbol[0].length;
          continue;
        }

        const maybeNewline = /^\n+$/.exec(staticSegment.substring(index));
        if (maybeNewline) {
          currentCol = 0;
          currentRow += 1;
        }

        throw new UnexpectedToken(
          `"${staticSegment.charAt(index)}" at ${currentRow}:${currentCol}`
        );
      }
    } else {
      yield {
        kind: 'dynamic',
        value: segments.dynamic[dynamicIndex],
        position: {
          row: currentRow,
          col: currentCol,
        },
      };
      currentCol += 1;
      dynamicIndex += 1;
    }
  }
  return null;
}
