// src/components/player-timer/components/ConfigDialog.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Config, Player } from "../utils/types";
import { MAX_PLAYERS } from "../utils/constants";

interface ConfigDialogProps {
  config: Config;
  onSave: (config: Config) => void;
  onUpdatePlayers: (updateFn: (players: Player[]) => Player[]) => void;
}

export function ConfigDialog({
  config,
  onSave,
  onUpdatePlayers,
}: ConfigDialogProps) {
  const [editableConfig, setEditableConfig] = useState<Config>({ ...config });

  // Update editableConfig when config changes
  useEffect(() => {
    setEditableConfig({ ...config });
  }, [config]);

  const handleConfigNameChange = (index: number, newName: string) => {
    setEditableConfig((current) => {
      const updatedNames = [...current.names];
      updatedNames[index] = newName;
      return {
        ...current,
        names: updatedNames,
      };
    });
  };

  const handleSave = () => {
    onSave(editableConfig);
    onUpdatePlayers((currentPlayers) =>
      currentPlayers.map((player, index) => ({
        ...player,
        name: editableConfig.names[index],
        enabled: index < editableConfig.activePlayers,
        isActive:
          index < editableConfig.activePlayers ? player.isActive : false,
      }))
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          ⚙
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[320px] max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-lg">Player Config</DialogTitle>
          <DialogDescription className="text-xs">
            Set active players and names
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-xs">
                Players: {editableConfig.activePlayers}
              </div>
              <input
                type="range"
                min="1"
                max={MAX_PLAYERS}
                value={editableConfig.activePlayers}
                onChange={(e) =>
                  setEditableConfig((current) => ({
                    ...current,
                    activePlayers: parseInt(e.target.value),
                  }))
                }
                className="flex-1 min-w-[80px] h-4"
              />
            </div>
            <div className="space-y-2">
              {editableConfig.names.map((name, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className={`text-xs w-14 ${
                      index >= editableConfig.activePlayers
                        ? "text-gray-400"
                        : ""
                    }`}
                  >
                    Player {index + 1}
                  </span>
                  <Input
                    value={name}
                    onChange={(e) =>
                      handleConfigNameChange(index, e.target.value)
                    }
                    className={`${
                      index >= editableConfig.activePlayers ? "opacity-50" : ""
                    } h-8 text-sm`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <Button onClick={handleSave} className="w-full h-8 text-sm">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
