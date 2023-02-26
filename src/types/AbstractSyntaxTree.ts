export enum ChildType {
  Node = 'Node',
  Text = 'Text',
  Data = 'Data',
}

export enum AttributeType {
  Text = 'Text',
  Data = 'Data',
}

export type AstChild<T> =
  | {
      kind: 'child';
      type: ChildType.Node;
      children: AstChild<T>[];
      attributes: AstAttribute<T>[];
    }
  | {
      kind: 'child';
      type: ChildType.Text;
      value: string;
    }
  | {
      kind: 'child';
      type: ChildType.Data;
      value: T;
    };

export type AstAttribute<T> =
  | {
      kind: 'attribute';
      type: AttributeType.Text;
      key: string;
      value: string;
    }
  | {
      kind: 'attribute';
      type: AttributeType.Data;
      key: string;
      value: T;
    };
