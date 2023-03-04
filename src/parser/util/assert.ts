import { UnexpectedToken } from '!errors/UnexpectedToken';
import { Token } from '!types/Token';

export const assert = (
  key: 'value' | 'kind',
  expected: any,
  token: Token<unknown>
) => {
  if (token[key] !== expected)
    throw new UnexpectedToken(expected, String(token[key]));
};
