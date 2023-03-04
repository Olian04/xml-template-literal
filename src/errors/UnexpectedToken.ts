export class UnexpectedToken extends SyntaxError {
  constructor(expected: string, got: string) {
    super(`UnexpectedToken: Expected "${expected}" but got "${got}"`);
  }
}
