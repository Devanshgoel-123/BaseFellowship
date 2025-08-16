'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BackgroundBubbles } from '@/components/BottomBubbles';
import { useAccount, useConnect } from 'wagmi'
import { NAME_IMAGE } from '@/lib/constants';


export default function HomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect();

  console.log(isConnected,address)
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

  // useEffect(() => {
  //   const initializeSdk = async () => {
  //     console.log("sdk ready")
  //     await sdk.actions.ready()
  //   };
  //   initializeSdk();
  // }, [])

  const handleStart = () => {
    router.push('/ModeSelection');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Hamburger Menu */}
      <div className="absolute top-6 right-6 z-[100]" ref={menuRef}>
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
              href="/leaderboard" 
              className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              🏆 Leaderboard
            </Link>
          </div>
        )}
      </div>

      {/* Main container with exact dimensions */}
      <div className="absolute w-[100vw] h-[100vh] flex flex-col items-center justify-center">
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
          
          {/* Bottom large bubble */}
          <div className="absolute w-[100vw] h-[95vh]  bg-gradient-to-b from-[#226ED8] to-[rgba(35,136,242,0)]  blur-[1px]">
           <BackgroundBubbles/>
          </div>
        </div>

        <div className="absolute w-[378px] h-[202.73px] left-1/2 -translate-x-1/2 top-[324px]">
          <img 
            src={NAME_IMAGE}
            alt="Bubble Shooter" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <button 
          onClick={()=>{
            console.log(connectors)
            if(isConnected){
              handleStart()
            }else{
              connect({ connector: connectors[2] })
            }
          }}
          className="absolute width-[100%] bottom-[100px] px-12 py-4 bg-white text-[#0B3E84] text-md font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors "
        >
          {
            isConnected ? "Start Game" : "Connect Wallet"
}
        </button>
      </div>
    </div>
  );
}
