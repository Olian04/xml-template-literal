import type { AstAttribute } from './AstAttribute';

export type AstNodeChild<T = unknown> = {
  type: 'child';
  kind: 'node';
  tag: string;
  attributes: AstAttribute<T>[];
  children: AstChild<T>[];
};

export type AstValueChild<T = unknown> = {
  type: 'child';
  kind: 'value';
  value: T;
};

export type AstTextChild = {
  type: 'child';
  kind: 'text';
  value: string;
};

export type AstChild<T = unknown> =
  | AstNodeChild<T>
  | AstValueChild<T>
  | AstTextChild;
