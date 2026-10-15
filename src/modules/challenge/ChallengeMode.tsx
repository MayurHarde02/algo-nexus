import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  category: string;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CHALLENGES: Question[] = [
  {
    id: 1,
    category: 'Sorting Invariants',
    prompt: 'In standard Bubble Sort with input array [45, 12, 85, 32], which elements are compared in the first step, and will a swap occur?',
    options: [
      '45 and 12 are compared; a swap occurs because 45 > 12.',
      '45 and 32 are compared; no swap occurs.',
      '85 and 32 are compared; a swap occurs.',
      '12 and 85 are compared; no swap occurs.',
    ],
    correctIndex: 0,
    explanation: 'Bubble sort starts at index 0 and 1. Since A[0] (45) > A[1] (12), an inversion is detected and the two elements are swapped.',
  },
  {
    id: 2,
    category: 'Divide & Conquer',
    prompt: 'In Lomuto Partitioning of Quick Sort on array segment [14, 28, 9, 35, 18], which element is selected as the pivot and where is it located?',
    options: [
      'The median element 9 at index 2.',
      'The leftmost element 14 at index 0.',
      'The rightmost element 18 at index 4.',
      'A randomly chosen element.',
    ],
    correctIndex: 2,
    explanation: 'Standard Lomuto partitioning always designates the rightmost element (A[high]) as the pivot element before partitioning elements <= pivot to the left.',
  },
  {
    id: 3,
    category: 'Graph & Pathfinding',
    prompt: 'On an unweighted grid with multiple pathways between Start and Target, which of the following statements is strictly true?',
    options: [
      'DFS is guaranteed to find the shortest path because it explores deeper.',
      'BFS is guaranteed to find the shortest path in unweighted graphs because it explores uniform concentric radial frontiers.',
      'Both BFS and DFS guarantee the shortest path.',
      'Neither algorithm guarantees the shortest path without negative cycle detection.',
    ],
    correctIndex: 1,
    explanation: 'In unweighted graphs, BFS expands in FIFO order of edge distance from the root, guaranteeing the first time the target node is dequeued corresponds to the shortest path.',
  },
  {
    id: 4,
    category: 'Operating Systems Scheduling',
    prompt: 'Consider two processes: P1 arrives at t=0 with burst 8; P2 arrives at t=1 with burst 3. Under Non-Preemptive Shortest Job First (SJF), which process executes first?',
    options: [
      'P2 executes first because its burst (3) is shorter than P1 (8).',
      'P1 executes first because at t=0, P1 is the only process in the ready queue and cannot be preempted.',
      'CPU idles until t=1 to compare bursts.',
      'Both run concurrently with time slice 2.',
    ],
    correctIndex: 1,
    explanation: 'Because the policy is non-preemptive and P2 has not arrived at t=0, P1 begins execution immediately and retains the CPU until completion at t=8.',
  },
  {
    id: 5,
    category: 'Asymptotic Analysis',
    prompt: 'What is the worst-case time complexity of Quick Sort with Lomuto partitioning on an already sorted or reverse-sorted array without randomized pivot selection?',
    options: [
      'O(n log n)',
      'O(n)',
      'O(n²)',
      'O(log n)',
    ],
    correctIndex: 2,
    explanation: 'When the array is already sorted and the last element is chosen as pivot, the partition yields an unbalanced split of sizes 0 and n-1, degrading recursion depth to n and total runtime to O(n²).',
  },
  {
    id: 6,
    category: 'Binary Heaps',
    prompt: 'In a 0-indexed binary max-heap stored in a linear array, what is the formula to locate the left child of a node at index i?',
    options: [
      '2 * i',
      '2 * i + 1',
      '2 * i + 2',
      'floor((i - 1) / 2)',
    ],
    correctIndex: 1,
    explanation: 'In 0-indexed complete binary trees, left child is at 2*i + 1, right child is at 2*i + 2, and parent is at floor((i - 1) / 2).',
  },
];

export const ChallengeMode: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = CHALLENGES[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < CHALLENGES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-md">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Challenge & Comprehension Lab
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">
            Question {currentIndex + 1} of {CHALLENGES.length}
          </span>
          <span className="text-sky-300 font-bold bg-slate-950 px-2 py-0.5 rounded-sm border border-slate-800">
            Score: {score} / {CHALLENGES.length}
          </span>
          <button
            onClick={handleResetQuiz}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-md flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold">
            {currentQ.category}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            ID: #{currentQ.id}
          </span>
        </div>

        {/* Prompt */}
        <p className="text-sm text-slate-200 font-sans font-medium leading-relaxed">
          {currentQ.prompt}
        </p>

        {/* Option choices */}
        <div className="flex flex-col gap-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            let btnClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

            if (isAnswerSubmitted) {
              if (idx === currentQ.correctIndex) {
                btnClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
              } else if (isSelected) {
                btnClass = 'bg-rose-950/60 border-rose-500 text-rose-200 font-semibold';
              } else {
                btnClass = 'bg-slate-950 border-slate-900 text-slate-600 opacity-60';
              }
            } else if (isSelected) {
              btnClass = 'bg-sky-950/60 border-sky-400 text-sky-200 font-semibold';
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`p-3 rounded-sm border text-left text-xs transition-colors flex items-start gap-3 ${btnClass}`}
              >
                <span className="font-mono text-slate-500 select-none font-bold">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="flex-1">{option}</span>
                {isAnswerSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Decision & Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-semibold rounded-sm text-xs font-mono transition-colors"
            >
              CONFIRM ANSWER
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono font-bold flex items-center gap-1.5">
                {selectedOption === currentQ.correctIndex ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct Verification (+1)
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Incorrect Verification
                  </span>
                )}
              </span>

              {currentIndex < CHALLENGES.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-sm text-xs font-mono transition-colors"
                >
                  <span>NEXT CHALLENGE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-sm text-xs font-mono transition-colors"
                >
                  RETAKE ASSESSMENT
                </button>
              )}
            </div>
          )}
        </div>

        {/* Technical Explanation Output */}
        {isAnswerSubmitted && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-sm text-xs text-slate-300 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-sky-400 font-mono font-bold block">
              Algorithmic Explanation:
            </span>
            <p className="leading-relaxed text-slate-400 font-sans">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
