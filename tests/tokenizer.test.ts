import { describe, it } from 'mocha';
import { expect } from 'chai';

import { tokenizer } from '../src/tokenizer';
import { Token } from '../src/types/Token';

describe('tokenizer', () => {
  it('should correctly tokenize naked tag', () => {
    const tok = tokenizer({
      dynamic: [],
      static: ['<div ></div>'],
    });

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
    const tok = tokenizer({
      dynamic: [],
      static: ['<div />'],
    });

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
      '/',
      '>',
    ]);
  });

  it('should correctly tokenize tag with attribute', () => {
    const tok = tokenizer({
      dynamic: [],
      static: ['<div id="foo"></div>'],
    });

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
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

  it('should correctly tokenize tag with children', () => {
    const tok = tokenizer({
      dynamic: [],
      static: ['<div> <p></p></div>'],
    });

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      '>',
      ' ',
      '<',
      'p',
      '>',
      '<',
      '/',
      'p',
      '>',
      '<',
      '/',
      'div',
      '>',
    ]);
  });
});
