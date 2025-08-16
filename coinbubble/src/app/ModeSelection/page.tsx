'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import Image from 'next/image';
import './styles.scss';
import { BottomNavbar } from '@/components/BottomNavbar';
export default function ModeSelection() {
  const router = useRouter();
  const { user } = useNeynarUser();
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

  // Set default creator if not set
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('chosenCreator')) {
      localStorage.setItem('chosenCreator', 'default');
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main container with exact dimensions */}
      <div className="absolute w-[100vw] h-[100vh] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">
          {/* Large background bubbles */}
          <div className="absolute w-[406px] h-[406px] left-[-224px] top-[-159px] bg-gradient-to-b from-[#226ED8] to-[rgba(35,136,242,0)] opacity-70 rounded-full blur-[2.9px]"></div>
          
          {/* Top right bubble */}
          <div className="absolute w-[100px] h-[100px] left-[334px] top-[119px] bg-gradient-to-b from-[rgba(44,155,244,0.28)] to-[rgba(48,158,245,0.098)] backdrop-blur-[13.1px] rounded-full"></div>
          
          {/* Bottom left bubble */}
          <div className="absolute w-[100px] h-[100px] left-[-21px] top-[580px] bg-gradient-to-b from-[rgba(44,155,244,0.28)] to-[rgba(48,158,245,0.098)] backdrop-blur-[13.1px] rounded-full"></div>
          
          {/* Bubble cluster */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Row 1 */}
            <div className="absolute w-[123px] h-[123px] left-[48px] top-[281px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[171px] top-[331px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[259px] top-[313px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            
            {/* Row 2 */}
            <div className="absolute w-[123px] h-[123px] left-[5px] top-[351px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[90px] top-[374px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            
            {/* Row 3 */}
            <div className="absolute w-[123px] h-[123px] left-[97px] top-[412px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[171px] top-[425px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[261px] top-[404px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            
            {/* Bottom row */}
            <div className="absolute w-[123px] h-[123px] left-[17px] top-[404px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-start pt-[120px] px-8">
            <h1 className="ModeText">Choose Your Mode</h1>
            
            <div className="w-[90vw] space-y-6 mt-10 flex flex-col gap-10">
      
              <button 
                onClick={async () => {
                  // try{
                  //   const result = 
                  // }catch(error){

                  // }
                  router.push('/game')
                }}
                className="w-[100%] h-[180px] bg-[url('/assets/selectMode/modebg.svg')] bg-cover bg-centerrounded-2xl p-6  hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center relative rounded-3xl"
              >
                <div className="absolute top-[-30px] w-[70px] h-[70px] bg-[#b1cadc] rounded-full flex items-center justify-center mb-4">
                  <Image height={40} width={40} src={"/assets/selectMode/controller.svg"} alt="controller"/>
                </div>
                <h2 className="absolute top-[60px] font-bold text-white gradient-text">Player</h2>
                <p className="gradient-sub-text">Play the game and compete for high scores</p>
              </button>
              
              {/* Creator Button */}
              <button 
                onClick={() => router.push('/creator')}
                className="w-[100%] h-[180px] bg-[url('/assets/selectMode/modebg.svg')] bg-cover bg-centerrounded-2xl p-6  hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center relative
              mt-[100px] rounded-3xl">
                 <div className="absolute top-[-30px] w-[70px] h-[70px] bg-[#b1cadc] rounded-full flex items-center justify-center mb-4">
                <Image height={40} width={40} src={"/assets/selectMode/controller.svg"} alt="controller"/>
                </div>
                <h2 className="absolute top-[60px] text-2xl font-bold text-white gradient-text">Creator</h2>
                <p className="gradient-sub-text">Lock your tokens, climb the leaderboard.
                let players mint your coin.</p>
              </button>
            </div>
            
             <BottomNavbar/>
          </div>
        </div>
      </div>
    </div>
  );
}
