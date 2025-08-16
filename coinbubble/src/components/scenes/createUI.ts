import { PlayScene } from "@/lib/bubbleType";

export function createUI(scene: PlayScene) {
  // Background bar
  scene.add.rectangle(
    0,
    0,
    scene.scale.width,
    80,
    0x000000,
    0.6
  )
  .setOrigin(0, 0);

  // Padding values
  const paddingX = 20;
  const labelY = 20;
  const valueY = 30;

  scene.add.text(paddingX, labelY, 'SCORE', { 
    fontSize: '16px', 
    color: '#FFFFFF',
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'bold',
  });

  scene.scoreText = scene.add.text(paddingX, valueY, '0', { 
    fontSize: '24px', 
    color: '#FFD700',
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'bold'
  } as Phaser.Types.GameObjects.Text.TextStyle);

  scene.add.text(scene.scale.width / 2, labelY, 'TIME', {
    fontSize: '16px',
    color: '#FFFFFF',
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'bold'
  }).setOrigin(0.5, 0.5);

  // TIMER value
  scene.timeLeft = 60; // numeric countdown
  scene.timerText = scene.add.text(scene.scale.width / 2, valueY, scene.timeLeft.toString(), {
    fontSize: '24px',
    color: '#00FFAA',
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'bold'
  } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5, 0);

  // Example: start countdown from 60 seconds
  scene.time.addEvent({
    delay: 1000,
    callback: () => {
      scene.timeLeft--;
      scene.timerText.setText(scene.timeLeft.toString());
      if (scene.timeLeft <= 0) {
        // Handle game over
        scene.onGameOver({ score: scene.score, lives: 0, pops: scene.pops });
      }
    },
    loop: true
  });
  
}
