import { PlayScene } from "@/lib/bubbleType";
import { BALL_COLORS } from "@/lib/constants";

export function setupInput(scene: PlayScene, chosenCreator: string, onGameOver: (p: { score: number; lives: number; pops: number }) => void) {
  scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    const constrainedX = Phaser.Math.Clamp(pointer.x, 0, scene.scale.width);
    const constrainedY = Phaser.Math.Clamp(pointer.y, 0, scene.scale.height - 100);
    scene.crosshair.setPosition(constrainedX, constrainedY);

    const angle = Phaser.Math.Angle.Between(scene.cannon.x, scene.cannon.y, pointer.x, pointer.y);
    scene.cannon.setRotation(angle + Math.PI / 2);
  });

  scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (!scene.isShooting || scene.timeLeft <= 0) return;

    const now = scene.time.now;
    if (now - scene.lastTap < 150) return;
    scene.lastTap = now;

    // Timer check before firing
    if (scene.timeLeft <= 0) {
      scene.endGame(scene, onGameOver);
      return;
    }

    // Pick a random color
    const color = Phaser.Utils.Array.GetRandom(BALL_COLORS);
    console.log("Applied tint:", parseInt(color, 16));
    // Spawn ball

    const muzzleOffset = 40;
    const angle = Phaser.Math.Angle.Between(scene.cannon.x, scene.cannon.y, pointer.x, pointer.y);
    const spawnX = scene.cannon.x + Math.cos(angle) * muzzleOffset;
    const spawnY = scene.cannon.y + Math.sin(angle) * muzzleOffset;

    // Create a circle and add physics
    const ball = scene.add.circle(spawnX, spawnY, 16, parseInt(color, 16)) as Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
    scene.physics.add.existing(ball);

    ball.body.setCircle(16);
    ball.body.setBounce(1, 1);
    ball.body.setCollideWorldBounds(true);
    ball.setDepth(5);
    ball.body.setDrag(0);
    // Launch ball
    const speed = 1000; // Increased speed
    ball.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // Destroy ball if it hits bottom
    ball.body.onWorldBounds = true;
    scene.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject === ball && body.blocked.down) {
        ball.destroy();
      }
    });

    // Collision with bubbles
    scene.physics.add.collider(ball, scene.bubbles, (proj, bubble) => {
      const target = bubble as Phaser.Physics.Arcade.Image & { meta?: any };
      const creatorHit = target.meta?.creatorName === chosenCreator;
      const scoreIncrement = creatorHit ? 50 : target.meta?.scoreValue || 10;

      scene.score += scoreIncrement;
      scene.pops += 1;

      scene.popBubble(scene, target, scoreIncrement);
      scene.updateScore(scene);

      proj.destroy();

      // End game if timer ran out right after hit
      if (scene.timeLeft <= 0) {
        scene.endGame(scene, onGameOver);
      }
    });

    // Auto destroy after 5s
    scene.time.delayedCall(5000, () => {
      if (ball.active) ball.destroy();
    });
  });
}