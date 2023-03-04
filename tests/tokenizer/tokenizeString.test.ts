import { describe, it } from 'mocha';
import { expect } from 'chai';

import type { Token } from '!types/Token';
import { tokenizeString } from '!tokenizer/tokenizeString';

describe('tokenizeString', () => {
  it('should correctly tokenize naked tag', () => {
    const tok = tokenizeString('<div ></div>');

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'd',
      'i',
      'v',
      ' ',
      '>',
      '<',
      '/',
      'd',
      'i',
      'v',
      '>',
    ]);
  });

  it('should correctly tokenize naked self-closing tag', () => {
    const tok = tokenizeString('<div />');

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'd',
      'i',
      'v',
      ' ',
      '/',
      '>',
    ]);
  });

  it('should correctly tokenize tag with attribute', () => {
    const tok = tokenizeString('<div id="foo" />');

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
      '/',
      '>',
    ]);
  });
});
