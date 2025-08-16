'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { sdk } from '@farcaster/miniapp-sdk';

export default function HomePageClient() {
  useEffect(() => {
    // Initialize Farcaster SDK and hide splash screen when component mounts
    const initializeSdk = async () => {
      try {
        await sdk.actions.ready();
        console.log('Farcaster SDK ready');
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
      }
    };

    initializeSdk();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Main background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#35A5F7] to-[#152E92]">
        {/* Bubble elements */}
        <div className="absolute w-[406px] h-[406px] -left-56 -top-40 bg-gradient-to-b from-[#226ED8] to-transparent opacity-70 blur-[2.9px] rounded-full"></div>
        <div className="absolute w-[100px] h-[100px] right-8 top-[119px] bg-gradient-to-b from-[#2C9BF44] to-[#309EF51A] backdrop-blur-[13.1px] rounded-full"></div>
        <div className="absolute w-[100px] h-[100px] -left-5 top-[580px] bg-gradient-to-b from-[#2C9BF44] to-[#309EF51A] backdrop-blur-[13.1px] rounded-full"></div>
        
        {/* Main bubble cluster */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large bubble elements */}
          <div className="absolute w-[123px] h-[123px] left-12 top-[281px] bg-gradient-to-b from-[#35ACFED1] to-[#34B1FCD1] blur-[3.65px] rounded-full"></div>
          <div className="absolute w-[123px] h-[123px] left-5 top-[351px] bg-gradient-to-b from-[#35ACFED1] to-[#34B1FCD1] blur-[3.65px] rounded-full"></div>
          <div className="absolute w-[123px] h-[123px] left-[97px] top-[412px] bg-gradient-to-b from-[#35ACFED1] to-[#34B1FCD1] blur-[3.65px] rounded-full"></div>
          <div className="absolute w-[123px] h-[123px] left-[171px] top-[331px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] blur-[3.65px] rounded-full"></div>
          <div className="absolute w-[123px] h-[123px] left-[90px] top-[374px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] blur-[3.65px] rounded-full"></div>
          <div className="absolute w-[123px] h-[123px] left-[171px] top-[425px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] blur-[3.65px] rounded-full"></div>
          <div className="absolute w-[123px] h-[123px] left-[261px] top-[404px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] blur-[3.65px] rounded-full"></div>
          <div className="absolute w-[123px] h-[123px] left-[259px] top-[313px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] blur-[3.65px] rounded-full"></div>
          <div className="absolute w-[123px] h-[123px] left-[17px] top-[404px] bg-gradient-to-b from-[#35ACFED1] to-[#34B1FCD1] blur-[3.65px] rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full p-6">
        {/* Logo/Title - You can replace this with your actual logo */}
        <div className="mt-20 text-center">
          <h1 className="text-5xl font-bold text-white">Bubble Shooter</h1>
          <p className="mt-4 text-xl text-white/80">Pop them all!</p>
        </div>

        {/* Start button */}
        <div className="w-full max-w-[300px] mb-16">
          <Link 
            href="/game"
            className="block w-full py-4 text-center text-xl font-bold text-[#0B3E84] bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            onClick={async (e) => {
              e.preventDefault();
              try {
                // Ensure SDK is ready before navigation
                await sdk.actions.ready();
                window.location.href = '/game';
              } catch (error) {
                console.error('Navigation error:', error);
                window.location.href = '/game'; // Fallback navigation
              }
            }}
          >
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}
