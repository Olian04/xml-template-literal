import { describe, it, expect } from 'vitest';

import type { Token } from '../../src/types/Token';
import { tokenizeString } from '../../src/tokenizer/tokenizeString';
import { produceJoinedSyntaxTokens } from '../../src/tokenizer/produceJoinedSyntaxTokens';

describe('produceJoinedSyntaxTokens', () => {
  it('should correctly tokenize naked tag', () => {
    const tok = produceJoinedSyntaxTokens(tokenizeString('<div ></div>'));

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'd',
      'i',
      'v',
      ' ',
      '>',
      '</',
      'd',
      'i',
      'v',
      '>',
    ]);
  });

  it('should correctly tokenize naked self-closing tag', () => {
    const tok = produceJoinedSyntaxTokens(tokenizeString('<div />'));

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'd',
      'i',
      'v',
      ' ',
      '/>',
    ]);
  });

  it('should correctly tokenize tag with attribute', () => {
    const tok = produceJoinedSyntaxTokens(tokenizeString('<div id="foo" />'));

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'd',
      'i',
      'v',
      ' ',
      'i',
      'd',
      '=',
      '"',
      'f',
      'o',
      'o',
      '"',
      ' ',
      '/>',
    ]);
  });
});
