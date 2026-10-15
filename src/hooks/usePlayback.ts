import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePlaybackOptions {
  totalSteps: number;
  initialSpeed?: number;
  onStepChange?: (index: number) => void;
  enableKeyboardShortcuts?: boolean;
}

export function usePlayback({
  totalSteps,
  initialSpeed = 200,
  onStepChange,
  enableKeyboardShortcuts = false,
}: UsePlaybackOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < totalSteps - 1) {
        const next = prev + 1;
        onStepChange?.(next);
        return next;
      }
      pause();
      return prev;
    });
  }, [totalSteps, onStepChange, pause]);

  const stepBackward = useCallback(() => {
    pause();
    setCurrentIndex((prev) => {
      const next = Math.max(0, prev - 1);
      onStepChange?.(next);
      return next;
    });
  }, [onStepChange, pause]);

  const reset = useCallback(() => {
    pause();
    setCurrentIndex(0);
    onStepChange?.(0);
  }, [pause, onStepChange]);

  const jumpTo = useCallback(
    (index: number) => {
      pause();
      const clamped = Math.max(0, Math.min(totalSteps - 1, index));
      setCurrentIndex(clamped);
      onStepChange?.(clamped);
    },
    [totalSteps, pause, onStepChange]
  );

  const jumpToEnd = useCallback(() => {
    pause();
    if (totalSteps > 0) {
      const lastIndex = totalSteps - 1;
      setCurrentIndex(lastIndex);
      onStepChange?.(lastIndex);
    }
  }, [totalSteps, pause, onStepChange]);

  const play = useCallback(() => {
    if (totalSteps <= 1) return;
    if (currentIndex >= totalSteps - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  }, [totalSteps, currentIndex]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Effect for playing interval
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < totalSteps - 1) {
          const next = prev + 1;
          onStepChange?.(next);
          return next;
        } else {
          clearTimer();
          setIsPlaying(false);
          return prev;
        }
      });
    }, speed);

    return () => clearTimer();
  }, [isPlaying, speed, totalSteps, onStepChange, clearTimer]);

  // Optional global keyboard listener
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        reset();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        jumpToEnd();
      } else if (e.key === '1') {
        setSpeed(500);
      } else if (e.key === '2') {
        setSpeed(250);
      } else if (e.key === '3') {
        setSpeed(120);
      } else if (e.key === '4') {
        setSpeed(50);
      } else if (e.key === '5') {
        setSpeed(15);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enableKeyboardShortcuts,
    togglePlay,
    stepForward,
    stepBackward,
    reset,
    jumpToEnd,
  ]);

  return {
    currentIndex,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    togglePlay,
    stepForward,
    stepBackward,
    reset,
    jumpTo,
    jumpToEnd,
    isAtStart: currentIndex === 0,
    isAtEnd: currentIndex >= totalSteps - 1,
  };
}
