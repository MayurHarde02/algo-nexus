export type TokenType =
  | 'LET'
  | 'IF'
  | 'ELSE'
  | 'WHILE'
  | 'FOR'
  | 'TO'
  | 'SWAP'
  | 'PRINT'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'SLASH'
  | 'PERCENT'
  | 'EQ'
  | 'EQEQ'
  | 'NEQ'
  | 'LT'
  | 'LTE'
  | 'GT'
  | 'GTE'
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'LBRACE'
  | 'RBRACE'
  | 'COMMA'
  | 'SEMICOLON'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

export type ASTNode =
  | Statement
  | Expression;

export type Statement =
  | VarDeclStmt
  | AssignStmt
  | SwapStmt
  | IfStmt
  | WhileStmt
  | ForStmt
  | BlockStmt;

export interface VarDeclStmt {
  kind: 'VarDecl';
  name: string;
  init: Expression;
  line: number;
}

export interface AssignStmt {
  kind: 'Assign';
  target: string;
  index?: Expression; // for arr[i] = val
  value: Expression;
  line: number;
}

export interface SwapStmt {
  kind: 'Swap';
  array: string;
  index1: Expression;
  index2: Expression;
  line: number;
}

export interface IfStmt {
  kind: 'If';
  condition: Expression;
  thenBranch: Statement;
  elseBranch?: Statement;
  line: number;
}

export interface WhileStmt {
  kind: 'While';
  condition: Expression;
  body: Statement;
  line: number;
}

export interface ForStmt {
  kind: 'For';
  varName: string;
  start: Expression;
  end: Expression;
  body: Statement;
  line: number;
}

export interface BlockStmt {
  kind: 'Block';
  statements: Statement[];
  line: number;
}

export type Expression =
  | NumberLiteral
  | IdentifierExpr
  | ArrayLiteral
  | IndexExpr
  | BinaryExpr
  | UnaryExpr;

export interface NumberLiteral {
  kind: 'NumberLiteral';
  value: number;
  line: number;
}

export interface IdentifierExpr {
  kind: 'Identifier';
  name: string;
  line: number;
}

export interface ArrayLiteral {
  kind: 'ArrayLiteral';
  elements: Expression[];
  line: number;
}

export interface IndexExpr {
  kind: 'Index';
  array: Expression;
  index: Expression;
  line: number;
}

export interface BinaryExpr {
  kind: 'Binary';
  left: Expression;
  operator: string;
  right: Expression;
  line: number;
}

export interface UnaryExpr {
  kind: 'Unary';
  operator: string;
  operand: Expression;
  line: number;
}

export type RuntimeValue = number | boolean | number[];

export interface VmSnapshot {
  step: number;
  line: number;
  description: string;
  variables: Record<string, RuntimeValue>;
  highlightedIndices: { arrayName: string; indices: number[] }[];
  outputLog: string[];
}
