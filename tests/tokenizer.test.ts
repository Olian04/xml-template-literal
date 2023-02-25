import { describe, it } from 'mocha';
import { expect } from 'chai';

import { tokenizer } from '../src/tokenizer';

describe('tokenizer', () => {
  it('should return an array', () => {
    const tok = tokenizer({
      dynamic: [],
      static: [],
    });
    expect(Array.isArray(tok)).true;
  });

  it('should correctly tokenize naked tag', () => {
    const tok = tokenizer({
      dynamic: [],
      static: ['<div ></div>'],
    });

    expect([...tok].map((v: any) => v.type || v.value)).to.deep.equal([
      '<',
      'div',
      '>',
      '<',
      '/',
      'div',
      '>',
    ]);
  });

  it('should correctly tokenize tag with attribute', () => {
    const tok = tokenizer({
      dynamic: [],
      static: ['<div id="foo"></div>'],
    });

    expect([...tok].map((v: any) => v.type || v.value)).to.deep.equal([
      '<',
      'div',
      'id',
      '=',
      '"',
      'foo',
      '"',
      '>',
      '<',
      '/',
      'div',
      '>',
    ]);
  });
});
