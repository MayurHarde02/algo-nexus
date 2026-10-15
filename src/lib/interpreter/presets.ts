export interface SandboxPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
}

export const SANDBOX_PRESETS: SandboxPreset[] = [
  {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    category: 'Sorting',
    description: 'Repeatedly steps through the input list, compares adjacent elements, and swaps them if they are in the wrong order.',
    code: `// Bubble Sort Algorithm
let arr = [64, 34, 25, 12, 22, 11, 90]
let n = 7

for i = 0 to n - 1 {
  for j = 0 to n - i - 2 {
    if arr[j] > arr[j + 1] {
      swap(arr[j], arr[j + 1])
    }
  }
}
`,
  },
  {
    id: 'binarySearch',
    name: 'Binary Search',
    category: 'Searching',
    description: 'Divides the search interval in half repeatedly to locate target value 23 within a sorted list.',
    code: `// Binary Search Algorithm
let arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
let target = 23
let low = 0
let high = 9
let found = -1

while low <= high {
  let mid = (low + high) / 2
  if arr[mid] == target {
    found = mid
    low = high + 1
  } else if arr[mid] < target {
    low = mid + 1
  } else {
    high = mid - 1
  }
}
`,
  },
  {
    id: 'twoPointersReverse',
    name: 'Two-Pointers Array Reversal',
    category: 'Arrays',
    description: 'Inverts array elements in-place using converging left and right index pointers in O(n) time.',
    code: `// Two-Pointer In-Place Reversal
let arr = [10, 20, 30, 40, 50, 60]
let left = 0
let right = 5

while left < right {
  swap(arr[left], arr[right])
  left = left + 1
  right = right - 1
}
`,
  },
  {
    id: 'kadane',
    name: "Kadane's Maximum Subarray",
    category: 'Dynamic Programming',
    description: 'Calculates maximum subarray sum by maintaining current local maximum and global maximum.',
    code: `// Kadane's Maximum Subarray Sum
let arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
let maxSoFar = arr[0]
let currentMax = arr[0]
let n = 9

for i = 1 to n - 1 {
  if arr[i] > currentMax + arr[i] {
    currentMax = arr[i]
  } else {
    currentMax = currentMax + arr[i]
  }

  if currentMax > maxSoFar {
    maxSoFar = currentMax
  }
}
`,
  },
];
