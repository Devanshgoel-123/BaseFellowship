import { PlayScene } from "@/lib/bubbleType";

export function preloadAssets(scene: PlayScene) {
  console.log('preloadAssets called');
  
  // Underwater background
  scene.load.image('underwater_bg', '/assets/backgrounds/underwaterbg.svg');
  
  // Game elements
  scene.load.image('cannon', '/assets/game_assest/cannon.png');
  scene.load.image('aim', '/assets/game_assest/aim.png');
  
  // Bubbles with character designs
  scene.load.image('b1', '/assets/bubbles/bubble1.png'); // Green bubble with bird character
  scene.load.image('b2', '/assets/bubbles/bubble2.png'); // Blue bubble with pixelated face
  scene.load.image('b3', '/assets/bubbles/bubble3.png'); // Red/Orange bubble with human character
  scene.load.image('b4', '/assets/bubbles/bubble4.png'); // Yellow/Gold bubble with pixelated face
  
  
  // Shipwreck silhouette
  scene.load.image('shipwreck', '/assets/game_assest/cannon.png'); // Using existing asset as placeholder
  
  console.log('preloadAssets completed');
}