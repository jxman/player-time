"use client";

import { useState, useRef, useEffect } from "react";

export function useGameTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const lastTickRef = useRef(Date.now());
  const visibilityTimeRef = useRef(Date.now());

  const updateTime = (elapsedSeconds: number) => {
    setGameTime((prevTime) => prevTime + elapsedSeconds);
  };

  useEffect(() => {
    let animationFrameId: number;

    const updateGame = () => {
      const now = Date.now();
      const delta = Math.floor((now - lastTickRef.current) / 1000);

      if (delta >= 1) {
        updateTime(delta);
        lastTickRef.current = now;
      }

      if (isRunning) {
        animationFrameId = requestAnimationFrame(updateGame);
      }
    };

    if (isRunning) {
      lastTickRef.current = Date.now();
      animationFrameId = requestAnimationFrame(updateGame);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
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
