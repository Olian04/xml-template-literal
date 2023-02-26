import type { AstChild } from './AstChild';

export type AstRoot<T> = {
  type: 'root';
  children: AstChild<T>[];
};
