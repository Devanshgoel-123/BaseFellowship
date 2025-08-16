'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import { useEffect, useRef, useState } from 'react';
import "./styles.scss";
import Image from 'next/image';
import { MEDALS } from '@/lib/constants';
import { GoArrowLeft } from "react-icons/go";
// Hardcoded leaderboard data
const leaderboardData = [
  { id: 1, username: 'vitalik.eth', score: 1280, pfp: '/assets/bubbles/bubble1.png' },
  { id: 2, username: 'farcaster', score: 980, pfp: '/assets/bubbles/bubble2.png' },
  { id: 3, username: 'dwr.eth', score: 845, pfp: '/assets/bubbles/bubble3.png' },
  { id: 4, username: 'danromero', score: 720, pfp: '/assets/bubbles/bubble4.png' },
  { id: 5, username: 'jessepollak', score: 680, pfp: '/assets/bubbles/bubble1.png' },
  { id: 6, username: 'greg', score: 540, pfp: '/assets/bubbles/bubble2.png' },
  { id: 7, username: 'varunsrin', score: 490, pfp: '/assets/bubbles/bubble3.png' },
  { id: 8, username: 'brianobush', score: 420, pfp: '/assets/bubbles/bubble2.png' },
  { id: 9, username: 'alex', score: 380, pfp: '/assets/bubbles/bubble4.png' },
  { id: 10, username: 'sarah', score: 350, pfp: '/assets/bubbles/bubble1.png' },
];

export default function Leaderboard() {
  const router = useRouter();
  const { user } = useNeynarUser();
  const [activeTab, setActiveTab] = useState('weekly');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userRank = 4; // Hardcoded user rank for demo

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

  return (
    <div className="LeaderBoardWrapper">
      {/* Hamburger Menu */}
      {/* <div className="absolute top-6 right-6 z-[100]" ref={menuRef}>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Menu"
          style={{
            backgroundColor: menuOpen ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
          }}
        >
          <div className="w-6 h-6 flex flex-col items-center justify-center">
            <div 
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'}`}
            ></div>
            <div 
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100 mb-1.5'}`}
            ></div>
            <div 
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
            ></div>
          </div>
        </button>
        
        {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-white/10 transform transition-all duration-200 origin-top-right">
          <Link
            href="/profile"
            className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            👤 Profile
          </Link>
          <Link
            href="/"
            className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            🏠 Home
          </Link>
        </div>
      )}
      {/* </div> */}
      {/* Leaderboard content */}
      <div className="LeaderBoardContainer">
        {/* Header */}
        <div className="LeaderHeader">
          <span onClick={() => router.back()}  className='backIcon'>
            <GoArrowLeft />
          </span>
          <span>
            Leaderboard
          </span>
        </div>
        <div className='LeaderBoardTab'>
          <div className={`LeaderBoardTabItem ${activeTab === 'weekly' ? 'active' : ''}`} onClick={() => { setActiveTab('weekly') }}>
            <span>Weekly</span>
          </div>
          <div className={`LeaderBoardTabItem ${activeTab === 'allTime' ? 'active' : ''}`} onClick={() => { setActiveTab('allTime') }}>
            <span>All Time</span>
          </div>
        </div>
        <div className="LeaderContainer">
          {leaderboardData.map((item, index) => (
            <div
              key={item.id}
              className="userData"
            >
              <div className="rank">
                {index + 1}
              </div>
              <div className="userProfile">
                <Image
                  src={item.pfp}
                  height={35}
                  width={35}
                  alt={item.username}
                  className='logo'
                />
              </div>
              <div className="userPoints">
                <span> {item.username.slice(0, 1).toUpperCase() + item.username.slice(1)} </span>
                <span>{item.score} points</span>
              </div>
              {MEDALS[index + 1 as keyof typeof MEDALS] && <div className="medal">
                <Image
                  src={MEDALS[index + 1 as keyof typeof MEDALS]}
                  height={20}
                  width={20}
                  alt="medal"
                  className="medalLogo"
                />
              </div>}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
