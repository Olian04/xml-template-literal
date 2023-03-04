import { describe, it } from 'mocha';
import { expect } from 'chai';

import { xml, parseXml } from '!api';

describe('[test] api', () => {
  it('should expose XML template literal function', () => {
    expect(typeof xml).to.equal('function');

    const A = { foo: 0 };
    const B = [1, 2, 3];
    const out = xml<typeof A | typeof B>`
      <someTag
        property="value"
        prop=${A}
        >
        <div id="bar">foo</div>
        ${B}
      </someTag>
      <greet name="World" />
      <greet name="World"></greet>
    `;

    expect(typeof out).to.equal('object');
  });
});