// src/components/player-timer/utils/formatters.ts
import { DANGER_THRESHOLD, WARNING_THRESHOLD } from "./constants";

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const calculatePercentage = (
  playerTime: number,
  gameTime: number
): string => {
  if (gameTime === 0) return "0.0";
  return ((playerTime / gameTime) * 100).toFixed(1);
};

export const getBackgroundColor = (
  isActive: boolean,
  currentActiveTime: number
): string => {
  if (!isActive) return "bg-gray-50";
  if (currentActiveTime >= DANGER_THRESHOLD) return "bg-red-100";
  if (currentActiveTime >= WARNING_THRESHOLD) return "bg-yellow-100";
  return "bg-green-100";
};
