export interface CacheLineState {
  lineIndex: number;
  valid: boolean;
  tag: number;
  blockNumber: number;
  dataIndices: number[]; // Array indices currently residing in this cache line
  lastUsedTimestamp: number;
}

export interface CacheAccessResult {
  index: number;
  isHit: boolean;
  lineIndex: number;
  tag: number;
  evictedBlock?: number;
}

export interface CacheConfig {
  lineSize: number; // elements per cache line (e.g., 4)
  numLines: number; // total lines in cache (e.g., 8)
  associativity: 'direct' | 'two-way';
}

export class CacheSimulator {
  config: CacheConfig;
  lines: CacheLineState[];
  hits: number;
  misses: number;
  accessCount: number;

  constructor(config: CacheConfig = { lineSize: 4, numLines: 8, associativity: 'direct' }) {
    this.config = config;
    this.hits = 0;
    this.misses = 0;
    this.accessCount = 0;
    this.lines = Array.from({ length: config.numLines }, (_, idx) => ({
      lineIndex: idx,
      valid: false,
      tag: -1,
      blockNumber: -1,
      dataIndices: [],
      lastUsedTimestamp: 0,
    }));
  }

  reset(): void {
    this.hits = 0;
    this.misses = 0;
    this.accessCount = 0;
    this.lines = Array.from({ length: this.config.numLines }, (_, idx) => ({
      lineIndex: idx,
      valid: false,
      tag: -1,
      blockNumber: -1,
      dataIndices: [],
      lastUsedTimestamp: 0,
    }));
  }

  access(index: number): CacheAccessResult {
    this.accessCount++;
    const blockNumber = Math.floor(index / this.config.lineSize);
    const elementsInBlock = Array.from(
      { length: this.config.lineSize },
      (_, k) => blockNumber * this.config.lineSize + k
    );

    if (this.config.associativity === 'direct') {
      const lineIndex = blockNumber % this.config.numLines;
      const tag = Math.floor(blockNumber / this.config.numLines);
      const line = this.lines[lineIndex];

      const isHit = line.valid && line.tag === tag;
      let evictedBlock: number | undefined;

      if (isHit) {
        this.hits++;
        line.lastUsedTimestamp = this.accessCount;
      } else {
        this.misses++;
        if (line.valid) {
          evictedBlock = line.blockNumber;
        }
        line.valid = true;
        line.tag = tag;
        line.blockNumber = blockNumber;
        line.dataIndices = elementsInBlock;
        line.lastUsedTimestamp = this.accessCount;
      }

      return { index, isHit, lineIndex, tag, evictedBlock };
    } else {
      // 2-Way Set Associative (LRU Replacement)
      const numSets = this.config.numLines / 2;
      const setIndex = blockNumber % numSets;
      const tag = Math.floor(blockNumber / numSets);
      const way0Idx = setIndex * 2;
      const way1Idx = setIndex * 2 + 1;

      const line0 = this.lines[way0Idx];
      const line1 = this.lines[way1Idx];

      if (line0.valid && line0.tag === tag) {
        this.hits++;
        line0.lastUsedTimestamp = this.accessCount;
        return { index, isHit: true, lineIndex: way0Idx, tag };
      }

      if (line1.valid && line1.tag === tag) {
        this.hits++;
        line1.lastUsedTimestamp = this.accessCount;
        return { index, isHit: true, lineIndex: way1Idx, tag };
      }

      // Miss - Select victim using LRU
      this.misses++;
      let targetLine = line0;
      let targetIdx = way0Idx;

      if (!line0.valid) {
        targetLine = line0;
        targetIdx = way0Idx;
      } else if (!line1.valid) {
        targetLine = line1;
        targetIdx = way1Idx;
      } else if (line1.lastUsedTimestamp < line0.lastUsedTimestamp) {
        targetLine = line1;
        targetIdx = way1Idx;
      }

      const evictedBlock = targetLine.valid ? targetLine.blockNumber : undefined;
      targetLine.valid = true;
      targetLine.tag = tag;
      targetLine.blockNumber = blockNumber;
      targetLine.dataIndices = elementsInBlock;
      targetLine.lastUsedTimestamp = this.accessCount;

      return { index, isHit: false, lineIndex: targetIdx, tag, evictedBlock };
    }
  }

  get hitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  }

  get missRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? (this.misses / total) * 100 : 0;
  }
}

export function computeCacheReplay(
  arrayAccessSnapshots: { array: { state: string }[] }[],
  currentIndex: number,
  config: CacheConfig = { lineSize: 4, numLines: 8, associativity: 'direct' }
) {
  const sim = new CacheSimulator(config);
  let lastAccess: { index: number; isHit: boolean; lineIndex: number } | undefined;

  for (let s = 0; s <= currentIndex && s < arrayAccessSnapshots.length; s++) {
    const snap = arrayAccessSnapshots[s];
    snap.array.forEach((el, idx) => {
      if (el.state === 'comparing' || el.state === 'swapping' || el.state === 'pivot') {
        const res = sim.access(idx);
        if (s === currentIndex) {
          lastAccess = { index: idx, isHit: res.isHit, lineIndex: res.lineIndex };
        }
      }
    });
  }

  return {
    lines: sim.lines,
    hits: sim.hits,
    misses: sim.misses,
    hitRate: sim.hitRate,
    missRate: sim.missRate,
    lastAccess,
  };
}
