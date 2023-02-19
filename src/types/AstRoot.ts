import { AstChild } from './AstChild';

export type AstRoot = {
  type: 'root';
  children: AstChild[];
};
