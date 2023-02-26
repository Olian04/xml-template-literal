import {
  Token,
  SyntaxToken,
  TokenKind,
  StaticTokenContext,
} from './types/Token';

const isStaticSegment = (v: number) => v % 2 === 0;
const clamp = (upper: number, lower: number, value: number) =>
  value > upper ? upper : value < lower ? lower : value;

export function* tokenizer<T>(originalSegments: {
  static: string[];
  dynamic: T[];
}): Generator<Token<T>> {
  const segments = new Array(
    originalSegments.static.length + originalSegments.dynamic.length
  )
    .fill(0)
    .map((_, i) => {
      if (isStaticSegment(i)) {
        return {
          type: 'static' as const,
          value: originalSegments.static[Math.floor(i / 2)],
        };
      }
      return {
        type: 'dynamic' as const,
        value: originalSegments.dynamic[Math.floor(i / 2)],
      };
    });

  const dynamicPlaceholder = '${...}';
  const stringCode = segments
    .map(({ type, value }) => (type === 'dynamic' ? dynamicPlaceholder : value))
    .join('');

  const codeContextWindowSize = 10;
  let codeContextWindowIndex = 0;
  for (const segment of segments) {
    if (segment.type === 'static') {
      let valueBuffer = '';
      for (let index = 0; index < segment.value.length; index++) {
        for (const [pattern, syntaxKind] of [
          [/^\//, SyntaxToken.TagCloseIndicator],
          [/^</, SyntaxToken.TagStart],
          [/^>/, SyntaxToken.TagEnd],
          [/^=/, SyntaxToken.AttributeAssign],
          [/^"/, SyntaxToken.AttributeOpenOrClose],
          [/^ +/, SyntaxToken.WhiteSpace],
        ] as const) {
          const maybeMatch = pattern.exec(segment.value.substring(index));
          if (!maybeMatch) {
            continue;
          }
          if (valueBuffer) {
            yield {
              kind: TokenKind.Static,
              context: StaticTokenContext.Unknown,
              value: valueBuffer,
              codeContext: stringCode.substring(
                clamp(
                  0,
                  stringCode.length,
                  codeContextWindowIndex +
                    index -
                    valueBuffer.length -
                    codeContextWindowSize / 2
                ),
                clamp(
                  0,
                  stringCode.length,
                  codeContextWindowIndex +
                    index -
                    valueBuffer.length +
                    codeContextWindowSize / 2
                )
              ),
            };
            valueBuffer = '';
          }
          yield {
            kind: TokenKind.Syntax,
            value: maybeMatch[0] as typeof syntaxKind,
            codeContext: stringCode.substring(
              clamp(
                0,
                stringCode.length,
                codeContextWindowIndex + index - codeContextWindowSize / 2
              ),
              clamp(
                0,
                stringCode.length,
                codeContextWindowIndex + index + codeContextWindowSize / 2
              )
            ),
          };
          index += maybeMatch[0].length;
          break;
        }
        valueBuffer += segment.value[index];
      }
      codeContextWindowIndex += segment.value.length;
    } else if (segment.type === 'dynamic') {
      yield {
        kind: TokenKind.Dynamic,
        value: segment.value,
        codeContext: stringCode.substring(
          clamp(
            0,
            stringCode.length,
            codeContextWindowIndex - codeContextWindowSize / 2
          ),
          clamp(
            0,
            stringCode.length,
            codeContextWindowIndex + codeContextWindowSize / 2
          )
        ),
      };
      codeContextWindowIndex += dynamicPlaceholder.length;
    } else {
      throw new Error(`Unknown segment: ${segment}`);
    }
  }
}
