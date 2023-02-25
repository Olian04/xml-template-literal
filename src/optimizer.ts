import type { Token } from './types/Token';

const optimizeAttributeValue = <T>(
  startIndex: number,
  tokens: Token<T>[]
): [Token<T>[], number] => {
  let valuePos: { col: number; row: number } = { col: NaN, row: NaN };
  let valueAggregator = '';
  let i = startIndex + 1;
  const optimizedTokens: Token<T>[] = [];
  for (; i < tokens.length; i++) {
    const token = tokens[i];
    if (isNaN(valuePos.col)) {
      valuePos = token.position;
    }

    if (token.kind === 'symbol') {
      valueAggregator += token.value;
    } else if (token.kind === 'syntax' && token.value !== '"') {
      valueAggregator += token.value;
    } else if (token.kind === 'dynamic') {
      if (valueAggregator.length > 0) {
        optimizedTokens.push({
          kind: 'value',
          value: valueAggregator,
          position: valuePos,
        });
      }
      valueAggregator = '';
      valuePos = { col: NaN, row: NaN };
      optimizedTokens.push(token);
    } else if (token.kind === 'syntax' && token.value === '"') {
      if (valueAggregator.length > 0) {
        optimizedTokens.push({
          kind: 'value',
          value: valueAggregator,
          position: valuePos,
        });
      }
      optimizedTokens.push(token);
      break;
    }
  }
  return [optimizedTokens, i - startIndex];
};

const optimizeTagDefinition = <T>(
  startIndex: number,
  tokens: Token<T>[]
): [Token<T>[], number] => {
  let i = startIndex + 1;
  const optimizedTokens: Token<T>[] = [];
  for (; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.kind === 'syntax' && token.value === '"') {
      optimizedTokens.push(token);
      const [attributeTokens, consumed] = optimizeAttributeValue(i, tokens);
      i += consumed;
      optimizedTokens.push(...attributeTokens);
    } else if (token.kind === 'syntax' && token.value === '>') {
      optimizedTokens.push(token);
      break;
    } else {
      optimizedTokens.push(token);
    }
  }
  return [optimizedTokens, i - startIndex];
};

export const optimizer = <T>(tokens: Token<T>[]): Token<T>[] => {
  let valuePos: { col: number; row: number } = { col: NaN, row: NaN };
  let valueAggregator = '';
  const optimizedTokens: Token<T>[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (isNaN(valuePos.col)) {
      valuePos = token.position;
    }

    if (token.kind === 'syntax' && token.value === '<') {
      if (valueAggregator.length > 0) {
        optimizedTokens.push({
          kind: 'value',
          value: valueAggregator,
          position: valuePos,
        });
      }
      valueAggregator = '';
      valuePos = { col: NaN, row: NaN };

      optimizedTokens.push(token);
      const [tagTokens, consumed] = optimizeTagDefinition(i, tokens);
      optimizedTokens.push(...tagTokens);
      i += consumed;
    } else if (token.kind === 'dynamic') {
      if (valueAggregator.length > 0) {
        optimizedTokens.push({
          kind: 'value',
          value: valueAggregator,
          position: valuePos,
        });
      }
      valueAggregator = '';
      valuePos = { col: NaN, row: NaN };

      optimizedTokens.push(token);
    } else if (token.kind === 'symbol') {
      valueAggregator += token.value;
    } else if (token.kind === 'syntax') {
      valueAggregator += token.value;
    }
  }
  return optimizedTokens;
};
