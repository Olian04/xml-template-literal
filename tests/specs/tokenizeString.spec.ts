import { describe, it } from 'mocha';
import { expect } from 'chai';

import type { Token } from '!types/Token';
import { tokenizeString } from '!tokenizer/tokenizeString';

describe('[spec] tokenizeString', () => {
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
});
