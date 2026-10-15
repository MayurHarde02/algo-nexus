import { describe, it, expect } from 'vitest';
import { CacheSimulator } from './cacheSimulation';

describe('Cache Simulator Unit Tests', () => {
  it('Direct-Mapped cache registers cold miss then subsequent hits on spatial line', () => {
    const sim = new CacheSimulator({ lineSize: 4, numLines: 8, associativity: 'direct' });

    // First access to index 0: Cold Miss (Block 0 loaded into line 0, brings indices 0, 1, 2, 3)
    const res0 = sim.access(0);
    expect(res0.isHit).toBe(false);
    expect(res0.lineIndex).toBe(0);
    expect(sim.misses).toBe(1);

    // Access to index 1: Spatial Locality Hit
    const res1 = sim.access(1);
    expect(res1.isHit).toBe(true);
    expect(sim.hits).toBe(1);

    // Access to index 2: Spatial Locality Hit
    const res2 = sim.access(2);
    expect(res2.isHit).toBe(true);
    expect(sim.hits).toBe(2);

    expect(sim.hitRate).toBeCloseTo(66.67, 1);
  });

  it('2-Way Set Associative cache manages conflict misses using LRU policy', () => {
    const sim = new CacheSimulator({ lineSize: 4, numLines: 4, associativity: 'two-way' });

    // Set 0 has lines 0 and 1.
    // Access Block 0 (Index 0): loads into Way 0
    sim.access(0);
    // Access Block 2 (Index 8 -> Block 2 % 2 = Set 0): loads into Way 1
    sim.access(8);

    expect(sim.lines[0].valid).toBe(true);
    expect(sim.lines[1].valid).toBe(true);
    expect(sim.misses).toBe(2);

    // Re-access Index 0: Should be a HIT in Way 0
    const res = sim.access(0);
    expect(res.isHit).toBe(true);
  });
});
