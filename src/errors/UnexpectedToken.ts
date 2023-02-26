export class UnexpectedToken extends Error {
  constructor(expected: string, got: string) {
    super(`UnexpectedToken: Expected "${expected}" but got "${got}"`);
  }
}
