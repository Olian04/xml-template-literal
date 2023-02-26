export class UnexpectedToken extends Error {
  constructor(msg: string) {
    super(`UnexpectedToken: ${msg}`);
  }
}
