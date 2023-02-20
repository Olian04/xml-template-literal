import { DynamicToken } from './DynamicToken';
import { SymbolToken } from './SymbolToken';
import { SyntaxToken } from './SyntaxToken';
import { ValueToken } from './ValueToken';

export type Token<T> = DynamicToken<T> | SyntaxToken | SymbolToken | ValueToken;
