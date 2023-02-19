import { describe, it } from 'mocha';
import { expect } from 'chai';

import { xml } from '../src/api';

describe('api', () => {
  it('should expose XML template literal function', () => {
    expect(typeof xml).to.equal('function');

    const A = { foo: 0 };
    const B = [1, 2, 3];
    const out = xml<typeof A | typeof B>`
      <someTag
        property="value"
        prop="${A}"
        >
        ${B}
      </someTag>
      <greet name="World" />
    `;

    expect(typeof out).to.equal('object');
  });
});
