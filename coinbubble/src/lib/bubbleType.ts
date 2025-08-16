
import * as Phaser from 'phaser';
export interface Bubble {
  x: number;
  y: number;
  color: string;
  row: number;
  creator?: string;
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

// Creator bubble types for the new game mode
export interface CreatorBubble {
  x: number;
  y: number;
  row: number;
  col: number;
  creator: Creator;
  isHit: boolean;
}

export interface Creator {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
}

export interface CreatorPopupData {
  creator: Creator;
  points: number;
  isVisible: boolean;
}

export type GameMode = "classic" | "creator";

export interface UserSelection {
  type: "creator" | "user";
  selected: boolean;
}


export interface PlayScene extends Phaser.Scene {
  bg: Phaser.GameObjects.Image;
  cannon: Phaser.GameObjects.Image;
  crosshair: Phaser.GameObjects.Image;
  bubbles: Phaser.Physics.Arcade.Group;
  score: number;
  timerText: Phaser.GameObjects.Text; // actual text object
  timeLeft: number;
  pops: number;
  isShooting: boolean;
  lastTap: number;
  scoreText: Phaser.GameObjects.Text;
  livesText: Phaser.GameObjects.Text;
  onGameOver: (p: { score: number; lives: number; pops: number }) => void;
  getIntersectingBubble: (x: number, y: number, radius: number) => any;
  popBubble: (scene: PlayScene; b: any, increment: number) => void;
  cooldown: (scene: PlayScene) => void;
  onBubbleMiss: (scene: PlayScene) => void;
  onBubblePop: (scene: PlayScene, bubble: Phaser.GameObjects.GameObject) => void;
  updateScore: (scene: PlayScene) => void;
  endGame: (scene: PlayScene, onGameOver: (p: { score: number; lives: number; pops: number }) => void) => void;
  
}