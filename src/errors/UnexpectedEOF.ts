export class UnexpectedEOF extends Error {
  constructor(near: string) {
    super(`UnexpectedEOF near: ${near}`);
  }
}
