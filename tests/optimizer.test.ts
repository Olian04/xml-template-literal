import { describe, it } from 'mocha';
import { expect } from 'chai';

import { tokenizer } from '../src/tokenizer';
import { optimizer } from '../src/optimizer';

describe('optimizer', () => {
  it('should return a generator', () => {
    const tokRef = optimizer(
      tokenizer({
        dynamic: [],
        static: [],
      })
    );
    expect(typeof tokRef[Symbol.iterator]).to.equal('function');
    expect(typeof tokRef['next']).to.equal('function');
  });

  it("shouldn't modify a token stream with no optimizations needed", () => {
    const tokRef = optimizer(
      tokenizer({
        dynamic: [],
        static: ['<div ></div>'],
      })
    );

    const a = [...tokRef];
    expect(a.map((v: any) => v.type || v.value)).to.deep.equal([
      '<',
      'div',
      '>',
      '<',
      '/',
      'div',
      '>',
    ]);
  });

  it('should correctly optimize a token stream with syntax tokens in an attribute value', () => {
    const tokRef = optimizer(
      tokenizer({
        dynamic: [],
        static: ['<div id="foo=bar"></div>'],
      })
    );

    expect([...tokRef].map((v: any) => v.type || v.value)).to.deep.equal([
      '<',
      'div',
      'id',
      '=',
      '"',
      'foo=bar',
      '"',
      '>',
      '<',
      '/',
      'div',
      '>',
    ]);
  });

  it('should correctly optimize a token stream with syntax tokens as a bare value', () => {
    const tokRef = optimizer(
      tokenizer({
        dynamic: [],
        static: ['<div>foo="bar"</div>'],
      })
    );

    expect([...tokRef].map((v: any) => v.type || v.value)).to.deep.equal([
      '<',
      'div',
      '>',
      'foo="bar"',
      '<',
      '/',
      'div',
      '>',
    ]);
  });
});
