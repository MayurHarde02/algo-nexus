# ALGO NEXUS
**Interactive Algorithm Visualization and Analysis Platform**

An interactive visual learning environment designed for Computer Engineering, Data Structures, Algorithms, and Operating Systems courses.

ALGO NEXUS pairs deterministic execution engines with real-time visual inspection, line-by-line pseudocode tracking, empirical memory mutation counters, and formal asymptotic Big-O complexity bounds.

---

## Architecture and Core Design Principles

1. **Deterministic Step Engines**: Algorithm computation is strictly decoupled from presentation. Algorithms produce an ordered, immutable snapshot stream.
2. **True Operation Counters**: The application tracks concrete comparisons, swaps, memory writes, queue transitions, and timeline schedules rather than relying on variable browser clock timers.
3. **Bidirectional Scrubbing**: Full support for Play, Pause, Step Forward, Step Backward, Reset, and Variable Time-Interval controls.
4. **Engineering Aesthetic**: Built with high-contrast, technical UI standards without gradients, pill buttons, marketing counters, or artificial fluff.

---

## Platform Modules

### 1. Sorting Arena
- **Supported Algorithms**: Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, Quick Sort (Lomuto Partition), Heap Sort.
- **Array Generation**: Random, Nearly Sorted (inversion demo), Reverse Sorted, Custom comma-separated numeric input (with validation).
- **HUD Counters**: Real-time comparison count, array writes/swaps count, array size N, step index.
- **Pseudocode Panel**: Real-time line-by-line execution tracking with loop invariants and algorithm descriptions.

### 2. Algorithm Race
- **Comparative Benchmarking**: Run two distinct algorithms simultaneously over the exact same data seed.
- **Divergence Analysis**: Observe how O(n log n) algorithms (Quick/Merge/Heap) diverge from O(n^2) algorithms (Bubble/Insertion/Selection) in step operations and comparisons.

### 3. Pathfinding Lab
- **Supported Algorithms**: Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Algorithm, A* Search (Manhattan heuristic).
- **Interactive Matrix Grid**: Click or drag to draw and erase wall obstacles; reposition start and destination points.
- **Maze Generators**: Recursive Division Maze and Random Obstacle density (28%).
- **Verification HUD**: Explored nodes count, shortest route length, and formal shortest-path guarantee indicator.

### 4. CPU Scheduling Simulator
- **Supported Policies**: First-Come, First-Served (FCFS), Shortest Job First (SJF - Non-Preemptive), Round Robin (RR - Preemptive with configurable Time Quantum Q).
- **Interactive Process Table**: Add, remove, or customize process arrival times (AT) and burst times (BT).
- **Interactive Gantt Timeline**: Visual process execution sequence with CPU idle interval detection.
- **Mathematical Identities**: Automated verification of:
  - Completion Time (CT)
  - Turnaround Time: `TAT = CT - AT`
  - Waiting Time: `WT = TAT - BT`
  - Average Turnaround Time, Average Waiting Time, CPU Utilization (%), and Throughput.

### 5. Node-Link Graph Explorer
- **Preset Topologies**: Directed Acyclic Graph (DAG), Complete Binary Tree, Cyclic Network.
- **Search Modes**: Breadth-First Search (BFS) and Depth-First Search (DFS).
- **Memory Inspection**: Live visualization of the active FIFO Queue (BFS) and LIFO Stack (DFS) memory contents.

### 6. Asymptotic Complexity Reference
- Master reference table comparing theoretical Big-O bounds (Best, Average, Worst, Auxiliary Space, Stability, In-Place nature, and Core Invariants).
- Live search and category filters.

---

## Getting Started

### Prerequisites
- Node.js LTS (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository and enter directory
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
npx vitest run
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
- **Testing**: Vitest
