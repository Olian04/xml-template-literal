import { describe, it } from 'mocha';
import { expect } from 'chai';

import { tokenizer } from '../src/tokenizer';
import { optimizer } from '../src/optimizer';
import { mergeTemplateSegments } from '../src/util/mergeTemplateSegments';

describe('optimizer', () => {
  it('should return an array', () => {
    const tokRef = optimizer(
      tokenizer(
        mergeTemplateSegments({
          dynamic: [],
          static: [],
        })
      )
    );
    expect(Array.isArray(tokRef)).true;
  });

  it("shouldn't modify a token stream with no optimizations needed", () => {
    const tokRef = optimizer(
      tokenizer(
        mergeTemplateSegments({
          dynamic: [],
          static: ['<div ></div>'],
        })
      )
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
      tokenizer(
        mergeTemplateSegments({
          dynamic: [],
          static: ['<div id="foo=bar"></div>'],
        })
      )
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
      tokenizer(
        mergeTemplateSegments({
          dynamic: [],
          static: ['<div>foo="bar"</div>'],
        })
      )
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

  it('should correctly optimize a token stream dynamic and static parts', () => {
    const A = { foo: 0 };
    const tokRef = optimizer(
      tokenizer(
        mergeTemplateSegments({
          dynamic: [A],
          static: ['<someTag property="value" prop="', '"></someTag>'],
        })
      )
    );

    expect([...tokRef].map((v: any) => v.type || v.value)).to.deep.equal([
      '<',
      'someTag',
      'property',
      '=',
      '"',
      'value',
      '"',
      'prop',
      '=',
      '"',
      A,
      '"',
      '>',
      '<',
      '/',
      'someTag',
      '>',
    ]);
  });
});
