export interface Player {
  id: number;
  name: string;
  isActive: boolean;
  totalActiveTime: number;
  currentActiveTime: number;
  enabled: boolean;
}

export interface Config {
  activePlayers: number;
  names: string[];
}
