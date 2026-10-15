import type {
  Token,
  TokenType,
  Statement,
  Expression,
  BlockStmt,
} from './types';

export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): BlockStmt {
    const statements: Statement[] = [];
    while (!this.isAtEnd()) {
      // Skip redundant semicolons
      if (this.match('SEMICOLON')) continue;
      statements.push(this.statement());
    }
    return {
      kind: 'Block',
      statements,
      line: 1,
    };
  }

  private statement(): Statement {
    if (this.match('LET')) {
      return this.varDeclaration();
    }
    if (this.match('IF')) {
      return this.ifStatement();
    }
    if (this.match('WHILE')) {
      return this.whileStatement();
    }
    if (this.match('FOR')) {
      return this.forStatement();
    }
    if (this.match('SWAP')) {
      return this.swapStatement();
    }
    if (this.match('LBRACE')) {
      return this.blockStatement();
    }

    return this.assignmentStatement();
  }

  private varDeclaration(): Statement {
    const nameToken = this.consume('IDENTIFIER', "Expected variable name after 'let'.");
    this.consume('EQ', "Expected '=' after variable name.");
    const init = this.expression();
    this.match('SEMICOLON');
    return {
      kind: 'VarDecl',
      name: nameToken.value,
      init,
      line: nameToken.line,
    };
  }

  private assignmentStatement(): Statement {
    const nameToken = this.consume('IDENTIFIER', 'Expected identifier at start of statement.');
    let index: Expression | undefined;

    if (this.match('LBRACKET')) {
      index = this.expression();
      this.consume('RBRACKET', "Expected ']' after array index.");
    }

    this.consume('EQ', "Expected '=' in assignment.");
    const value = this.expression();
    this.match('SEMICOLON');

    return {
      kind: 'Assign',
      target: nameToken.value,
      index,
      value,
      line: nameToken.line,
    };
  }

  private swapStatement(): Statement {
    const line = this.previous().line;
    this.consume('LPAREN', "Expected '(' after 'swap'.");
    
    // swap(arr[i], arr[j])
    const arrName1 = this.consume('IDENTIFIER', "Expected array name in swap.");
    this.consume('LBRACKET', "Expected '[' after array name in swap.");
    const idx1 = this.expression();
    this.consume('RBRACKET', "Expected ']' after first index in swap.");

    this.consume('COMMA', "Expected ',' between array elements in swap.");

    const arrName2 = this.consume('IDENTIFIER', "Expected second array name in swap.");
    if (arrName1.value !== arrName2.value) {
      throw new Error(`Line ${line}: swap can only operate on indices within the same array ('${arrName1.value}' vs '${arrName2.value}').`);
    }
    this.consume('LBRACKET', "Expected '[' after array name in swap.");
    const idx2 = this.expression();
    this.consume('RBRACKET', "Expected ']' after second index in swap.");

    this.consume('RPAREN', "Expected ')' after swap arguments.");
    this.match('SEMICOLON');

    return {
      kind: 'Swap',
      array: arrName1.value,
      index1: idx1,
      index2: idx2,
      line,
    };
  }

  private ifStatement(): Statement {
    const line = this.previous().line;
    const hasParen = this.match('LPAREN');
    const condition = this.expression();
    if (hasParen) {
      this.consume('RPAREN', "Expected ')' after if condition.");
    }

    this.consume('LBRACE', "Expected '{' before if body.");
    const thenBranch = this.blockStatement();

    let elseBranch: Statement | undefined;
    if (this.match('ELSE')) {
      if (this.match('IF')) {
        elseBranch = this.ifStatement();
      } else {
        this.consume('LBRACE', "Expected '{' before else body.");
        elseBranch = this.blockStatement();
      }
    }

    return {
      kind: 'If',
      condition,
      thenBranch,
      elseBranch,
      line,
    };
  }

  private whileStatement(): Statement {
    const line = this.previous().line;
    const hasParen = this.match('LPAREN');
    const condition = this.expression();
    if (hasParen) {
      this.consume('RPAREN', "Expected ')' after while condition.");
    }

    this.consume('LBRACE', "Expected '{' before while body.");
    const body = this.blockStatement();

    return {
      kind: 'While',
      condition,
      body,
      line,
    };
  }

  private forStatement(): Statement {
    const line = this.previous().line;
    // for i = 0 to n - 1 { ... }
    const varToken = this.consume('IDENTIFIER', "Expected loop variable name after 'for'.");
    this.consume('EQ', "Expected '=' after loop variable.");
    const start = this.expression();
    this.consume('TO', "Expected 'to' in for loop range.");
    const end = this.expression();

    this.consume('LBRACE', "Expected '{' before for body.");
    const body = this.blockStatement();

    return {
      kind: 'For',
      varName: varToken.value,
      start,
      end,
      body,
      line,
    };
  }

  private blockStatement(): BlockStmt {
    const line = this.previous().line;
    const statements: Statement[] = [];
    while (!this.check('RBRACE') && !this.isAtEnd()) {
      if (this.match('SEMICOLON')) continue;
      statements.push(this.statement());
    }
    this.consume('RBRACE', "Expected '}' after block.");
    return {
      kind: 'Block',
      statements,
      line,
    };
  }

  private expression(): Expression {
    return this.logicalOr();
  }

  private logicalOr(): Expression {
    let expr = this.logicalAnd();
    while (this.match('OR')) {
      const line = this.previous().line;
      const right = this.logicalAnd();
      expr = { kind: 'Binary', left: expr, operator: 'or', right, line };
    }
    return expr;
  }

  private logicalAnd(): Expression {
    let expr = this.equality();
    while (this.match('AND')) {
      const line = this.previous().line;
      const right = this.equality();
      expr = { kind: 'Binary', left: expr, operator: 'and', right, line };
    }
    return expr;
  }

  private equality(): Expression {
    let expr = this.comparison();
    while (this.match('EQEQ', 'NEQ')) {
      const op = this.previous().value;
      const line = this.previous().line;
      const right = this.comparison();
      expr = { kind: 'Binary', left: expr, operator: op, right, line };
    }
    return expr;
  }

  private comparison(): Expression {
    let expr = this.addition();
    while (this.match('LT', 'LTE', 'GT', 'GTE')) {
      const op = this.previous().value;
      const line = this.previous().line;
      const right = this.addition();
      expr = { kind: 'Binary', left: expr, operator: op, right, line };
    }
    return expr;
  }

  private addition(): Expression {
    let expr = this.multiplication();
    while (this.match('PLUS', 'MINUS')) {
      const op = this.previous().value;
      const line = this.previous().line;
      const right = this.multiplication();
      expr = { kind: 'Binary', left: expr, operator: op, right, line };
    }
    return expr;
  }

  private multiplication(): Expression {
    let expr = this.unary();
    while (this.match('STAR', 'SLASH', 'PERCENT')) {
      const op = this.previous().value;
      const line = this.previous().line;
      const right = this.unary();
      expr = { kind: 'Binary', left: expr, operator: op, right, line };
    }
    return expr;
  }

  private unary(): Expression {
    if (this.match('MINUS', 'NOT')) {
      const op = this.previous().value;
      const line = this.previous().line;
      const operand = this.unary();
      return { kind: 'Unary', operator: op, operand, line };
    }
    return this.postfix();
  }

  private postfix(): Expression {
    let expr = this.primary();

    while (this.match('LBRACKET')) {
      const line = this.previous().line;
      const index = this.expression();
      this.consume('RBRACKET', "Expected ']' after array index.");
      expr = { kind: 'Index', array: expr, index, line };
    }

    return expr;
  }

  private primary(): Expression {
    const line = this.peek().line;

    if (this.match('NUMBER')) {
      return { kind: 'NumberLiteral', value: parseFloat(this.previous().value), line };
    }

    if (this.match('IDENTIFIER')) {
      return { kind: 'Identifier', name: this.previous().value, line };
    }

    if (this.match('LBRACKET')) {
      // Array literal [1, 2, 3]
      const elements: Expression[] = [];
      if (!this.check('RBRACKET')) {
        do {
          elements.push(this.expression());
        } while (this.match('COMMA'));
      }
      this.consume('RBRACKET', "Expected ']' after array literal.");
      return { kind: 'ArrayLiteral', elements, line };
    }

    if (this.match('LPAREN')) {
      const expr = this.expression();
      this.consume('RPAREN', "Expected ')' after expression.");
      return expr;
    }

    throw new Error(`Line ${line}: Unexpected token '${this.peek().value || this.peek().type}' in expression.`);
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new Error(`Line ${token.line}: ${message} (Got '${token.value || token.type}')`);
  }
}

export function parseProgram(tokens: Token[]): BlockStmt {
  const parser = new Parser(tokens);
  return parser.parse();
}
