// src/components/player-timer/PlayerTimeTracker.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useGameTimer } from "./hooks/useGameTimer";
import { usePlayerManager } from "./hooks/usePlayerManager";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Config } from "./utils/types";
import { MAX_PLAYERS, CONFIG_KEY } from "./utils/constants";
import { GameControls } from "./components/GameControls";
import { ActivePlayers } from "./components/ActivePlayers";
import { BenchPlayers } from "./components/BenchPlayers";
import { ConfigDialog } from "./components/ConfigDialog";

export default function PlayerTimeTracker() {
  // Use useState for initial mounting
  const [isMounted, setIsMounted] = useState(false);

  const [config, setConfig] = useLocalStorage<Config>(CONFIG_KEY, {
    activePlayers: MAX_PLAYERS,
    names: Array(MAX_PLAYERS)
      .fill("")
      .map((_, i) => `Player ${i + 1}`),
  });

  const { isRunning, setIsRunning, gameTime, resetTimer } = useGameTimer();
  const { players, setPlayers, togglePlayerActive, updatePlayerTimes } =
    usePlayerManager(config.names);

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleReset = () => {
    resetTimer();
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

  // Don't render until client-side
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
            onToggleRunning={() => setIsRunning(!isRunning)}
            onReset={handleReset}
          />
          <ConfigDialog
            config={config}
            onSave={setConfig}
            onUpdatePlayers={setPlayers}
          />
        </div>
      </div>

      <ActivePlayers players={players} onBench={togglePlayerActive} />

      <BenchPlayers players={players} onActivate={togglePlayerActive} />
    </div>
  );
}
