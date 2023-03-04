export class UnexpectedEOF extends SyntaxError {
  constructor(near?: string) {
    super(`UnexpectedEOF${near ? ` near: ${near}` : ''}`);
  }
}
