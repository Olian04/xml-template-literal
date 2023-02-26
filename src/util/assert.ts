import { UnexpectedToken } from '../errors/UnexpectedToken';

export const assert = (expected: any, got: any) => {
  if (got !== expected) throw new UnexpectedToken(expected, String(got));
};
