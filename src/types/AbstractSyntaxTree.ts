// Enums in this file should not be marked as "const" since these enums are part of the API
export enum AstKind {
  Root = 'Root',
  Child = 'Child',
  Attribute = 'Attribute',
  Composite = 'Composite',
}

export enum ChildType {
  Node = 'Node',
  Text = 'Text',
  Data = 'Data',
}

export enum AttributeType {
  Text = 'Text',
  Data = 'Data',
  Composite = 'Composite',
}

export type AstChild<T> =
  | {
      kind: AstKind.Child;
      type: ChildType.Node;
      tag: string;
      children: AstChild<T>[];
      attributes: AstAttribute<T>[];
    }
  | {
      kind: AstKind.Child;
      type: ChildType.Text;
      value: string;
    }
  | {
      kind: AstKind.Child;
      type: ChildType.Data;
      value: T;
    };

export type AstAttribute<T> =
  | {
      kind: AstKind.Attribute;
      type: AttributeType.Text;
      key: string;
      value: string;
    }
  | {
      kind: AstKind.Attribute;
      type: AttributeType.Data;
      key: string;
      value: T;
    }
  | {
      kind: AstKind.Attribute;
      type: AttributeType.Composite;
      key: string;
      value: AstAttributeComposite<T>[];
    };

export type AstAttributeComposite<T> =
  | {
      kind: AstKind.Composite;
      type: AttributeType.Text;
      value: string;
    }
  | {
      kind: AstKind.Composite;
      type: AttributeType.Data;
      value: T;
    };

export type AstRoot<T> = {
  kind: AstKind.Root;
  children: AstChild<T>[];
}
