import { describe, it } from 'mocha';
import { expect } from 'chai';

import { tokenizer } from '../src/tokenizer';

describe('tokenizer', () => {
  it('should return a generator', () => {
    const tok = tokenizer({
      dynamic: [],
      static: [],
    });
    expect(typeof tok[Symbol.iterator]).to.equal('function');
    expect(typeof tok['next']).to.equal('function');
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
