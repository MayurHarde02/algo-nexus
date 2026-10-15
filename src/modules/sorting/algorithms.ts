import type { AlgorithmMetadata, ElementState, SortingAlgorithmKey, SortingSnapshot } from '../../types/sorting';

export const SORTING_METADATA: Record<SortingAlgorithmKey, AlgorithmMetadata> = {
  bubble: {
    key: 'bubble',
    name: 'Bubble Sort',
    category: 'Exchange Sort',
    timeBest: 'Ω(n)',
    timeAverage: 'Θ(n²)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    inPlace: true,
    pseudocode: [
      'procedure bubbleSort(A: list of sortable items)',
      '  n := length(A)',
      '  repeat',
      '    swapped := false',
      '    for i := 1 to n-1 inclusive do',
      '      if A[i-1] > A[i] then',
      '        swap(A[i-1], A[i])',
      '        swapped := true',
      '      end if',
      '    end for',
      '    n := n - 1',
      '  until not swapped',
      'end procedure',
    ],
    description:
      'Iteratively compares adjacent elements and swaps them if they are in the wrong order. With an early-exit flag, it detects sorted arrays in linear time.',
    invariants:
      'After pass k, the largest k elements are in their final sorted positions at the end of the array.',
  },
  insertion: {
    key: 'insertion',
    name: 'Insertion Sort',
    category: 'Insertion Sort',
    timeBest: 'Ω(n)',
    timeAverage: 'Θ(n²)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    inPlace: true,
    pseudocode: [
      'procedure insertionSort(A: list of sortable items)',
      '  for i := 1 to length(A) - 1 do',
      '    key := A[i]',
      '    j := i - 1',
      '    while j >= 0 and A[j] > key do',
      '      A[j + 1] := A[j]',
      '      j := j - 1',
      '    end while',
      '    A[j + 1] := key',
      '  end for',
      'end procedure',
    ],
    description:
      'Builds the sorted array one element at a time by repeatedly taking the next element and inserting it into its correct position within the already sorted prefix.',
    invariants:
      'Subarray A[0..i-1] consists of the original elements originally in A[0..i-1], but in sorted order.',
  },
  selection: {
    key: 'selection',
    name: 'Selection Sort',
    category: 'Selection Sort',
    timeBest: 'Ω(n²)',
    timeAverage: 'Θ(n²)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    inPlace: true,
    pseudocode: [
      'procedure selectionSort(A: list of sortable items)',
      '  n := length(A)',
      '  for i := 0 to n - 2 do',
      '    minIndex := i',
      '    for j := i + 1 to n - 1 do',
      '      if A[j] < A[minIndex] then',
      '        minIndex := j',
      '      end if',
      '    end for',
      '    if minIndex != i then',
      '      swap(A[i], A[minIndex])',
      '    end if',
      '  end for',
      'end procedure',
    ],
    description:
      'Divides the array into a sorted prefix and an unsorted suffix. Repeatedly finds the minimum element from the unsorted suffix and swaps it with the leftmost unsorted element.',
    invariants:
      'Subarray A[0..i-1] contains the smallest i elements of the array in sorted order.',
  },
  merge: {
    key: 'merge',
    name: 'Merge Sort',
    category: 'Divide and Conquer',
    timeBest: 'Ω(n log n)',
    timeAverage: 'Θ(n log n)',
    timeWorst: 'O(n log n)',
    spaceComplexity: 'O(n)',
    stability: 'Stable',
    inPlace: false,
    pseudocode: [
      'procedure mergeSort(A, left, right)',
      '  if left < right then',
      '    mid := floor((left + right) / 2)',
      '    mergeSort(A, left, mid)',
      '    mergeSort(A, mid + 1, right)',
      '    merge(A, left, mid, right)',
      '  end if',
      'end procedure',
      'procedure merge(A, left, mid, right)',
      '  copy sub-arrays L and R, then merge into A[left..right]',
      'end procedure',
    ],
    description:
      'A divide-and-conquer algorithm that recursively halves the array, sorts the halves, and merges them back together in linear time.',
    invariants:
      'After merging sub-arrays A[left..mid] and A[mid+1..right], the segment A[left..right] is sorted.',
  },
  quick: {
    key: 'quick',
    name: 'Quick Sort (Lomuto)',
    category: 'Divide and Conquer',
    timeBest: 'Ω(n log n)',
    timeAverage: 'Θ(n log n)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(log n)',
    stability: 'Unstable',
    inPlace: true,
    pseudocode: [
      'procedure quickSort(A, low, high)',
      '  if low < high then',
      '    p := partition(A, low, high)',
      '    quickSort(A, low, p - 1)',
      '    quickSort(A, p + 1, high)',
      '  end if',
      'end procedure',
      'procedure partition(A, low, high)',
      '  pivot := A[high], i := low - 1',
      '  for j := low to high - 1 do',
      '    if A[j] <= pivot then i := i + 1; swap(A[i], A[j])',
      '  swap(A[i + 1], A[high]); return i + 1',
      'end procedure',
    ],
    description:
      'Selects a pivot element, partitions the array such that elements smaller than the pivot precede it and elements larger follow it, and then recursively sorts the sub-partitions.',
    invariants:
      'All elements in A[low..i] are <= pivot, and all elements in A[i+1..j-1] are > pivot.',
  },
  heap: {
    key: 'heap',
    name: 'Heap Sort',
    category: 'Selection / Tree Sort',
    timeBest: 'Ω(n log n)',
    timeAverage: 'Θ(n log n)',
    timeWorst: 'O(n log n)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    inPlace: true,
    pseudocode: [
      'procedure heapSort(A: list of sortable items)',
      '  buildMaxHeap(A)',
      '  for i := length(A) - 1 down to 1 do',
      '    swap(A[0], A[i])',
      '    heapSize := heapSize - 1',
      '    maxHeapify(A, 0, heapSize)',
      '  end for',
      'end procedure',
      'procedure maxHeapify(A, i, heapSize)',
      '  largest := i, left := 2*i + 1, right := 2*i + 2',
      '  compare with children, swap and recurse if child > parent',
      'end procedure',
    ],
    description:
      'Transforms the array into a binary max-heap. It repeatedly extracts the maximum root element, moves it to the sorted end of the array, and restores heap order.',
    invariants:
      'For any index i in the heap, A[i] >= A[2i+1] and A[i] >= A[2i+2].',
  },
};

function createSnapshot(
  arr: number[],
  states: Record<number, ElementState>,
  comparisons: number,
  swaps: number,
  description: string,
  pseudocodeLine: number
): SortingSnapshot {
  return {
    array: arr.map((val, idx) => ({
      value: val,
      state: states[idx] || 'default',
      id: `elem-${idx}-${val}`,
    })),
    comparisons,
    swaps,
    description,
    pseudocodeLine,
  };
}

// 1. Bubble Sort Generator
export function generateBubbleSortSnapshots(initialArr: number[]): SortingSnapshot[] {
  const snapshots: SortingSnapshot[] = [];
  const a = [...initialArr];
  let comparisons = 0;
  let swaps = 0;
  const n = a.length;
  const states: Record<number, ElementState> = {};

  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Initial array state before sorting.', 0)
  );

  let swapped = false;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const compStates: Record<number, ElementState> = { ...states, [j]: 'comparing', [j + 1]: 'comparing' };
      snapshots.push(
        createSnapshot(
          a,
          compStates,
          comparisons,
          swaps,
          `Comparing A[${j}] (${a[j]}) and A[${j + 1}] (${a[j + 1]}).`,
          5
        )
      );

      if (a[j] > a[j + 1]) {
        swaps++;
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        swapped = true;

        const swapStates: Record<number, ElementState> = { ...states, [j]: 'swapping', [j + 1]: 'swapping' };
        snapshots.push(
          createSnapshot(
            a,
            swapStates,
            comparisons,
            swaps,
            `Inversion detected: swapped ${a[j + 1]} with ${a[j]}.`,
            6
          )
        );
      }
    }
    states[n - i - 1] = 'sorted';
    snapshots.push(
      createSnapshot(
        a,
        { ...states },
        comparisons,
        swaps,
        `Pass ${i + 1} completed. Element at index ${n - i - 1} (${a[n - i - 1]}) is in final sorted position.`,
        10
      )
    );

    if (!swapped) {
      snapshots.push(
        createSnapshot(
          a,
          { ...states },
          comparisons,
          swaps,
          'Early termination condition met: zero swaps performed during full pass. Array is fully sorted.',
          11
        )
      );
      break;
    }
  }

  for (let k = 0; k < n; k++) states[k] = 'sorted';
  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Bubble sort complete. Array is strictly sorted.', 12)
  );

  return snapshots;
}

// 2. Insertion Sort Generator
export function generateInsertionSortSnapshots(initialArr: number[]): SortingSnapshot[] {
  const snapshots: SortingSnapshot[] = [];
  const a = [...initialArr];
  let comparisons = 0;
  let swaps = 0; // corresponds to shift writes in insertion sort
  const n = a.length;
  const states: Record<number, ElementState> = { 0: 'sorted' };

  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Initial array state. Single element prefix A[0] is trivially sorted.', 1)
  );

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    states[i] = 'pivot';
    snapshots.push(
      createSnapshot(a, { ...states }, comparisons, swaps, `Inspecting key A[${i}] = ${key}. Searching insertion position in sorted prefix.`, 2)
    );

    while (j >= 0) {
      comparisons++;
      const compStates = { ...states, [j]: 'comparing' as ElementState, [j + 1]: 'pivot' as ElementState };
      snapshots.push(
        createSnapshot(a, compStates, comparisons, swaps, `Comparing sorted element A[${j}] (${a[j]}) with key (${key}).`, 4)
      );

      if (a[j] > key) {
        swaps++;
        a[j + 1] = a[j];
        const shiftStates = { ...states, [j + 1]: 'swapping' as ElementState };
        snapshots.push(
          createSnapshot(a, shiftStates, comparisons, swaps, `A[${j}] (${a[j]}) > key (${key}). Shifting A[${j}] right to position ${j + 1}.`, 5)
        );
        j--;
      } else {
        break;
      }
    }

    swaps++;
    a[j + 1] = key;
    for (let k = 0; k <= i; k++) states[k] = 'sorted';
    snapshots.push(
      createSnapshot(a, { ...states }, comparisons, swaps, `Inserted key ${key} at index ${j + 1}. Sorted prefix now spans indices 0 through ${i}.`, 8)
    );
  }

  for (let k = 0; k < n; k++) states[k] = 'sorted';
  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Insertion sort complete. All elements ordered.', 10)
  );

  return snapshots;
}

// 3. Selection Sort Generator
export function generateSelectionSortSnapshots(initialArr: number[]): SortingSnapshot[] {
  const snapshots: SortingSnapshot[] = [];
  const a = [...initialArr];
  let comparisons = 0;
  let swaps = 0;
  const n = a.length;
  const states: Record<number, ElementState> = {};

  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Initial state before selection passes.', 0)
  );

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    states[minIndex] = 'pivot';
    snapshots.push(
      createSnapshot(a, { ...states }, comparisons, swaps, `Pass ${i + 1}: Initialized current minimum candidate at index ${i} (${a[i]}).`, 3)
    );

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const compStates = { ...states, [j]: 'comparing' as ElementState, [minIndex]: 'pivot' as ElementState };
      snapshots.push(
        createSnapshot(a, compStates, comparisons, swaps, `Comparing A[${j}] (${a[j]}) with current minimum A[${minIndex}] (${a[minIndex]}).`, 5)
      );

      if (a[j] < a[minIndex]) {
        delete states[minIndex];
        minIndex = j;
        states[minIndex] = 'pivot';
        snapshots.push(
          createSnapshot(a, { ...states }, comparisons, swaps, `New minimum found: value ${a[minIndex]} at index ${minIndex}.`, 6)
        );
      }
    }

    if (minIndex !== i) {
      swaps++;
      const temp = a[i];
      a[i] = a[minIndex];
      a[minIndex] = temp;
      const swapStates = { ...states, [i]: 'swapping' as ElementState, [minIndex]: 'swapping' as ElementState };
      snapshots.push(
        createSnapshot(a, swapStates, comparisons, swaps, `Swapping minimum element ${a[i]} into index ${i}.`, 10)
      );
    }

    delete states[minIndex];
    states[i] = 'sorted';
    snapshots.push(
      createSnapshot(a, { ...states }, comparisons, swaps, `Position ${i} finalized with value ${a[i]}.`, 12)
    );
  }

  for (let k = 0; k < n; k++) states[k] = 'sorted';
  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Selection sort complete. Array fully sorted.', 13)
  );

  return snapshots;
}

// 4. Merge Sort Generator
export function generateMergeSortSnapshots(initialArr: number[]): SortingSnapshot[] {
  const snapshots: SortingSnapshot[] = [];
  const a = [...initialArr];
  let comparisons = 0;
  let swaps = 0; // memory writes
  const states: Record<number, ElementState> = {};

  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Initial array. Beginning recursive divide phase.', 0)
  );

  function merge(left: number, mid: number, right: number) {
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);

    for (let idx = left; idx <= right; idx++) {
      states[idx] = 'auxiliary';
    }
    snapshots.push(
      createSnapshot(
        a,
        { ...states },
        comparisons,
        swaps,
        `Merging sub-arrays A[${left}..${mid}] and A[${mid + 1}..${right}].`,
        8
      )
    );

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      states[k] = 'comparing';
      snapshots.push(
        createSnapshot(
          a,
          { ...states },
          comparisons,
          swaps,
          `Comparing left item (${leftArr[i]}) and right item (${rightArr[j]}).`,
          9
        )
      );

      if (leftArr[i] <= rightArr[j]) {
        swaps++;
        a[k] = leftArr[i];
        states[k] = 'swapping';
        snapshots.push(
          createSnapshot(a, { ...states }, comparisons, swaps, `Writing ${leftArr[i]} into index ${k}.`, 9)
        );
        i++;
      } else {
        swaps++;
        a[k] = rightArr[j];
        states[k] = 'swapping';
        snapshots.push(
          createSnapshot(a, { ...states }, comparisons, swaps, `Writing ${rightArr[j]} into index ${k}.`, 9)
        );
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      swaps++;
      a[k] = leftArr[i];
      states[k] = 'swapping';
      snapshots.push(
        createSnapshot(a, { ...states }, comparisons, swaps, `Copying remaining left item ${leftArr[i]} to index ${k}.`, 9)
      );
      i++;
      k++;
    }

    while (j < rightArr.length) {
      swaps++;
      a[k] = rightArr[j];
      states[k] = 'swapping';
      snapshots.push(
        createSnapshot(a, { ...states }, comparisons, swaps, `Copying remaining right item ${rightArr[j]} to index ${k}.`, 9)
      );
      j++;
      k++;
    }

    for (let idx = left; idx <= right; idx++) {
      delete states[idx];
    }
  }

  function sort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, a.length - 1);

  for (let k = 0; k < a.length; k++) states[k] = 'sorted';
  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Merge sort complete. All merges completed in O(n log n).', 10)
  );

  return snapshots;
}

// 5. Quick Sort (Lomuto)
export function generateQuickSortSnapshots(initialArr: number[]): SortingSnapshot[] {
  const snapshots: SortingSnapshot[] = [];
  const a = [...initialArr];
  let comparisons = 0;
  let swaps = 0;
  const states: Record<number, ElementState> = {};

  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Initial array. Beginning recursive Lomuto quicksort.', 0)
  );

  function partition(low: number, high: number): number {
    const pivot = a[high];
    states[high] = 'pivot';
    snapshots.push(
      createSnapshot(a, { ...states }, comparisons, swaps, `Selected pivot A[${high}] = ${pivot}. Partitioning range [${low}..${high}].`, 7)
    );

    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      states[j] = 'comparing';
      snapshots.push(
        createSnapshot(a, { ...states }, comparisons, swaps, `Comparing A[${j}] (${a[j]}) against pivot (${pivot}).`, 8)
      );

      if (a[j] <= pivot) {
        i++;
        swaps++;
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
        const swapStates = { ...states, [i]: 'swapping' as ElementState, [j]: 'swapping' as ElementState };
        snapshots.push(
          createSnapshot(a, swapStates, comparisons, swaps, `A[${j}] <= pivot: swapped A[${i}] and A[${j}].`, 8)
        );
      }
      states[j] = 'auxiliary';
    }

    swaps++;
    const temp = a[i + 1];
    a[i + 1] = a[high];
    a[high] = temp;
    delete states[high];
    states[i + 1] = 'sorted';
    snapshots.push(
      createSnapshot(
        a,
        { ...states },
        comparisons,
        swaps,
        `Placed pivot ${pivot} into its finalized split index ${i + 1}.`,
        9
      )
    );

    for (let k = low; k <= high; k++) {
      if (k !== i + 1 && states[k] !== 'sorted') {
        delete states[k];
      }
    }

    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const p = partition(low, high);
      sort(low, p - 1);
      sort(p + 1, high);
    } else if (low >= 0 && low < a.length) {
      states[low] = 'sorted';
    }
  }

  sort(0, a.length - 1);

  for (let k = 0; k < a.length; k++) states[k] = 'sorted';
  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Quick sort complete. Array fully partitioned and sorted.', 5)
  );

  return snapshots;
}

// 6. Heap Sort Generator
export function generateHeapSortSnapshots(initialArr: number[]): SortingSnapshot[] {
  const snapshots: SortingSnapshot[] = [];
  const a = [...initialArr];
  let comparisons = 0;
  let swaps = 0;
  const n = a.length;
  const states: Record<number, ElementState> = {};

  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Initial array. Phase 1: Building max heap in O(n).', 0)
  );

  function maxHeapify(heapSize: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < heapSize) {
      comparisons++;
      if (a[left] > a[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      comparisons++;
      if (a[right] > a[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      swaps++;
      const temp = a[root];
      a[root] = a[largest];
      a[largest] = temp;

      const swapStates = { ...states, [root]: 'swapping' as ElementState, [largest]: 'swapping' as ElementState };
      snapshots.push(
        createSnapshot(
          a,
          swapStates,
          comparisons,
          swaps,
          `Max-heap violation: swapped parent index ${root} (${a[largest]}) with larger child index ${largest} (${a[root]}).`,
          10
        )
      );

      maxHeapify(heapSize, largest);
    }
  }

  // Phase 1: Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    states[i] = 'pivot';
    snapshots.push(
      createSnapshot(a, { ...states }, comparisons, swaps, `Heapifying subtree rooted at index ${i}.`, 1)
    );
    delete states[i];
    maxHeapify(n, i);
  }

  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Max heap established. Root A[0] is the maximum element. Phase 2: Extraction.', 2)
  );

  // Phase 2: Extract elements
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    const temp = a[0];
    a[0] = a[i];
    a[i] = temp;
    states[i] = 'sorted';

    snapshots.push(
      createSnapshot(
        a,
        { ...states, [0]: 'swapping' },
        comparisons,
        swaps,
        `Extracted max element ${temp} to index ${i}. Restoring heap order for heap size ${i}.`,
        4
      )
    );

    maxHeapify(i, 0);
  }

  for (let k = 0; k < n; k++) states[k] = 'sorted';
  snapshots.push(
    createSnapshot(a, { ...states }, comparisons, swaps, 'Heap sort complete. All elements extracted in ascending order.', 6)
  );

  return snapshots;
}

export function getSortingSnapshots(algorithm: SortingAlgorithmKey, initialArr: number[]): SortingSnapshot[] {
  switch (algorithm) {
    case 'bubble':
      return generateBubbleSortSnapshots(initialArr);
    case 'insertion':
      return generateInsertionSortSnapshots(initialArr);
    case 'selection':
      return generateSelectionSortSnapshots(initialArr);
    case 'merge':
      return generateMergeSortSnapshots(initialArr);
    case 'quick':
      return generateQuickSortSnapshots(initialArr);
    case 'heap':
      return generateHeapSortSnapshots(initialArr);
  }
}
