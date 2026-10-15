import { useState } from 'react';
import { ArrowDown, ArrowUp, Search, Plus, Trash2, Eye } from 'lucide-react';

type DsType = 'stack' | 'queue' | 'bst';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
}

export const DataStructuresLab: React.FC = () => {
  const [activeDs, setActiveDs] = useState<DsType>('stack');

  // Stack state
  const [stack, setStack] = useState<number[]>([14, 28, 42]);
  const [stackInput, setStackInput] = useState<number>(56);
  const [stackMessage, setStackMessage] = useState<string>('Initialized with 3 elements.');

  // Queue state
  const [queue, setQueue] = useState<number[]>([10, 20, 30, 40]);
  const [queueInput, setQueueInput] = useState<number>(50);
  const [queueMessage, setQueueMessage] = useState<string>('Initialized with 4 elements.');

  // BST state
  const [bstRoot, setBstRoot] = useState<TreeNode | null>(() => {
    // Initial sample tree: 50 -> 30, 70 -> 20, 40, 60, 80
    return {
      value: 50,
      left: {
        value: 30,
        left: { value: 20 },
        right: { value: 40 },
      },
      right: {
        value: 70,
        left: { value: 60 },
        right: { value: 80 },
      },
    };
  });
  const [bstInput, setBstInput] = useState<number>(45);
  const [bstSearchVal, setBstSearchVal] = useState<number>(40);
  const [bstMessage, setBstMessage] = useState<string>('Balanced binary search tree initialized.');
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);

  // Stack operations
  const handlePushStack = () => {
    if (stack.length >= 10) {
      setStackMessage('Stack overflow: Maximum visual capacity of 10 reached.');
      return;
    }
    setStack((prev) => [...prev, stackInput]);
    setStackMessage(`Pushed ${stackInput} onto TOP of stack. (LIFO invariant)`);
    setStackInput((prev) => prev + 7);
  };

  const handlePopStack = () => {
    if (stack.length === 0) {
      setStackMessage('Stack underflow: Cannot pop from empty stack.');
      return;
    }
    const popped = stack[stack.length - 1];
    setStack((prev) => prev.slice(0, prev.length - 1));
    setStackMessage(`Popped value ${popped} from TOP of stack.`);
  };

  const handlePeekStack = () => {
    if (stack.length === 0) {
      setStackMessage('Stack is empty.');
      return;
    }
    setStackMessage(`Peek: Current top element is ${stack[stack.length - 1]} at index ${stack.length - 1}.`);
  };

  // Queue operations
  const handleEnqueue = () => {
    if (queue.length >= 10) {
      setQueueMessage('Queue full: Maximum visual capacity of 10 reached.');
      return;
    }
    setQueue((prev) => [...prev, queueInput]);
    setQueueMessage(`Enqueued ${queueInput} to REAR of queue. (FIFO invariant)`);
    setQueueInput((prev) => prev + 10);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setQueueMessage('Queue underflow: Cannot dequeue from empty queue.');
      return;
    }
    const dequeued = queue[0];
    setQueue((prev) => prev.slice(1));
    setQueueMessage(`Dequeued value ${dequeued} from FRONT of queue.`);
  };

  const handlePeekQueue = () => {
    if (queue.length === 0) {
      setQueueMessage('Queue is empty.');
      return;
    }
    setQueueMessage(`Peek: Front element is ${queue[0]}, Rear element is ${queue[queue.length - 1]}.`);
  };

  // BST operations
  const insertNode = (root: TreeNode | null, val: number): TreeNode => {
    if (!root) return { value: val };
    if (val < root.value) {
      root.left = insertNode(root.left || null, val);
    } else if (val > root.value) {
      root.right = insertNode(root.right || null, val);
    }
    return root;
  };

  const handleInsertBst = () => {
    if (!bstInput) return;
    const cloned = JSON.parse(JSON.stringify(bstRoot || null));
    const newRoot = insertNode(cloned, bstInput);
    setBstRoot(newRoot);
    setBstMessage(`Inserted ${bstInput} into BST adhering to left < root < right invariant.`);
    setHighlightedNodes([bstInput]);
    setBstInput((prev) => (prev * 3) % 97 + 10);
  };

  const handleSearchBst = () => {
    const path: number[] = [];
    let curr = bstRoot;
    let found = false;

    while (curr) {
      path.push(curr.value);
      if (curr.value === bstSearchVal) {
        found = true;
        break;
      } else if (bstSearchVal < curr.value) {
        curr = curr.left || null;
      } else {
        curr = curr.right || null;
      }
    }

    setHighlightedNodes(path);
    if (found) {
      setBstMessage(`Found ${bstSearchVal} via traversal path: [${path.join(' -> ')}].`);
    } else {
      setBstMessage(`Value ${bstSearchVal} NOT found in BST. Traversed: [${path.join(' -> ')}].`);
    }
  };

  const getInOrder = (root: TreeNode | null, result: number[] = []): number[] => {
    if (!root) return result;
    getInOrder(root.left || null, result);
    result.push(root.value);
    getInOrder(root.right || null, result);
    return result;
  };

  // Layout BST for SVG rendering
  interface RenderedNode {
    val: number;
    x: number;
    y: number;
    px?: number;
    py?: number;
  }

  const computeLayout = (root: TreeNode | null): { nodes: RenderedNode[]; edges: { x1: number; y1: number; x2: number; y2: number }[] } => {
    if (!root) return { nodes: [], edges: [] };

    const nodes: RenderedNode[] = [];
    const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];

    const traverse = (node: TreeNode, x: number, y: number, offset: number, px?: number, py?: number) => {
      nodes.push({ val: node.value, x, y, px, py });
      if (px !== undefined && py !== undefined) {
        edges.push({ x1: px, y1: py, x2: x, y2: y });
      }

      if (node.left) {
        traverse(node.left, x - offset, y + 60, offset / 2, x, y);
      }
      if (node.right) {
        traverse(node.right, x + offset, y + 60, offset / 2, x, y);
      }
    };

    traverse(root, 300, 40, 120);
    return { nodes, edges };
  };

  const bstLayout = computeLayout(bstRoot);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              ['stack', 'Stack (LIFO Buffer)'],
              ['queue', 'Queue (FIFO Buffer)'],
              ['bst', 'Binary Search Tree (BST)'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveDs(key)}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border ${
                activeDs === key
                  ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-400">
          Module: Dynamic Memory & Abstract Data Types
        </div>
      </div>

      {/* 1. STACK VISUALIZER */}
      {activeDs === 'stack' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Controls (1 col) */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              Stack Controls (LIFO)
            </span>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={stackInput}
                onChange={(e) => setStackInput(Number(e.target.value))}
                className="w-24 p-1.5 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-slate-200"
              />
              <button
                onClick={handlePushStack}
                className="flex items-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-sm text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>PUSH</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePopStack}
                disabled={stack.length === 0}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold rounded-sm text-xs"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>POP TOP</span>
              </button>

              <button
                onClick={handlePeekStack}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-medium border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PEEK</span>
              </button>
            </div>

            <button
              onClick={() => {
                setStack([]);
                setStackMessage('Stack cleared.');
              }}
              className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-sm text-xs font-medium border border-slate-800"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Stack</span>
            </button>

            <div className="mt-auto p-2 bg-slate-950 border border-slate-800 rounded-sm text-[11px] font-mono text-slate-400 space-y-1">
              <div>Capacity: {stack.length} / 10</div>
              <div>Top Index: {stack.length > 0 ? stack.length - 1 : 'Empty'}</div>
              <div>Complexity: Push O(1), Pop O(1)</div>
            </div>
          </div>

          {/* Visual Container (2 cols) */}
          <div className="md:col-span-2 p-4 bg-slate-950 border border-slate-800 rounded-md flex flex-col justify-between min-h-[360px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-xs font-mono text-slate-400">
              <span>Vertical Stack Representation</span>
              <span>{stackMessage}</span>
            </div>

            {/* Stack Tube */}
            <div className="flex flex-col-reverse items-center justify-start w-48 mx-auto border-x-2 border-b-2 border-slate-700 p-2 min-h-[250px] bg-slate-900/40 rounded-b-sm gap-1">
              {stack.length === 0 ? (
                <span className="text-slate-600 font-mono text-xs my-auto">[ Stack is Empty ]</span>
              ) : (
                stack.map((val, idx) => {
                  const isTop = idx === stack.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`w-full py-2.5 px-3 rounded-xs border text-center font-mono text-xs font-bold transition-all relative ${
                        isTop
                          ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>{val}</span>
                      {isTop && (
                        <span className="absolute -left-16 top-2 text-[10px] font-mono text-amber-400 font-semibold flex items-center gap-0.5">
                          TOP →
                        </span>
                      )}
                      <span className="absolute right-2 top-2 text-[9px] text-slate-500 font-mono">
                        [{idx}]
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-500 text-center">
              Bottom of stack (Index 0) grounded at bottom
            </div>
          </div>
        </div>
      )}

      {/* 2. QUEUE VISUALIZER */}
      {activeDs === 'queue' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Controls (1 col) */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              Queue Controls (FIFO)
            </span>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={queueInput}
                onChange={(e) => setQueueInput(Number(e.target.value))}
                className="w-24 p-1.5 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-slate-200"
              />
              <button
                onClick={handleEnqueue}
                className="flex items-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-sm text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ENQUEUE</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDequeue}
                disabled={queue.length === 0}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold rounded-sm text-xs"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>DEQUEUE FRONT</span>
              </button>

              <button
                onClick={handlePeekQueue}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-medium border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PEEK</span>
              </button>
            </div>

            <button
              onClick={() => {
                setQueue([]);
                setQueueMessage('Queue cleared.');
              }}
              className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-sm text-xs font-medium border border-slate-800"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Queue</span>
            </button>

            <div className="mt-auto p-2 bg-slate-950 border border-slate-800 rounded-sm text-[11px] font-mono text-slate-400 space-y-1">
              <div>Queue Size: {queue.length} / 10</div>
              <div>Front Index: 0 | Rear: {queue.length > 0 ? queue.length - 1 : 'Empty'}</div>
              <div>Complexity: Enqueue O(1), Dequeue O(1)</div>
            </div>
          </div>

          {/* Visual Container (2 cols) */}
          <div className="md:col-span-2 p-4 bg-slate-950 border border-slate-800 rounded-md flex flex-col justify-between min-h-[360px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-xs font-mono text-slate-400">
              <span>Horizontal Linear Queue Buffer</span>
              <span>{queueMessage}</span>
            </div>

            {/* Queue Runway */}
            <div className="flex items-center justify-start gap-2 p-4 border-y-2 border-slate-700 bg-slate-900/40 rounded-sm overflow-x-auto min-h-[140px] my-auto">
              {queue.length === 0 ? (
                <span className="text-slate-600 font-mono text-xs mx-auto">[ Queue is Empty ]</span>
              ) : (
                queue.map((val, idx) => {
                  const isFront = idx === 0;
                  const isRear = idx === queue.length - 1;

                  return (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-20 h-20 rounded-sm border border-slate-700 bg-slate-800 flex flex-col items-center justify-center relative font-mono transition-all"
                    >
                      {isFront && (
                        <span className="absolute -top-5 text-[9px] font-bold text-emerald-400 font-mono">
                          ▲ FRONT
                        </span>
                      )}
                      <span className="text-sm font-bold text-slate-200">{val}</span>
                      <span className="text-[10px] text-slate-500 mt-1">Slot {idx}</span>
                      {isRear && (
                        <span className="absolute -bottom-5 text-[9px] font-bold text-sky-400 font-mono">
                          ▼ REAR
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 px-2">
              <span>← Elements Dequeue at Front (Head)</span>
              <span>Elements Enqueue at Rear (Tail) ←</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. BINARY SEARCH TREE (BST) VISUALIZER */}
      {activeDs === 'bst' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Controls (1 col) */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              BST Operations
            </span>

            {/* Insert */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={bstInput}
                onChange={(e) => setBstInput(Number(e.target.value))}
                className="w-24 p-1.5 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-slate-200"
              />
              <button
                onClick={handleInsertBst}
                className="flex items-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-sm text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>INSERT</span>
              </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={bstSearchVal}
                onChange={(e) => setBstSearchVal(Number(e.target.value))}
                className="w-24 p-1.5 bg-slate-950 border border-slate-800 rounded-sm font-mono text-xs text-slate-200"
              />
              <button
                onClick={handleSearchBst}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-sm text-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>SEARCH</span>
              </button>
            </div>

            {/* In-Order Traversal sequence */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <span className="text-slate-400 text-xs font-medium">In-Order Sorted Sequence:</span>
              <div className="p-2 bg-slate-950 rounded-sm border border-slate-800 font-mono text-xs text-emerald-400 flex flex-wrap gap-1">
                {getInOrder(bstRoot).map((val, idx) => (
                  <span key={idx} className="bg-slate-900 px-1.5 py-0.5 rounded-xs border border-slate-800">
                    {val}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto p-2 bg-slate-950 border border-slate-800 rounded-sm text-[11px] font-mono text-slate-400 space-y-1">
              <div>Complexity: Search O(h), Insert O(h)</div>
              <div>Balanced Tree: h = O(log n)</div>
              <div>Skewed Tree: h = O(n)</div>
            </div>
          </div>

          {/* SVG Tree View (2 cols) */}
          <div className="md:col-span-2 p-4 bg-slate-950 border border-slate-800 rounded-md flex flex-col justify-between min-h-[360px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-xs font-mono text-slate-400">
              <span>Interactive BST Topology</span>
              <span className="text-sky-300">{bstMessage}</span>
            </div>

            <svg className="w-full h-72">
              {/* Edges */}
              {bstLayout.edges.map((e, idx) => (
                <line
                  key={idx}
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke="#334155"
                  strokeWidth="2"
                />
              ))}

              {/* Nodes */}
              {bstLayout.nodes.map((n) => {
                const isHighlighted = highlightedNodes.includes(n.val);
                return (
                  <g key={n.val}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={18}
                      fill={isHighlighted ? '#f59e0b' : '#1e293b'}
                      stroke={isHighlighted ? '#fbbf24' : '#475569'}
                      strokeWidth="2"
                      className="transition-colors duration-150"
                    />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill={isHighlighted ? '#0f172a' : '#f8fafc'}
                      className="font-mono select-none"
                    >
                      {n.val}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 px-2">
              <span>Left child &lt; Parent &lt; Right child</span>
              <span>In-order yields strictly ascending order</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
