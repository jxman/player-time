"use client";

import { useState } from "react";
import { Player } from "../utils/types";
import { MAX_PLAYERS, MAX_ACTIVE_PLAYERS } from "../utils/constants";

export function usePlayerManager(initialNames: string[]) {
  const [players, setPlayers] = useState<Player[]>(
    Array(MAX_PLAYERS)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        name: initialNames[i] || `Player ${i + 1}`,
        isActive: false,
        totalActiveTime: 0,
        currentActiveTime: 0,
        enabled: i < MAX_PLAYERS,
      }))
  );

  const togglePlayerActive = (id: number) => {
    setPlayers((currentPlayers) => {
      const activeCount = currentPlayers.filter((p) => p.isActive).length;
      const player = currentPlayers.find((p) => p.id === id);

      if (!player?.isActive && activeCount >= MAX_ACTIVE_PLAYERS) {
        return currentPlayers;
      }

      return currentPlayers.map((p) =>
        p.id === id
          ? {
              ...p,
              isActive: !p.isActive,
              currentActiveTime: 0,
            }
          : p
      );
    });
  };

  const updatePlayerTimes = (elapsedSeconds: number) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.isActive) {
          return {
            ...player,
            totalActiveTime: player.totalActiveTime + elapsedSeconds,
            currentActiveTime: player.currentActiveTime + elapsedSeconds,
          };
        }
        return player;
      })
    );
  };

  return {
    players,
    setPlayers,
    togglePlayerActive,
    updatePlayerTimes,
  };
}
