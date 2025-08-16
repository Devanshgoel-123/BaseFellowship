import React from 'react';

export default function GameContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400">
      <div className="rounded-3xl shadow-2xl p-2 bg-gradient-to-br from-blue-500 via-blue-400 to-slate-200 w-[390px] h-[844px] relative border-4 border-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}
