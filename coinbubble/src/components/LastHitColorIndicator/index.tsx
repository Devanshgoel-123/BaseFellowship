import { useEffect, useState } from "react";

interface LastHitColorIndicatorProps {
  lastHitColor: string | null;
  isVisible: boolean;
}

export default function LastHitColorIndicator({ 
  lastHitColor, 
  isVisible 
}: LastHitColorIndicatorProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isVisible && lastHitColor) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 2) % 360);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isVisible, lastHitColor]);

  if (!isVisible || !lastHitColor) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
        style={{
          backgroundColor: lastHitColor,
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.05s linear',
        }}
      >
        <div className="w-8 h-8 rounded-full bg-white opacity-20"></div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-xs text-white font-bold">LAST HIT</div>
        <div className="text-xs text-gray-300">Color</div>
      </div>
    </div>
  );
}
