import { AstAttribute } from './AstAttribute';

export type AstNodeChild<T = unknown> = {
  type: 'child';
  tag: string;
  attributes: AstAttribute[];
  children: AstChild[];
};

export type AstValueChild<T = unknown> = {
  type: 'child';
  value: T;
};

export type AstChild<T = unknown> = AstNodeChild<T> | AstValueChild<T>;
