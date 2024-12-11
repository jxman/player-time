// src/components/player-timer/hooks/useGameTimer.tsx
"use client";

import { useState, useRef, useEffect } from "react";

export function useGameTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const lastTickRef = useRef(Date.now());
  const visibilityTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityTimeRef.current = Date.now();
      } else if (isRunning) {
        const now = Date.now();
        const elapsedSeconds = Math.floor(
          (now - visibilityTimeRef.current) / 1000
        );
        if (elapsedSeconds > 0) {
          setGameTime((prevTime) => prevTime + elapsedSeconds);
          lastTickRef.current = now;
        }
      }
    };

    let animationFrameId: number;

    const updateGame = () => {
      const now = Date.now();
      const delta = Math.floor((now - lastTickRef.current) / 1000);

      if (delta >= 1) {
        setGameTime((prevTime) => prevTime + delta);
        lastTickRef.current = now;
      }

      if (isRunning) {
        animationFrameId = requestAnimationFrame(updateGame);
      }
    };

    if (isRunning) {
      lastTickRef.current = Date.now();
      visibilityTimeRef.current = Date.now();
      animationFrameId = requestAnimationFrame(updateGame);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRunning]);

  const resetTimer = () => {
    setIsRunning(false);
    setGameTime(0);
    lastTickRef.current = Date.now();
    visibilityTimeRef.current = Date.now();
  };

  return { isRunning, setIsRunning, gameTime, resetTimer };
}
