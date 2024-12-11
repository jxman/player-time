"use client";

import { Button } from "@/components/ui/button";
import { Player } from "../utils/types";
import { formatTime, calculatePercentage } from "../utils/formatters";
import { MAX_ACTIVE_PLAYERS } from "../utils/constants";

interface BenchPlayersProps {
  players: Player[];
  onActivate: (id: number) => void;
  gameTime: number; // Add gameTime prop
}

export function BenchPlayers({
  players,
  onActivate,
  gameTime,
}: BenchPlayersProps) {
  const benchPlayers = players.filter((p) => p.enabled && !p.isActive);
  const activeCount = players.filter((p) => p.enabled && p.isActive).length;

  return (
    <div className="mt-6">
      <div className="text-sm font-medium text-gray-500 mb-3">Bench</div>
      <div className="grid grid-cols-2 gap-2">
        {benchPlayers.map((player) => (
          <Button
            key={player.id}
            variant="outline"
            className="h-auto py-2"
            onClick={() => onActivate(player.id)}
            disabled={activeCount >= MAX_ACTIVE_PLAYERS}
          >
            <div className="flex flex-col items-start w-full text-left">
              <div className="font-medium">{player.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>{formatTime(player.totalActiveTime)}</span>
                <span>
                  ({calculatePercentage(player.totalActiveTime, gameTime)}%)
                </span>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
