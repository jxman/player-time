"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatTime } from "../utils/formatters";

interface GameControlsProps {
  isRunning: boolean;
  gameTime: number;
  onToggleRunning: (shouldRun: boolean) => void;
  onReset: () => void;
}

export function GameControls({
  isRunning,
  gameTime,
  onToggleRunning,
  onReset,
}: GameControlsProps) {
  const handleToggle = () => {
    onToggleRunning(!isRunning);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center text-gray-600 text-sm">
        <span className="font-mono">{formatTime(gameTime)}</span>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleToggle}
          variant={isRunning ? "destructive" : "default"}
          size="icon"
          className="h-8 w-8"
        >
          {isRunning ? "▐▐" : "▶"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              ↺
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Game</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all player times to zero. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onReset}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
