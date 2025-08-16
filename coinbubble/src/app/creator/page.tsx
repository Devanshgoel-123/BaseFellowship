'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNeynarUser } from '@/hooks/useNeynarUser';

export default function CreatorPage() {
  const router = useRouter();
  const { user } = useNeynarUser();
  const [tokenAddress, setTokenAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!tokenAddress) {
      setError('Please enter a valid token address');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorAddress: user?.fid.toString(),
          tokenAddress: tokenAddress.trim()
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Redirect to Zora with the token address
      window.location.href = data.redirectUrl;
      
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process your request');
    } finally {
      setIsLoading(false);
    }
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
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
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
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
            <div className="w-full max-w-xs">
              <h1 className="text-4xl font-bold text-white mb-12 text-center">Creator Portal</h1>
              
              <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
                <p className="text-blue-100 text-center mb-6">Connect your Zora collection to start earning</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="tokenAddress" className="block text-sm font-medium text-blue-100 mb-2">
                      Your Zora Collection Address
                    </label>
                    <input
                      type="text"
                      id="tokenAddress"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      disabled={isLoading}
                    />
                    {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-colors ${
                      isLoading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    }`}
                  >
                    {isLoading ? 'Processing...' : 'Connect with Zora'}
                  </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-medium text-blue-100 mb-3">How it works:</h3>
                  <ol className="space-y-3 text-sm text-blue-100">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2 flex-shrink-0">1</span>
                      <span>Connect your Zora collection address above</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2 flex-shrink-0">2</span>
                      <span>You'll be redirected to Zora to complete the connection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold mr-2 flex-shrink-0">3</span>
                      <span>Start earning rewards when players use your collection in-game</span>
                    </li>
                  </ol>
                </div>
              </div>
              
              <button
                onClick={() => router.back()}
                className="mt-8 text-blue-200 hover:text-white transition-colors flex items-center text-sm mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Mode Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
