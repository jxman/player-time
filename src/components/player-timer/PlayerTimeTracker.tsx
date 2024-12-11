"use client";

import React, { useEffect, useState } from "react";
import { useGameTimer } from "./hooks/useGameTimer";
import { usePlayerManager } from "./hooks/usePlayerManager";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Config } from "./utils/types";
import { MAX_PLAYERS, MAX_ACTIVE_PLAYERS, CONFIG_KEY } from "./utils/constants";
import { GameControls } from "./components/GameControls";
import { ActivePlayers } from "./components/ActivePlayers";
import { BenchPlayers } from "./components/BenchPlayers";
import { ConfigDialog } from "./components/ConfigDialog";

export default function PlayerTimeTracker() {
  const [isMounted, setIsMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const [config, setConfig] = useLocalStorage<Config>(CONFIG_KEY, {
    activePlayers: MAX_PLAYERS,
    names: Array(MAX_PLAYERS)
      .fill("")
      .map((_, i) => `Player ${i + 1}`),
  });

  const { isRunning, setIsRunning, gameTime, resetTimer } = useGameTimer();
  const { players, setPlayers } = usePlayerManager(config.names);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGameRunning = (shouldRun: boolean) => {
    setIsRunning(shouldRun);
    setLastUpdate(Date.now());
  };

  const handleTogglePlayer = (id: number) => {
    setPlayers((currentPlayers) => {
      const activeCount = currentPlayers.filter((p) => p.isActive).length;
      const player = currentPlayers.find((p) => p.id === id);

      if (!player) return currentPlayers;

      if (!player.isActive && activeCount >= MAX_ACTIVE_PLAYERS) {
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

  useEffect(() => {
    if (!isRunning) return;

    let frameId: number;
    const updateTimes = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdate) / 1000);

      if (elapsed >= 1) {
        setLastUpdate(now);
        setPlayers((current) =>
          current.map((player) => {
            if (player.isActive) {
              return {
                ...player,
                totalActiveTime: player.totalActiveTime + elapsed,
                currentActiveTime: player.currentActiveTime + elapsed,
              };
            }
            return player;
          })
        );
      }

      frameId = requestAnimationFrame(updateTimes);
    };

    frameId = requestAnimationFrame(updateTimes);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isRunning, lastUpdate]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isRunning) {
        setLastUpdate(Date.now());
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRunning]);

  const handleReset = () => {
    resetTimer();
    setLastUpdate(Date.now());
    setPlayers((currentPlayers) =>
      currentPlayers.map((player, index) => ({
        ...player,
        name: config.names[index],
        isActive: false,
        totalActiveTime: 0,
        currentActiveTime: 0,
        enabled: index < config.activePlayers,
      }))
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6" suppressHydrationWarning>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Player Time Tracker</h1>
        <div className="flex items-center gap-4">
          <GameControls
            isRunning={isRunning}
            gameTime={gameTime}
            onToggleRunning={handleGameRunning}
            onReset={handleReset}
          />
          <ConfigDialog
            config={config}
            onSave={setConfig}
            onUpdatePlayers={setPlayers}
          />
        </div>
      </div>

      <ActivePlayers
        players={players}
        onBench={handleTogglePlayer}
        gameTime={gameTime}
      />

      <BenchPlayers
        players={players}
        onActivate={handleTogglePlayer}
        gameTime={gameTime}
      />
    </div>
  );
}
