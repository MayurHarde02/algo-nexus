# ALGO NEXUS
**Interactive Algorithm Visualization and Analysis Platform**

**Live Repository**: https://github.com/MayurHarde02/algo-nexus  
**License**: MIT  
**Current Release**: v1.0.0  

An interactive visual learning environment designed for Computer Engineering, Data Structures, Algorithms, and Operating Systems courses.

ALGO NEXUS pairs deterministic execution engines with real-time visual inspection, line-by-line pseudocode tracking, empirical memory mutation counters, and formal asymptotic Big-O complexity bounds.

---

## Architecture and Core Design Principles

1. **Deterministic Step Engines**: Algorithm computation is strictly decoupled from presentation. Algorithms produce an ordered, immutable snapshot stream.
2. **True Operation Counters**: The application tracks concrete comparisons, swaps, memory writes, queue transitions, and timeline schedules rather than relying on variable browser clock timers.
3. **Bidirectional Scrubbing & Instant Finish**: Full support for Play, Pause, Step Forward, Step Backward, Instant Finish (`[F]`), Reset (`[R]`), and Variable Time-Interval controls.
4. **Keyboard Shortcuts**: Hotkeys for rapid interaction (`Space` for play/pause, `←`/`→` for stepping, `R` for reset, `F` for finish, `1-5` for speed presets).
5. **Engineering Aesthetic**: Built with high-contrast, technical UI standards without gradients, pill buttons, marketing counters, or artificial fluff.

---

## Platform Modules

### 1. Sorting Arena
- **Supported Algorithms**: Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, Quick Sort (Lomuto Partition), Heap Sort.
- **Variable Inspector**: Live inspection of active register variables (`i`, `j`, `key`, `pivot`, `minIndex`, `heapSize`) with changed values highlighted.
- **Decision Logic**: Plain-English explanations explaining exactly why each swap, shift, or partition occurred.
- **Pseudocode Panel**: Real-time line-by-line execution tracking with collapsible view and documented loop invariants.

### 2. Algorithm Race
- **Comparative Benchmarking**: Run two distinct algorithms simultaneously over the exact same data seed.
- **Divergence Analysis**: Observe how O(n log n) algorithms (Quick/Merge/Heap) diverge from O(n^2) algorithms (Bubble/Insertion/Selection) in step operations and comparisons.

### 3. Benchmark Lab
- **Multi-Size Empirical Analysis**: Evaluates algorithms over increasing input sizes (N = 10, 20, 40, 80, 120).
- **Distribution Patterns**: Test behavior against Random, Sorted (Best-Case), Reverse-Sorted (Worst-Case), and Nearly Sorted arrays.
- **Interactive Growth Chart**: Visual bar representation illustrating the steep divergence between quadratic and log-linear algorithms.

### 4. Data Structures Lab
- **Stack (LIFO)**: Push, Pop, Peek, Clear with dynamic `TOP` pointer indicator.
- **Queue (FIFO)**: Enqueue, Dequeue, Peek, Clear with `FRONT` and `REAR` pointer indicators.
- **Binary Search Tree (BST)**: Insert, Search with animated path highlighting, and In-Order sorted extraction.

### 5. Challenge Mode
- **Comprehension Assessment**: Interactive questions derived from concrete algorithmic invariants and worst-case bounds.
- **Instant Verification**: Feedback explaining why an answer is correct or incorrect based on data structure properties.

### 6. Pathfinding Lab
- **Supported Algorithms**: Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Algorithm, A* Search (Manhattan heuristic).
- **Interactive Matrix Grid**: Click or drag to draw and erase wall obstacles; reposition start and destination points.
- **Maze Generators**: Recursive Division Maze and Random Obstacle density (28%).

### 7. CPU Scheduling Simulator
- **Supported Policies**: First-Come, First-Served (FCFS), Shortest Job First (SJF - Non-Preemptive), Round Robin (RR - Preemptive with configurable Time Quantum Q).
- **Interactive Process Table & Gantt Timeline**: Visual process execution sequence with CPU idle interval detection.
- **Mathematical Identities**: Automated verification of CT, TAT = CT - AT, and WT = TAT - BT.

### 8. Node-Link Graph Explorer
- **Preset Topologies**: Directed Acyclic Graph (DAG), Complete Binary Tree, Cyclic Network.
- **Memory Inspection**: Live visualization of the active FIFO Queue (BFS) and LIFO Stack (DFS) memory contents.

### 9. Asymptotic Complexity Reference
- Master reference table comparing theoretical Big-O bounds (Best, Average, Worst, Auxiliary Space, Stability, In-Place nature, and Core Invariants).

---

## Saved Experiments

Users can save complete experiment configurations to browser LocalStorage, review saved profiles, and export or import experiment setups via JSON files.

---

## Getting Started

### Prerequisites
- Node.js LTS (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository and enter directory
git clone https://github.com/MayurHarde02/algo-nexus.git
cd algo-nexus

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### Test Suite
Run the algorithm correctness and scheduling verification unit tests:
```bash
npm run test
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Technical Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS
- **Iconography**: Lucide Icons
- **Testing**: Vitest (49 unit tests)
- **License**: MIT
