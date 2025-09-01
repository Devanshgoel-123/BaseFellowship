
import { ShootingBubble, Bubble } from './bubbleType';
import { ROWS, COLORS, COLS, BUBBLE_RADIUS, BALL_BLACK } from './constants';
import { getRandomCreators } from '~/Services/creator';

export function generateBubbleConfigs(
    rows: number = 6, // number of rows
    minBubbles: number = 5, // min bubbles in a row
    maxBubbles: number = 10, // max bubbles in a row
    bubbleSize: number = 70, // base bubble size
    ySpacing: number = 10 // space between rows
  ): Array<{ x: number; y: number; width: number; height: number; rotation: number }> {
    
    const configs: Array<{ x: number; y: number; width: number; height: number; rotation: number }> = [];
  
    for (let row = 0; row < rows; row++) {
      const bubbleCount = Math.floor(Math.random() * (maxBubbles - minBubbles + 1)) + minBubbles;
  
      // Calculate row width and offset to center
      const totalRowWidth = bubbleCount * bubbleSize;
      const xOffset = (500 - totalRowWidth) / 2; // Assuming canvas width 500px
  
      for (let col = 0; col < bubbleCount; col++) {
        const randomSize = bubbleSize + Math.floor(Math.random() * 15 - 7); // Slight size variation
        const x = xOffset + col * bubbleSize + Math.random() * 5; // small jitter
        const y = row * (bubbleSize + ySpacing) + Math.random() * 3;
        const rotation = Math.floor(Math.random() * 30 - 15); // -15° to +15°
  
        configs.push({
          x,
          y,
          width: randomSize,
          height: randomSize,
          rotation
        });
      }
    }
  
    return configs;
  }
  
export function addBubbleRow(
    existingConfigs: Array<{ x: number; y: number; width: number; height: number; rotation: number }>,
    minBubbles: number = 8,
    maxBubbles: number = 10,
    bubbleSize: number = 50
  ): Array<{ x: number; y: number; width: number; height: number; rotation: number }> {
  
    const canvasWidth = 500;
  
    existingConfigs.forEach(bubble => {
      bubble.y += (bubbleSize - 5); // Maintain hexagonal packing
    });
  
    const bubbleCount = Math.floor(Math.random() * (maxBubbles - minBubbles + 1)) + minBubbles;
    const rowOffset = (existingConfigs.length > 0 && existingConfigs[0].y % (bubbleSize - 5) !== 0) ? 0 : bubbleSize / 2;
    const totalRowWidth = bubbleCount * bubbleSize;
    const xOffset = (canvasWidth - totalRowWidth) / 2;
  
    // Add new row at top
    for (let col = 0; col < bubbleCount; col++) {
      const x = xOffset + rowOffset + col * bubbleSize;
      const y = 0;
  
      existingConfigs.push({
        x,
        y,
        width: bubbleSize,
        height: bubbleSize,
        rotation: 0
      });
    }
  
    return existingConfigs;
}
  
  
/**
 * Generate a random color from the available colors
 */
export const getRandomColor = (): string => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

/**
 * Generate a random bubble with given position
 */
export const generateRandomBubble = (
  x: number,
  y: number,
  row: number,
  col: number
): Bubble => {
  return {
    x,
    y,
    color: getRandomColor(),
    row,
    col,
  };
};

/**
 * Initialize bubbles for the game with proper hexagonal grid layout
 */
export async function initializeBubbles(): Promise<Bubble[]> {
  const newBubbles: Bubble[] = [];
  const adjustedRows = ROWS;
  const adjustedCols = COLS;

  console.log("Initializing bubbles with ROWS:", adjustedRows, "COLS:", adjustedCols);
  console.log("BUBBLE_RADIUS:", BUBBLE_RADIUS);

  for (let row = 0; row < adjustedRows; row++) {
    const colsInRow = row % 2 === 0 ? adjustedCols : adjustedCols - 1;
    for (let col = 0; col < colsInRow; col++) {
      const x =
        col * (BUBBLE_RADIUS * 2) +
        (row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2);
      const y = row * (BUBBLE_RADIUS * 1.7) + BUBBLE_RADIUS;
      
      if (row === adjustedRows - 1) { // Log bottom row positions
        console.log(`Bottom row ${row}, col ${col}: x=${x}, y=${y}`);
      }
      
      newBubbles.push(generateRandomBubble(x, y, row, col));
    }
  }
  const maxCreators = Math.min(15, newBubbles.length);
  const selectedIndices = new Set<number>();
  while (selectedIndices.size < maxCreators) {
    const randomIndex = Math.floor(Math.random() * newBubbles.length);
    selectedIndices.add(randomIndex);
  }
  const randomCreators = await getRandomCreators();
  console.log("randomCreators", randomCreators);
  selectedIndices.forEach((index) => {
    const bubble = newBubbles[index];
    bubble.color = BALL_BLACK;
    bubble.creator = randomCreators[Math.floor(Math.random() * randomCreators.length)];
  });
  console.log("newBubbles", newBubbles);
  return newBubbles;
}

/**
 * Find all connected bubbles of the same color
 */
export const findConnectedBubbles = (
  bubbles: Bubble[],
  startBubble: Bubble
): Bubble[] => {
  const visited = new Set<string>();
  const connected: Bubble[] = [];
  const queue = [startBubble];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.row}-${current.col}`;

    if (visited.has(key)) continue;
    visited.add(key);
    connected.push(current);

    const neighbors = bubbles.filter((bubble) => {
      if (bubble.color !== startBubble.color) return false;
      const distance = Math.sqrt(
        Math.pow(bubble.x - current.x, 2) + Math.pow(bubble.y - current.y, 2)
      );
      return distance <= BUBBLE_RADIUS * 2.2 && distance > 0;
    });

    neighbors.forEach((neighbor) => {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(neighborKey)) {
        queue.push(neighbor);
      }
    });
  }

  return connected;
};

/**
 * Find all bubbles that are floating (not connected to the top)
 */
export const findFloatingBubbles = (bubbles: Bubble[]): Bubble[] => {
  const connectedToTop = new Set<string>();
  const visited = new Set<string>();

  // Find all bubbles connected to the top row
  const topRowBubbles = bubbles.filter((bubble) => bubble.row === 0);
  
  const findConnectedToTop = (bubble: Bubble) => {
    const key = `${bubble.row}-${bubble.col}`;
    if (visited.has(key)) return;
    visited.add(key);
    connectedToTop.add(key);

    // Find all neighbors
    const neighbors = bubbles.filter((neighbor) => {
      const distance = Math.sqrt(
        Math.pow(neighbor.x - bubble.x, 2) + Math.pow(neighbor.y - bubble.y, 2)
      );
      return distance <= BUBBLE_RADIUS * 2.2 && distance > 0;
    });

    neighbors.forEach(findConnectedToTop);
  };

  topRowBubbles.forEach(findConnectedToTop);

  // Return bubbles not connected to top
  return bubbles.filter(
    (bubble) => !connectedToTop.has(`${bubble.row}-${bubble.col}`)
  );
};

/**
 * Add a new row at the top of the game with connected but random patterns
 */
export const addNewRowAtTop = (
  bubbles: Bubble[],
  canvasWidth: number
): Bubble[] => {
  const newRow: Bubble[] = [];
  const maxBubblesPerRow = Math.floor(canvasWidth / (BUBBLE_RADIUS * 1.5));
  
  // Determine random start and end positions for the connected group
  const minBubbles = Math.max(3, Math.floor(maxBubblesPerRow * 0.8)); // At least 80% of max
  const maxBubbles = Math.min(maxBubblesPerRow, Math.floor(maxBubblesPerRow * 0.9)); // At most 90% of max
  const groupSize = Math.floor(Math.random() * (maxBubbles - minBubbles + 1)) + minBubbles;
  
  // Random start position
  const startPosition = Math.floor(Math.random() * (maxBubblesPerRow - groupSize + 1));
  
  // Create connected group of bubbles
  for (let i = 0; i < groupSize; i++) {
    const x = BUBBLE_RADIUS + (startPosition + i) * (BUBBLE_RADIUS * 2);
    newRow.push(
      generateRandomBubble(
        x,
        BUBBLE_RADIUS,
        0,
        startPosition + i
      )
    );
  }

  const movedBubbles = bubbles.map((bubble) => ({
    ...bubble,
    y: bubble.y + BUBBLE_RADIUS * 1.7,
    row: bubble.row + 1,
  }));

  return [...newRow, ...movedBubbles];
};

/**
 * Calculate the grid position for a bubble based on its coordinates
 */
export const calculateGridPosition = (x: number, y: number) => {
  const row = Math.floor(y / (BUBBLE_RADIUS * 1.7));
  const col = Math.floor(x / (BUBBLE_RADIUS * 2));
  return { row, col };
};

/**
 * Check if a bubble is at the death line
 */
export const checkDeathLine = (bubbles: Bubble[], canvasHeight: number): boolean => {
  const deathLineY = canvasHeight - 60; // Match the renderDeathLine position
  
  // Check if any bubble's bottom edge touches or crosses the death line
  return bubbles.some((bubble) => (bubble.y + BUBBLE_RADIUS) >= deathLineY);
};

/**
 * Calculate the angle for aiming based on mouse/touch position
 */
export const calculateAimAngle = (
  clientX: number,
  clientY: number,
  canvasRect: DOMRect,
  shooterX: number,
  shooterY: number
): number => {
  const x = clientX - canvasRect.left;
  const y = clientY - canvasRect.top;
  const angle = Math.atan2(y - shooterY, x - shooterX);
  
  // Constrain angle to valid shooting range
  if (angle > -Math.PI * 0.9 && angle < -Math.PI * 0.1) {
    return angle;
  }
  return -Math.PI / 2; // Default straight up
};

/**
 * Create a shooting bubble with given parameters
 */
export const createShootingBubble = (
  shooterX: number,
  shooterY: number,
  angle: number,
  color: string,
  speed: number = 10
): ShootingBubble => {
  return {
    x: shooterX,
    y: shooterY,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    color,
  };
};


interface CanvasRendererProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

let bgImage: HTMLImageElement | null = null;
let bgLoaded = false;

// Load the image once
const loadBackgroundImage = () => {
  return new Promise<void>((resolve) => {
    bgImage = new Image();
    bgImage.src = '/assets/backgrounds/underwaterbg.svg';
    bgImage.onload = () => {
      bgLoaded = true;
      resolve();
    };
  });
};
export const renderBackground = async ({ ctx, width, height }: CanvasRendererProps) => {
  if (!bgLoaded) {
    await loadBackgroundImage();
  }

  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, width, height);
  }
};


export const renderDeathLine = ({ ctx, width, height }: CanvasRendererProps) => {
  const deathLineY = height - 60;
  
  // Death line
  ctx.strokeStyle = "#EF4444"; // BALL_RED
  ctx.lineWidth = 3;
  ctx.setLineDash([15, 10]);
  ctx.beginPath();
  ctx.moveTo(0, deathLineY);
  ctx.lineTo(width, deathLineY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Death line label
  ctx.fillStyle = "#EF4444"; // BALL_RED
  ctx.font = "bold 12px Poppins";
  ctx.textAlign = "center";
  ctx.fillText("DANGER LINE", width / 2, deathLineY - 5);
};

/**
 * Check if a bubble is at the death line
 */


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
  creatorHit: boolean;
  creatorBubble: Bubble | null;
} => {
  let collision = false;
  let collisionBubble: Bubble | null = null;
  let newX = shootingBubble.x;
  let newY = shootingBubble.y;
  let shouldBounce = false;
  let creatorHit = false;
  let creatorBubble: Bubble | null = null;
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
      if (bubble.color === BALL_BLACK) {
        console.log("🎯 You hit the creator bubble!", bubble);
        creatorHit = true;
        creatorBubble = bubble;
      }
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

  return { collision, collisionBubble, newX, newY, shouldBounce, creatorHit, creatorBubble };
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


export interface ColorStats {
  color: string;
  count: number;
  points: number;
}

export interface PlayerStats {
  totalPoints: number;
  totalBubblesPopped: number;
  colorStats: ColorStats[];
  lastHitColor: string | null;
  lastHitTime: number;
  creatorBubblesPopped: CreatorBubblePoppedStats[];
}

export interface CreatorBubblePoppedStats {
  creatorPfp: string;
  points: number;
}
export class ScoringSystem {
  private stats: PlayerStats;

  constructor() {
    this.stats = {
      totalPoints: 0,
      totalBubblesPopped: 0,
      creatorBubblesPopped : [],
      colorStats: COLORS.map(color => ({
        color,
        count: 0,
        points: 0
      })),
      lastHitColor: null,
      lastHitTime: 0
    };
  }

  /**
   * Add points for popped bubbles
   */
  addPoints(bubbles: Bubble[]): number {
    let points=0;
    console.log(bubbles);
    bubbles.map(bubble => {
      console.log("The bubble is",bubble)
      points += bubble.color === BALL_BLACK ? 100 : 10;
      this.stats.totalPoints += bubble.color === BALL_BLACK ? 100 : 10;
      this.stats.totalBubblesPopped += 1;
      if(bubble.color === BALL_BLACK && bubble.creator){
        this.stats.creatorBubblesPopped.push({
          creatorPfp: bubble.creator?.coinAddress,
          points: 100
        })
      const colorStat = this.stats.colorStats.find(stat => stat.color === bubble.color);
      if (colorStat) {
          colorStat.count += 1;
          colorStat.points += 10;
      }
    }
    })
    if (bubbles.length > 0) {
      this.stats.lastHitColor = bubbles[0].color;
      this.stats.lastHitTime = Date.now();
    }
    return points;
  }

  /**
   * Get current player statistics
   */
  getStats(): PlayerStats {
    return { ...this.stats };
  }

  /**
   * Get color statistics sorted by count
   */
  getColorStats(): ColorStats[] {
    return [...this.stats.colorStats].sort((a, b) => b.count - a.count);
  }

  getCreatorBubblesPopped(): CreatorBubblePoppedStats[] {
    return this.stats.creatorBubblesPopped;
  }
  /**
   * Get the most popular color
   */
  getMostPopularColor(): string | null {
    const sorted = this.getColorStats();
    return sorted.length > 0 ? sorted[0].color : null;
  }

  /**
   * Reset all statistics
   */
  reset(): void {
    this.stats = {
      totalPoints: 0,
      totalBubblesPopped: 0,
      colorStats: COLORS.map(color => ({
        color,
        count: 0,
        points: 0
      })),
      creatorBubblesPopped: [],
      lastHitColor: null,
      lastHitTime: 0
    };
  }

  /**
   * Get formatted statistics for display
   */
  getFormattedStats() {
    return {
      totalPoints: this.stats.totalPoints.toLocaleString(),
      totalBubbles: this.stats.totalBubblesPopped.toLocaleString(),
      creatorBubblesPopped: this.getCreatorBubblesPopped(),
      topColor: this.getMostPopularColor(),
      lastHitColor: this.stats.lastHitColor,
      timeSinceLastHit: this.stats.lastHitTime ? Date.now() - this.stats.lastHitTime : null
    };
  }
}


export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};