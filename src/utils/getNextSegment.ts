import { UnexpectedEOF } from '../errors/UnexpectedEOF';

export const getNextStatic = <T>(segments: { static: string[] }): string => {
  const maybeStr = segments.static.pop();
  if (maybeStr === undefined) throw new UnexpectedEOF();
  return maybeStr.trim();
};

export const getNextDynamic = <T>(segments: { dynamic: T[] }): T => {
  const maybeStr = segments.dynamic.pop();
  if (maybeStr === undefined) throw new UnexpectedEOF();
  return maybeStr;
};
