import type { AstRoot } from './types/AstRoot';
import { parseChild } from './parsers/parseChild';

export const xml = <T>(
  staticSegments: TemplateStringsArray,
  ...dynamicSegments: T[]
): AstRoot => {
  return {
    type: 'root',
    children: [
      parseChild({
        static: [...staticSegments],
        dynamic: [...dynamicSegments],
      }),
    ],
  };
};
