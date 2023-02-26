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
  it('should handle a real usage senario', () => {
    const A = { foo: 0 };
    const B = [1, 2, 3];
    const tok = tokenizer(
      mergeTemplateSegments({
        static: [
          '\n    <someTag\n    property="value"\n    prop=',
          '\n    >\n    <div id="bar">foo</div>\n    ',
          '\n  </someTag>\n  <greet name="World" />\n   <greet name="World"></greet> ',
        ],
        dynamic: [A, B],
      })
    );

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'someTag',
      'property',
      '=',
      '"',
      'value',
      '"',
      'prop',
      '=',
      A,
      '>',
      '<',
      'div',
      'id',
      '=',
      '"',
      'bar',
      '"',
      '>',
      'foo',
      '<',
      '/',
      'div',
      '>',
      B,
      '<',
      '/',
      'someTag',
      '>',
      '<',
      'greet',
      'name',
      '=',
      '"',
      'World',
      '"',
      '/',
      '>',
      '<',
      'greet',
      'name',
      '=',
      '"',
      'World',
      '"',
      '>',
      '<',
      '/',
      'greet',
      '>',
    ]);
  });
});
