import { describe, it } from 'mocha';
import { expect } from 'chai';

import type { Token } from '../src/types/Token';
import { tokenizer } from '../src/tokenizer';
import { mergeTemplateSegments } from '../src/util/mergeTemplateSegments';

describe('tokenizer', () => {
  it('should correctly tokenize naked tag', () => {
    const tok = tokenizer(
      mergeTemplateSegments({
        dynamic: [],
        static: ['<div ></div>'],
      })
    );

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
    const tok = tokenizer(
      mergeTemplateSegments({
        dynamic: [],
        static: ['<div />'],
      })
    );

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
      '/',
      '>',
    ]);
  });

  it('should correctly tokenize tag with attribute', () => {
    const tok = tokenizer(
      mergeTemplateSegments({
        dynamic: [],
        static: ['<div id="foo"></div>'],
      })
    );

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
    const tok = tokenizer(
      mergeTemplateSegments({
        dynamic: [],
        static: ['<div> <p></p></div>'],
      })
    );

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
