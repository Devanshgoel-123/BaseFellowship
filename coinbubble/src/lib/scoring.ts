import { Bubble } from "./bubbleType";
import { COLORS } from "./constants";

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
}

export class ScoringSystem {
  private stats: PlayerStats;

  constructor() {
    this.stats = {
      totalPoints: 0,
      totalBubblesPopped: 0,
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
    const points = bubbles.length * 10;
    this.stats.totalPoints += points;
    this.stats.totalBubblesPopped += bubbles.length;
    
    // Update color statistics
    bubbles.forEach(bubble => {
      const colorStat = this.stats.colorStats.find(stat => stat.color === bubble.color);
      if (colorStat) {
        colorStat.count += 1;
        colorStat.points += 10;
      }
    });

    // Update last hit color
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
      topColor: this.getMostPopularColor(),
      lastHitColor: this.stats.lastHitColor,
      timeSinceLastHit: this.stats.lastHitTime ? Date.now() - this.stats.lastHitTime : null
    };
  }
}
