export interface Bubble {
  x: number;
  y: number;
  color: string;
  creator?: string;
  row: number;
  col: number;
}

export interface ShootingBubble {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}

export type GameState = "playing" | "gameOver" | "won" | "lost";
