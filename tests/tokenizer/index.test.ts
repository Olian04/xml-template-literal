import { describe, it } from 'mocha';
import { expect } from 'chai';

import type { Token } from '!types/Token';
import { tokenizer } from '!tokenizer';
import { mergeTemplateSegments } from '!util/mergeTemplateSegments';

export const t = <T>(
  staticSegments: TemplateStringsArray,
  ...dynamicSegments: T[]
) =>
  mergeTemplateSegments({
    dynamic: dynamicSegments,
    static: [...staticSegments],
  });

describe('tokenizer', () => {
  it('should correctly tokenize naked tag', () => {
    const tok = tokenizer(t`<div ></div>`);

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
      '>',
      '</',
      'div',
      '>',
    ]);
  });

  it('should correctly tokenize naked self-closing tag', () => {
    const tok = tokenizer(t`<div />`);

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
      '/>',
    ]);
  });

  it('should correctly not produce joined syntax tokens when there is a whitespace between the syntax tokens', () => {
    const tok = tokenizer(t`<div/ >`);

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      '/',
      ' ',
      '>',
    ]);
  });

  it('should correctly tokenize tag with string attribute', () => {
    const tok = tokenizer(t`<div id="foo"></div>`);

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
      '</',
      'div',
      '>',
    ]);
  });

  it('should correctly tokenize tag with data attribute', () => {
    const A = { foo: 0 };
    const tok = tokenizer(t`<div id=${A}></div>`);

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
      'id',
      '=',
      A,
      '>',
      '</',
      'div',
      '>',
    ]);
  });

  it('should correctly tokenize tag with composite attribute', () => {
    const A = { foo: 0 };
    const tok = tokenizer(t`<div id="foo${A}"></div>`);

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      ' ',
      'id',
      '=',
      '"',
      'foo',
      A,
      '"',
      '>',
      '</',
      'div',
      '>',
    ]);
  });

  it('should correctly tokenize tag with children', () => {
    const tok = tokenizer(t`<div><p> </p></div>`);

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '<',
      'div',
      '>',
      '<',
      'p',
      '>',
      ' ',
      '</',
      'p',
      '>',
      '</',
      'div',
      '>',
    ]);
  });

  it('should handle a real usage scenario', () => {
    const A = { foo: 0 };
    const B = [1, 2, 3];
    const tok = tokenizer(t<typeof A | typeof B>`
      <someTag
        property="value"
        prop=${A}
        >
        <div id="bar">foo</div>
        ${B}
      </someTag>
      <greet name="World" />
      <greet name="World"></greet>
    `);

    expect([...tok].map((v: Token<any>) => v.value)).to.deep.equal([
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      '<',
      'someTag',
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      'property',
      '=',
      '"',
      'value',
      '"',
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      'prop',
      '=',
      A,
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      '>',
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      '<',
      'div',
      ' ',
      'id',
      '=',
      '"',
      'bar',
      '"',
      '>',
      'foo',
      '</',
      'div',
      '>',
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      B,
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      '</',
      'someTag',
      '>',
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      '<',
      'greet',
      ' ',
      'name',
      '=',
      '"',
      'World',
      '"',
      ' ',
      '/>',
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      ' ',
      '<',
      'greet',
      ' ',
      'name',
      '=',
      '"',
      'World',
      '"',
      '>',
      '</',
      'greet',
      '>',
      '\n',
      ' ',
      ' ',
      ' ',
      ' ',
    ]);
  });
});
