import { AstChild } from '../types/AstChild';
import { assertNotToken, assertToken } from '../utils/assert';
import { getNextDynamic, getNextStatic } from '../utils/getNextSegment';

export const parseChild = <T>(segments: {
  static: string[];
  dynamic: T[];
}): AstChild => {
  let str = getNextStatic(segments);

  if (str.length === 0) {
    return {
      type: 'child',
      value: getNextDynamic(segments),
    };
  }

  assertToken(str.charAt(0), '<');
  str = str.slice(1).trim();
  assertNotToken(str.charAt(0), '/');
  assertNotToken(str.charAt(0), '>');
  const tag = str.substring(0, str.indexOf(' '));
  str = str.slice(str.indexOf(' ')).trim();

  // parseAttributes

  return {
    type: 'child',
    tag: tag,
    attributes: [],
    children: [],
  };
};
