'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import { publishCast } from '@/lib/neynar';
import Link from 'next/link';

export default function ScorePage() {
  const sp = useSearchParams();
  const router = useRouter();
  const { user } = useNeynarUser();
  const score = useMemo(() => Number(sp.get('s') || 0), [sp]);
  const lives = useMemo(() => Number(sp.get('l') || 0), [sp]);
  const pops = useMemo(() => Number(sp.get('p') || 0), [sp]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid: user.fid,
          username: user.username,
          score,
          pops,
          livesUsed: Math.max(0, 5 - lives)
        })
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!user) return;
    
    try {
      const text = `I just scored ${score} points in Bubble Shooter! Can you beat my score?`;
      const response = await fetch('/api/publish-cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signerUuid: user.signerUuid,
          text,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish cast');
      }

      alert('Shared to Farcaster!');
    } catch (error) {
      console.error('Failed to share:', error);
      alert('Failed to share to Farcaster');
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-transparent">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/assets/backgrounds/every.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Background Bubbles */}
      <div className="fixed inset-0 overflow-hidden -z-20">
        {/* Large Bubbles */}
        <div className="absolute w-[95px] h-[95px] left-[228px] top-[-1px] transform rotate-[21.3deg]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[95px] h-[95px] left-[284px] top-[187px] transform rotate-[21.3deg]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[95px] h-[95px] left-[222px] top-[137px] transform rotate-[21.3deg]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[95px] h-[95px] left-[62px] top-[145px] transform rotate-[21.3deg]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>

        {/* Medium Bubbles */}
        <div className="absolute w-[81px] h-[81px] left-[179px] top-[15px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[81px] h-[81px] left-[52px] top-[90px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[81px] h-[81px] left-[299px] top-[90px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[81px] h-[81px] left-[140px] top-[232px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>

        {/* Small Bubbles */}
        <div className="absolute w-[79px] h-[80.81px] left-[15px] top-[13px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[79px] h-[80.81px] left-[176px] top-[159px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[79px] h-[80.81px] left-[132px] top-[89px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[79px] h-[78.4px] left-[97px] top-[20px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[79px] h-[78.4px] left-[214px] top-[89px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[79px] h-[78.4px] left-[220px] top-[226px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[79px] h-[78.4px] left-[57px] top-[235px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
        <div className="absolute w-[79px] h-[78.4px] left-[15px] top-[165px]">
          <div className="w-full h-full rounded-full bg-white/10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Score Display */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Score</h1>
          <div className="text-8xl font-extrabold text-white">{score}</div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
          <div className="flex justify-between text-white/90 text-lg mb-4">
            <span>Bubbles Popped:</span>
            <span className="font-semibold">{pops}</span>
          </div>
          <div className="flex justify-between text-white/90 text-lg">
            <span>Lives Remaining:</span>
            <span className="font-semibold">{lives}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-4">
          {user && (
            <button
              onClick={save}
              disabled={saving || saved}
              className="w-full py-4 rounded-full bg-white/90 text-[#0B3E84] font-semibold text-lg disabled:opacity-50 hover:bg-white transition-colors"
            >
              {saving ? 'Saving...' : saved ? 'Score Saved!' : 'Save Score'}
            </button>
          )}
          
          <button
            onClick={handleShare}
            className="w-full py-4 rounded-full border-2 border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
            disabled={!user}
          >
            {user ? 'Share on Farcaster' : 'Sign in to Share'}
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 text-white/80 hover:text-white text-lg font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="max-w-md mx-auto px-4 py-2 flex justify-around items-center">
          <Link 
            href="/" 
            className="flex flex-col items-center px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            href="/leaderboard" 
            className="flex flex-col items-center px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs mt-1">Leaderboard</span>
          </Link>
          
          <Link 
            href="/profile" 
            className="flex flex-col items-center px-4 py-2 text-white"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center -mt-4">
              {user?.pfp_url ? (
                <img 
                  src={user.pfp_url} 
                  alt={user.username || 'Profile'} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
