"use client";

import { Button } from "@/components/ui/button";
import { Player } from "../utils/types";
import { formatTime, calculatePercentage } from "../utils/formatters";
import { MAX_ACTIVE_PLAYERS } from "../utils/constants";

interface ActivePlayersProps {
  players: Player[];
  onBench: (id: number) => void;
  gameTime: number; // Add gameTime prop
}

export function ActivePlayers({
  players,
  onBench,
  gameTime,
}: ActivePlayersProps) {
  const activePlayers = players.filter((p) => p.enabled && p.isActive);

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-500">
        Active Players ({activePlayers.length}/{MAX_ACTIVE_PLAYERS})
      </div>
      {activePlayers.map((player) => (
        <div
          key={player.id}
          className="flex flex-col space-y-2 p-3 rounded-lg transition-colors bg-green-100"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{player.name}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBench(player.id)}
            >
              Bench
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm font-mono">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span>Current: {formatTime(player.currentActiveTime)}</span>
              </div>
              <div className="flex items-center">
                <span>Total: {formatTime(player.totalActiveTime)}</span>
              </div>
            </div>
            <div className="text-gray-600">
              {calculatePercentage(player.totalActiveTime, gameTime)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
