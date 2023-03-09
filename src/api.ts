import { parseTokens } from '!parser/index';
import { tokenizer } from '!tokenizer/index';
import { mergeTemplateSegments } from '!util/mergeTemplateSegments';

export {
  AstRoot,
  AstChild,
  AstAttribute,
  AstAttributeComposite,
  AstKind,
  ChildType,
  AttributeType,
} from '!types/AbstractSyntaxTree';

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
