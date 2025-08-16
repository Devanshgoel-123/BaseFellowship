import { PlayScene } from "@/lib/bubbleType";

export function createAbilities(scene: PlayScene, chosenCreator: string, onGameOver: (p: { score: number; lives: number; pops: number }) => void) {
  // Position ability buttons around the cannon like in the image
  // Left side buttons (stacked vertically)
  const ability1 = scene.add.image(scene.scale.width * 0.25, scene.scale.height * 0.85, 'ability1')
    .setScale(0.6)
    .setInteractive()
    .setTint(0x4A90E2); // Blue tint
  
  const ability2 = scene.add.image(scene.scale.width * 0.25, scene.scale.height * 0.92, 'ability2')
    .setScale(0.6)
    .setInteractive()
    .setTint(0xFF6B6B); // Red tint
  
  // Right side buttons (stacked vertically)
  const ability3 = scene.add.image(scene.scale.width * 0.75, scene.scale.height * 0.85, 'ability3')
    .setScale(0.6)
    .setInteractive()
    .setTint(0x87CEEB); // Light blue tint
  
  const ability4 = scene.add.image(scene.scale.width * 0.75, scene.scale.height * 0.92, 'ability4')
    .setScale(0.6)
    .setInteractive()
    .setTint(0x87CEEB); // Light blue tint
  
  // Add button backgrounds (rounded rectangles)
  const buttonBg1 = scene.add.graphics();
  buttonBg1.fillStyle(0x4A90E2, 0.8);
  buttonBg1.fillRoundedRect(ability1.x - 25, ability1.y - 25, 50, 50, 8);
  
  const buttonBg2 = scene.add.graphics();
  buttonBg2.fillStyle(0xFF6B6B, 0.8);
  buttonBg2.fillRoundedRect(ability2.x - 25, ability2.y - 25, 50, 50, 8);
  
  const buttonBg3 = scene.add.graphics();
  buttonBg3.fillStyle(0x87CEEB, 0.8);
  buttonBg3.fillRoundedRect(ability3.x - 25, ability3.y - 25, 50, 50, 8);
  
  const buttonBg4 = scene.add.graphics();
  buttonBg4.fillStyle(0x87CEEB, 0.8);
  buttonBg4.fillRoundedRect(ability4.x - 25, ability4.y - 25, 50, 50, 8);
  
  // Ability 1 (Brain) - Special ability
  ability1.on('pointerdown', () => {
    if (!scene.isShooting) return;
    console.log('Brain ability used');
    // Add brain effect
    const brain = scene.add.image(scene.scale.width / 2, scene.scale.height / 2, 'ability1').setScale(0.8);
    scene.tweens.add({
      targets: brain,
      scale: 1.5,
      alpha: 0,
      duration: 600,
      onComplete: () => brain.destroy()
    });
    
    // Special brain effect - highlight target bubbles
    scene.bubbles.getChildren().forEach((bubble: any) => {
      scene.tweens.add({
        targets: bubble,
        alpha: 0.5,
        duration: 200,
        yoyo: true,
        repeat: 1
      });
    });
  });
  
  // Ability 2 (Bomb) - Area damage
  ability2.on('pointerdown', () => {
    if (!scene.isShooting) return;
    console.log('Bomb ability used');
    const bomb = scene.add.image(scene.scale.width / 2, scene.scale.height / 2 - 100, 'ability2').setScale(0.5);
    scene.tweens.add({
      targets: bomb,
      scale: 2,
      alpha: 0,
      duration: 500,
      onComplete: () => bomb.destroy()
    });
    
    // Destroy nearby bubbles
    scene.bubbles.getChildren().forEach((bubble: any) => {
      const distance = Phaser.Math.Distance.Between(scene.scale.width / 2, scene.scale.height / 2 - 100, bubble.x, bubble.y);
      if (distance < 150) {
        scene.onBubblePop(scene, bubble);
      }
    });
  });
  
  // Ability 3 (Diamond/Gem) - Line clear
  ability3.on('pointerdown', () => {
    if (!scene.isShooting) return;
    console.log('Diamond ability used');
    const diamond = scene.add.image(scene.crosshair.x, scene.crosshair.y, 'ability3').setScale(0.7);
    scene.tweens.add({
      targets: diamond,
      scale: 1.5,
      alpha: 0,
      duration: 400,
      onComplete: () => diamond.destroy()
    });
    
    // Clear bubbles in a horizontal line
    const bubbles = scene.bubbles.getChildren() as any[];
    for (const bubble of bubbles) {
      if (Math.abs(bubble.y - scene.crosshair.y) < 30) {
        scene.onBubblePop(scene, bubble);
      }
    }
  });
  
  // Ability 4 (Lightning) - Vertical clear
  ability4.on('pointerdown', () => {
    if (!scene.isShooting) return;
    console.log('Lightning ability used');
    const lightning = scene.add.image(scene.crosshair.x, scene.crosshair.y, 'ability4').setScale(0.7);
    scene.tweens.add({
      targets: lightning,
      scale: 1.5,
      alpha: 0,
      duration: 400,
      onComplete: () => lightning.destroy()
    });
    
    // Clear bubbles in a vertical line
    const bubbles = scene.bubbles.getChildren() as any[];
    for (const bubble of bubbles) {
      if (Math.abs(bubble.x - scene.crosshair.x) < 30) {
        scene.onBubblePop(scene, bubble);
      }
    }
  });
}