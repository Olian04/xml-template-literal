import { parseTokens } from './parser/index.js';
import { tokenizer } from './tokenizer/index.js';
import { mergeTemplateSegments } from './util/mergeTemplateSegments.js';

export {
  AstKind,
  AstRoot,
  AstChild,
  AstAttribute,
  AstAttributeComposite,
  ChildType,
  AttributeType,
} from './types/AbstractSyntaxTree.js';

export const parseXml = (xmlString: string) =>
  parseTokens(
    tokenizer(
      mergeTemplateSegments({
        dynamic: [],
        static: [xmlString],
      })
    )
  );

export const xml = <T>(
  staticSegments: TemplateStringsArray,
  ...dynamicSegments: T[]
) =>
  parseTokens(
    tokenizer(
      mergeTemplateSegments({
        dynamic: dynamicSegments,
        static: [...staticSegments],
      })
    )
  );
