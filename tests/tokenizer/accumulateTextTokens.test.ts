import { describe, it, expect } from 'vitest';

import type { Token } from '../../src/types/Token';
import { tokenizeString } from '../../src/tokenizer/tokenizeString';
import { accumulateTextTokens } from '../../src/tokenizer/accumulateTextTokens';

describe('accumulateTextTokens', () => {
  it('should correctly tokenize naked tag', () => {
    const tok = accumulateTextTokens(tokenizeString('<div ></div>'));

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
      '>',
      '<',
      '/',
      'div',
      '>',
    ]);
  });

  it('should correctly tokenize naked self-closing tag', () => {
    const tok = accumulateTextTokens(tokenizeString('<div />'));

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
      '/',
      '>',
    ]);
  });

  it('should correctly tokenize tag with attribute', () => {
    const tok = accumulateTextTokens(tokenizeString('<div id="foo" />'));

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
      'id',
      '=',
      '"',
      'foo',
      '"',
      ' ',
      '/',
      '>',
    ]);
  });
});
