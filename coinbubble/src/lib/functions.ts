import { Bubble, ShootingBubble } from "./bubbleType";
import { COLORS, BUBBLE_RADIUS, ROWS, COLS } from "./constants";

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
export const initializeBubbles = (): Bubble[] => {
  const newBubbles: Bubble[] = [];
  const isMobile = window.innerWidth < 768;
  const adjustedRows = isMobile ? 6 : ROWS;
  const adjustedCols = isMobile ? 8 : COLS;

  for (let row = 0; row < adjustedRows; row++) {
    const colsInRow = row % 2 === 0 ? adjustedCols : adjustedCols - 1;
    for (let col = 0; col < colsInRow; col++) {
      const x =
        col * (BUBBLE_RADIUS * 2) +
        (row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2);
      const y = row * (BUBBLE_RADIUS * 1.7) + BUBBLE_RADIUS;
      newBubbles.push(generateRandomBubble(x, y, row, col));
    }
  }
  return newBubbles;
};

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

    // Find neighbors with same color only
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
  const maxBubblesPerRow = Math.floor(canvasWidth / (BUBBLE_RADIUS * 2.5));
  
  // Determine random start and end positions for the connected group
  const minBubbles = Math.max(3, Math.floor(maxBubblesPerRow * 0.4)); // At least 40% of max
  const maxBubbles = Math.min(maxBubblesPerRow, Math.floor(maxBubblesPerRow * 0.8)); // At most 80% of max
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
  const deathLineY = canvasHeight - 100;
  return bubbles.some((bubble) => bubble.y >= deathLineY);
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
