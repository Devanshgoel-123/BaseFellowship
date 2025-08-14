import { Bubble, ShootingBubble } from "../../lib/bubbleType";
import { BUBBLE_RADIUS } from "../../lib/constants";
import {
  findConnectedBubbles,
  findFloatingBubbles,
  calculateGridPosition,
} from "../../lib/functions";

interface GameLogicProps {
  shootingBubble: ShootingBubble;
  bubbles: Bubble[];
  canvasWidth: number;
  canvasHeight: number;
}

export const checkCollision = ({
  shootingBubble,
  bubbles,
  canvasWidth,
  canvasHeight,
}: GameLogicProps): {
  collision: boolean;
  collisionBubble: Bubble | null;
  newX: number;
  newY: number;
  shouldBounce: boolean;
} => {
  let collision = false;
  let collisionBubble: Bubble | null = null;
  let newX = shootingBubble.x;
  let newY = shootingBubble.y;
  let shouldBounce = false;

  // Wall collision - bounce
  if (
    shootingBubble.x <= BUBBLE_RADIUS ||
    shootingBubble.x >= canvasWidth - BUBBLE_RADIUS
  ) {
    shouldBounce = true;
    newX = shootingBubble.x <= BUBBLE_RADIUS ? BUBBLE_RADIUS : canvasWidth - BUBBLE_RADIUS;
  }

  // Ceiling collision - stick
  if (shootingBubble.y <= BUBBLE_RADIUS) {
    collision = true;
    newY = BUBBLE_RADIUS;
  }

  // Bubble collision - stick
  for (const bubble of bubbles) {
    const distance = Math.sqrt(
      Math.pow(shootingBubble.x - bubble.x, 2) +
        Math.pow(shootingBubble.y - bubble.y, 2)
    );

    if (distance <= BUBBLE_RADIUS * 2) {
      collision = true;
      collisionBubble = bubble;
      
      // Calculate position next to the collided bubble
      const angle = Math.atan2(
        shootingBubble.y - bubble.y,
        shootingBubble.x - bubble.x
      );
      newX = bubble.x + Math.cos(angle) * (BUBBLE_RADIUS * 2);
      newY = bubble.y + Math.sin(angle) * (BUBBLE_RADIUS * 2);
      break;
    }
  }

  return { collision, collisionBubble, newX, newY, shouldBounce };
};

export const handleBubblePlacement = (
  shootingBubble: ShootingBubble,
  bubbles: Bubble[],
  newX: number,
  newY: number
): {
  updatedBubbles: Bubble[];
  connectedBubbles: Bubble[];
  shouldAddNewRow: boolean;
} => {
  const { row, col } = calculateGridPosition(newX, newY);
  
  const newBubble: Bubble = {
    x: newX,
    y: newY,
    color: shootingBubble.color,
    row,
    col,
  };

  const updatedBubbles = [...bubbles, newBubble];
  const connectedBubbles = findConnectedBubbles(updatedBubbles, newBubble).filter(
    (bubble) => bubble.color === newBubble.color
  );

  let shouldAddNewRow = false;

  if (connectedBubbles.length >= 3) {
    // Remove connected bubbles and find floating ones
    const remainingBubbles = updatedBubbles.filter(
      (bubble) =>
        !connectedBubbles.some(
          (connected) =>
            connected.x === bubble.x && connected.y === bubble.y
        )
    );

    // Remove floating bubbles
    const floatingBubbles = findFloatingBubbles(remainingBubbles);
    const finalBubbles = remainingBubbles.filter(
      (bubble) =>
        !floatingBubbles.some(
          (floating) =>
            floating.x === bubble.x && floating.y === bubble.y
        )
    );

    return {
      updatedBubbles: finalBubbles,
      connectedBubbles,
      shouldAddNewRow: false,
    };
  } else {
    shouldAddNewRow = true;
    return {
      updatedBubbles,
      connectedBubbles: [],
      shouldAddNewRow,
    };
  }
};
