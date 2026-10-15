import type { Token, TokenType } from './types';

const KEYWORDS: Record<string, TokenType> = {
  let: 'LET',
  if: 'IF',
  else: 'ELSE',
  while: 'WHILE',
  for: 'FOR',
  to: 'TO',
  swap: 'SWAP',
  print: 'PRINT',
  and: 'AND',
  or: 'OR',
  not: 'NOT',
};

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  while (pos < input.length) {
    const ch = input[pos];

    // Newlines
    if (ch === '\n') {
      line++;
      col = 1;
      pos++;
      continue;
    }

    // Whitespace
    if (/\s/.test(ch)) {
      pos++;
      col++;
      continue;
    }

    // Comments //
    if (ch === '/' && input[pos + 1] === '/') {
      while (pos < input.length && input[pos] !== '\n') {
        pos++;
      }
      continue;
    }

    // Multi-char operators
    if (ch === '=' && input[pos + 1] === '=') {
      tokens.push({ type: 'EQEQ', value: '==', line, col });
      pos += 2;
      col += 2;
      continue;
    }
    if (ch === '!' && input[pos + 1] === '=') {
      tokens.push({ type: 'NEQ', value: '!=', line, col });
      pos += 2;
      col += 2;
      continue;
    }
    if (ch === '<' && input[pos + 1] === '=') {
      tokens.push({ type: 'LTE', value: '<=', line, col });
      pos += 2;
      col += 2;
      continue;
    }
    if (ch === '>' && input[pos + 1] === '=') {
      tokens.push({ type: 'GTE', value: '>=', line, col });
      pos += 2;
      col += 2;
      continue;
    }
    if (ch === '&' && input[pos + 1] === '&') {
      tokens.push({ type: 'AND', value: '&&', line, col });
      pos += 2;
      col += 2;
      continue;
    }
    if (ch === '|' && input[pos + 1] === '|') {
      tokens.push({ type: 'OR', value: '||', line, col });
      pos += 2;
      col += 2;
      continue;
    }

    // Single-char operators & punctuation
    if (ch === '=') {
      tokens.push({ type: 'EQ', value: '=', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '<') {
      tokens.push({ type: 'LT', value: '<', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '>') {
      tokens.push({ type: 'GT', value: '>', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '+') {
      tokens.push({ type: 'PLUS', value: '+', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '-') {
      tokens.push({ type: 'MINUS', value: '-', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '*') {
      tokens.push({ type: 'STAR', value: '*', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '/') {
      tokens.push({ type: 'SLASH', value: '/', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '%') {
      tokens.push({ type: 'PERCENT', value: '%', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '[') {
      tokens.push({ type: 'LBRACKET', value: '[', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === ']') {
      tokens.push({ type: 'RBRACKET', value: ']', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '{') {
      tokens.push({ type: 'LBRACE', value: '{', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '}') {
      tokens.push({ type: 'RBRACE', value: '}', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ',', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === ';') {
      tokens.push({ type: 'SEMICOLON', value: ';', line, col });
      pos++;
      col++;
      continue;
    }

    // Number literals
    if (/[0-9]/.test(ch)) {
      let numStr = '';
      const startCol = col;
      while (pos < input.length && /[0-9]/.test(input[pos])) {
        numStr += input[pos];
        pos++;
        col++;
      }
      tokens.push({ type: 'NUMBER', value: numStr, line, col: startCol });
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(ch)) {
      let idStr = '';
      const startCol = col;
      while (pos < input.length && /[a-zA-Z0-9_]/.test(input[pos])) {
        idStr += input[pos];
        pos++;
        col++;
      }
      const lower = idStr.toLowerCase();
      const kwType = KEYWORDS[lower];
      if (kwType) {
        tokens.push({ type: kwType, value: idStr, line, col: startCol });
      } else {
        tokens.push({ type: 'IDENTIFIER', value: idStr, line, col: startCol });
      }
      continue;
    }

    // Unknown character
    throw new Error(`Syntax error at line ${line}, col ${col}: Unexpected character '${ch}'`);
  }

  tokens.push({ type: 'EOF', value: '', line, col });
  return tokens;
}
