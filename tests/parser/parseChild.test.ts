import { describe, it } from 'mocha';
import { expect } from 'chai';

import { mergeTemplateSegments } from '!util/mergeTemplateSegments';
import { tokenizer } from '!tokenizer';
import { parseChild } from '!parser/parseChild';
import { createConsumeStream } from '!parser/util/createConsumeStream';

describe('parseChild', () => {
  it('should produce the same AST when parsing a regular tag and an equivalent self-closing tag', () => {
    const regular = parseChild(
      createConsumeStream(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div></div>'],
          })
        )
      )
    );

    const selfClose = parseChild(
      createConsumeStream(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div/>'],
          })
        )
      )
    );

    expect(regular).to.deep.equal(selfClose);
  });
});
