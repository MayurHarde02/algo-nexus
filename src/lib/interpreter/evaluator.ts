import type {
  Statement,
  Expression,
  BlockStmt,
  RuntimeValue,
  VmSnapshot,
} from './types';

export class ExecutionBudgetExceededError extends Error {
  constructor(maxSteps: number) {
    super(`Execution budget exceeded (${maxSteps} steps limit reached). Possible infinite loop in pseudocode.`);
    this.name = 'ExecutionBudgetExceededError';
  }
}

export function evaluateProgram(
  ast: BlockStmt,
  maxSteps: number = 2500
): VmSnapshot[] {
  const snapshots: VmSnapshot[] = [];
  const env = new Map<string, RuntimeValue>();
  let stepCount = 0;
  const outputLog: string[] = [];

  function recordSnapshot(
    line: number,
    description: string,
    highlightedIndices: { arrayName: string; indices: number[] }[] = []
  ) {
    stepCount++;
    if (stepCount > maxSteps) {
      throw new ExecutionBudgetExceededError(maxSteps);
    }

    // Clone variable environment
    const vars: Record<string, RuntimeValue> = {};
    for (const [k, v] of env.entries()) {
      if (Array.isArray(v)) {
        vars[k] = [...v];
      } else {
        vars[k] = v;
      }
    }

    snapshots.push({
      step: stepCount,
      line,
      description,
      variables: vars,
      highlightedIndices,
      outputLog: [...outputLog],
    });
  }

  function evalExpr(expr: Expression): RuntimeValue {
    switch (expr.kind) {
      case 'NumberLiteral':
        return expr.value;

      case 'Identifier': {
        if (!env.has(expr.name)) {
          throw new Error(`Line ${expr.line}: Undefined identifier '${expr.name}'.`);
        }
        return env.get(expr.name)!;
      }

      case 'ArrayLiteral': {
        const arr: number[] = [];
        for (const elem of expr.elements) {
          const val = evalExpr(elem);
          if (typeof val !== 'number') {
            throw new Error(`Line ${expr.line}: Array literals currently support numeric elements.`);
          }
          arr.push(val);
        }
        return arr;
      }

      case 'Index': {
        const arr = evalExpr(expr.array);
        const idxVal = evalExpr(expr.index);
        if (!Array.isArray(arr)) {
          throw new Error(`Line ${expr.line}: Indexing non-array expression.`);
        }
        if (typeof idxVal !== 'number') {
          throw new Error(`Line ${expr.line}: Array index must evaluate to a number.`);
        }
        const idx = Math.floor(idxVal);
        if (idx < 0 || idx >= arr.length) {
          throw new Error(`Line ${expr.line}: Array index out of bounds: index ${idx} for array length ${arr.length}.`);
        }
        return arr[idx];
      }

      case 'Unary': {
        const val = evalExpr(expr.operand);
        if (expr.operator === '-' || expr.operator === 'MINUS') {
          if (typeof val !== 'number') throw new Error(`Line ${expr.line}: Cannot negate non-number.`);
          return -val;
        }
        if (expr.operator === 'not' || expr.operator === 'NOT') {
          return !val;
        }
        throw new Error(`Line ${expr.line}: Unknown unary operator '${expr.operator}'.`);
      }

      case 'Binary': {
        const left = evalExpr(expr.left);
        const right = evalExpr(expr.right);

        switch (expr.operator) {
          case '+':
            return (left as number) + (right as number);
          case '-':
            return (left as number) - (right as number);
          case '*':
            return (left as number) * (right as number);
          case '/': {
            const r = right as number;
            if (r === 0) throw new Error(`Line ${expr.line}: Division by zero.`);
            return Math.floor((left as number) / r); // integer division by default for algorithms
          }
          case '%':
            return (left as number) % (right as number);
          case '==':
            return left === right;
          case '!=':
            return left !== right;
          case '<':
            return (left as number) < (right as number);
          case '<=':
            return (left as number) <= (right as number);
          case '>':
            return (left as number) > (right as number);
          case '>=':
            return (left as number) >= (right as number);
          case 'and':
          case '&&':
            return Boolean(left) && Boolean(right);
          case 'or':
          case '||':
            return Boolean(left) || Boolean(right);
          default:
            throw new Error(`Line ${expr.line}: Unknown binary operator '${expr.operator}'.`);
        }
      }
    }
  }

  function executeStmt(stmt: Statement) {
    switch (stmt.kind) {
      case 'VarDecl': {
        const val = evalExpr(stmt.init);
        env.set(stmt.name, val);
        const valStr = Array.isArray(val) ? `[${val.join(', ')}]` : String(val);
        recordSnapshot(stmt.line, `Declared '${stmt.name}' = ${valStr}.`);
        break;
      }

      case 'Assign': {
        if (!env.has(stmt.target)) {
          throw new Error(`Line ${stmt.line}: Cannot assign to undeclared variable '${stmt.target}'.`);
        }

        if (stmt.index) {
          const arr = env.get(stmt.target);
          if (!Array.isArray(arr)) {
            throw new Error(`Line ${stmt.line}: '${stmt.target}' is not an array.`);
          }
          const idxVal = evalExpr(stmt.index);
          if (typeof idxVal !== 'number') {
            throw new Error(`Line ${stmt.line}: Array index must be a number.`);
          }
          const idx = Math.floor(idxVal);
          if (idx < 0 || idx >= arr.length) {
            throw new Error(`Line ${stmt.line}: Array index out of bounds (${idx}).`);
          }
          const val = evalExpr(stmt.value);
          if (typeof val !== 'number') {
            throw new Error(`Line ${stmt.line}: Array element must be numeric.`);
          }
          arr[idx] = val;
          recordSnapshot(stmt.line, `Updated ${stmt.target}[${idx}] = ${val}.`, [
            { arrayName: stmt.target, indices: [idx] },
          ]);
        } else {
          const val = evalExpr(stmt.value);
          env.set(stmt.target, val);
          const valStr = Array.isArray(val) ? `[${val.join(', ')}]` : String(val);
          recordSnapshot(stmt.line, `Assigned '${stmt.target}' = ${valStr}.`);
        }
        break;
      }

      case 'Swap': {
        const arr = env.get(stmt.array);
        if (!Array.isArray(arr)) {
          throw new Error(`Line ${stmt.line}: Variable '${stmt.array}' in swap is not an array.`);
        }
        const idx1 = Math.floor(evalExpr(stmt.index1) as number);
        const idx2 = Math.floor(evalExpr(stmt.index2) as number);

        if (idx1 < 0 || idx1 >= arr.length || idx2 < 0 || idx2 >= arr.length) {
          throw new Error(`Line ${stmt.line}: Swap index out of bounds (${idx1}, ${idx2}).`);
        }

        const temp = arr[idx1];
        arr[idx1] = arr[idx2];
        arr[idx2] = temp;

        recordSnapshot(
          stmt.line,
          `Swapped ${stmt.array}[${idx1}] (${temp}) with ${stmt.array}[${idx2}] (${arr[idx1]}).`,
          [{ arrayName: stmt.array, indices: [idx1, idx2] }]
        );
        break;
      }

      case 'If': {
        const condVal = evalExpr(stmt.condition);
        const condBool = Boolean(condVal);
        recordSnapshot(
          stmt.line,
          `Condition evaluated to ${condBool}. Branching ${condBool ? 'THEN' : 'ELSE'}.`
        );

        if (condBool) {
          executeStmt(stmt.thenBranch);
        } else if (stmt.elseBranch) {
          executeStmt(stmt.elseBranch);
        }
        break;
      }

      case 'While': {
        while (true) {
          const condVal = evalExpr(stmt.condition);
          const condBool = Boolean(condVal);
          recordSnapshot(
            stmt.line,
            `While condition evaluated to ${condBool}. ${condBool ? 'Executing loop body' : 'Loop terminated'}.`
          );
          if (!condBool) break;
          executeStmt(stmt.body);
        }
        break;
      }

      case 'For': {
        const startVal = Math.floor(evalExpr(stmt.start) as number);
        const endVal = Math.floor(evalExpr(stmt.end) as number);

        env.set(stmt.varName, startVal);
        recordSnapshot(
          stmt.line,
          `For loop initialized: '${stmt.varName}' = ${startVal} to ${endVal}.`
        );

        for (let i = startVal; i <= endVal; i++) {
          env.set(stmt.varName, i);
          recordSnapshot(
            stmt.line,
            `For loop iteration: '${stmt.varName}' = ${i} (target <= ${endVal}).`
          );
          executeStmt(stmt.body);
        }
        break;
      }

      case 'Block': {
        for (const s of stmt.statements) {
          executeStmt(s);
        }
        break;
      }
    }
  }

  // Initial step before program execution starts
  recordSnapshot(1, 'Program ready. Stepping through instruction pipeline.');

  // Execute root block
  executeStmt(ast);

  recordSnapshot(
    ast.statements.length > 0 ? ast.statements[ast.statements.length - 1].line : 1,
    'Program execution halted normally.'
  );

  return snapshots;
}
