import { describe, it, expect } from 'vitest';

describe('Data Structures Operational Invariants', () => {
  it('Stack verifies LIFO (Last-In First-Out) ordering', () => {
    const stack: number[] = [];
    stack.push(10);
    stack.push(20);
    stack.push(30);

    expect(stack.pop()).toBe(30);
    expect(stack.pop()).toBe(20);
    expect(stack.pop()).toBe(10);
    expect(stack.length).toBe(0);
  });

  it('Queue verifies FIFO (First-In First-Out) ordering', () => {
    const queue: number[] = [];
    queue.push(10);
    queue.push(20);
    queue.push(30);

    expect(queue.shift()).toBe(10);
    expect(queue.shift()).toBe(20);
    expect(queue.shift()).toBe(30);
    expect(queue.length).toBe(0);
  });

  interface BSTNode {
    val: number;
    left?: BSTNode;
    right?: BSTNode;
  }

  function bstInsert(root: BSTNode | null, val: number): BSTNode {
    if (!root) return { val };
    if (val < root.val) root.left = bstInsert(root.left || null, val);
    else if (val > root.val) root.right = bstInsert(root.right || null, val);
    return root;
  }

  function inOrder(root: BSTNode | null, res: number[] = []): number[] {
    if (!root) return res;
    inOrder(root.left || null, res);
    res.push(root.val);
    inOrder(root.right || null, res);
    return res;
  }

  it('BST In-Order traversal strictly outputs ascending sorted sequence', () => {
    let root: BSTNode | null = null;
    const values = [50, 30, 70, 20, 40, 60, 80];
    for (const v of values) {
      root = bstInsert(root, v);
    }

    const sorted = inOrder(root);
    expect(sorted).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
});
