// import { lexer } from './lexer';
// import { optimizer } from './optimizer';
// import { tokenizer } from './tokenizer';
// import type { AstRoot } from './types/AstRoot';

// export const xml = <T>(
//   staticSegments: TemplateStringsArray,
//   ...dynamicSegments: T[]
// ): AstRoot<T> =>
//   lexer(
//     optimizer(
//       tokenizer({
//         static: [...staticSegments],
//         dynamic: dynamicSegments,
//       })
//     )
//   );
