import { UnexpectedToken } from '../errors/UnexpectedToken';

export const assertToken = (trueToken: string, expectedToken: string) => {
  if (trueToken === expectedToken) return true;
  throw new UnexpectedToken(
    `Expected "${expectedToken}" but got "${trueToken}"`
  );
};

export const assertNotToken = (trueToken: string, expectedToken: string) => {
  if (trueToken !== expectedToken) return true;
  throw new UnexpectedToken(
    `Expected anything but "${trueToken}" but got "${trueToken}"`
  );
};
