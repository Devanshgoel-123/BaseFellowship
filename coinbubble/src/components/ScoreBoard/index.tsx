"use client";

interface ScoreBoardProps {
  score: number;
}

export default function ScoreBoard({ score }: ScoreBoardProps) {
  return (
    <div className="flex flex-col items-center mb-4 md:flex-row md:justify-between md:items-center">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2 md:text-3xl md:mb-0">
        Base Bubble Shooter
      </h1>
      <div className="text-lg font-semibold md:text-xl">
        Score: <span className="text-blue-400">{score}</span>
      </div>
    </div>
  );
}
