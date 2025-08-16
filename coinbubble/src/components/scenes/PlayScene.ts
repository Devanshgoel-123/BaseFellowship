// import * as Phaser from 'phaser';
// import { PlayScene } from '@/lib/bubbleType';
// import { preloadAssets } from './preloadAssets';
// import { addBackground } from './addBackground';
// import { createUI } from './createUI';
// import { createGameElements } from './createGameElements';
// import { createAbilities } from './createAbilities';
// import { createBubbles } from './createBubbles';
// import { setupInput } from './setupInput';
// import { getIntersectingBubble } from './getIntersectingBubble';
// import { popBubble } from './popBubble';
// import { cooldown } from './cooldown';
// import { onBubbleMiss } from './onBubbleMiss';
// import { onBubblePop } from './onBubblePop';
// import { updateScore } from './updateScore';
// import { updateLives } from './updateLives';
// import { endGame } from './endGame';

// export function createPlayScene(chosenCreator: string, onGameOver: (p: { score: number; lives: number; pops: number }) => void) {
//   console.log('createPlayScene called with:', { chosenCreator });
  
//   // class PlaySceneClass extends Phaser.Scene implements PlayScene{
//   //   bg!: Phaser.GameObjects.Image;
//   //   cannon!: Phaser.GameObjects.Image;
//   //   crosshair!: Phaser.GameObjects.Image;
//   //   bubbles!: Phaser.Physics.Arcade.Group;
//   //   score = 0;
//   //   timerText!: Phaser.GameObjects.Text;
//   //   timeLeft!: number;
//   //   pops = 0;
//   //   isShooting = true;
//   //   lastTap = 0;
//   //   scoreText!: Phaser.GameObjects.Text;
//   //   livesText!: Phaser.GameObjects.Text;
//   //   onGameOver!: (p: { score: number; lives: number; pops: number }) => void;

//   //   getIntersectingBubble!: (x: number, y: number, radius: number) => any;
//   //   popBubble!: (scene: PlayScene, b: any, increment: number) => void;
//   //   cooldown!: (scene: PlayScene) => void;
//   //   onBubbleMiss!: (scene: PlayScene) => void;
//   //   onBubblePop!: (scene: PlayScene, bubble: Phaser.GameObjects.GameObject) => void;
//   //   updateScore!: (scene: PlayScene) => void;
//   //   endGame!: (scene: PlayScene, onGameOver: (p: { score: number; lives: number; pops: number }) => void) => void;

//   //   constructor() {
//   //     super({ key: 'Play' });
//   //     console.log('PlaySceneClass constructor called');
//   //   }

//   //   preload() {
//   //     console.log('PlaySceneClass preload called');
//   //     preloadAssets(this);
//   //   }

//   //   create() {
//   //     console.log('PlaySceneClass create called');
//   //     // Initialize state
//   //     this.score = 0;
//   //     this.timeLeft=60;
//   //     this.pops = 0;
//   //     this.isShooting = true;
//   //     this.lastTap = 0;
//   //     this.onGameOver = onGameOver;

//   //     addBackground(this);
//   //     // createUI(this);
//   //     createGameElements(this);
//   //     // createAbilities(this, chosenCreator, onGameOver);
//   //     createBubbles(this);
//   //     setupInput(this, chosenCreator, onGameOver);
//   //   }
//   // }

//   // Create instance and assign helper methods
//   console.log('Creating PlaySceneClass instance...');
//   const scene = new PlaySceneClass();
//   console.log('PlaySceneClass instance created:', scene);
  
//   // Assign helper methods to the scene object
//   scene.getIntersectingBubble = getIntersectingBubble;
//   scene.popBubble = popBubble;
//   scene.cooldown = cooldown;
//   scene.onBubbleMiss = onBubbleMiss;
//   scene.onBubblePop = onBubblePop;
//   scene.updateScore = updateScore;
//   scene.endGame = endGame;

//   console.log('Returning scene:', scene);
//   return scene;
// }