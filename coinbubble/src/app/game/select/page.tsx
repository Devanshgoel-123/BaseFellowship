'use client';

import { useRouter } from 'next/navigation';

export default function SelectPage() {
  const router = useRouter();

  const handleSelect = (creator: string) => {
    localStorage.setItem('chosenCreator', creator);
    router.push('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl">Select a Creator</h1>
      {/* Add creator selection UI here */}
    </div>
  );
}
