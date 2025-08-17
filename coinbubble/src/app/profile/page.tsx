'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNeynarUser } from '~/hooks/useNeynarUser';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { BottomNavbar } from '~/components/BottomNavbar';
import "./styles.scss";
import Image from 'next/image';
import { getUserProfile } from '~/Services/user';
import { useAccount } from 'wagmi';
import { GLOBE, POINTS } from '~/lib/constants';
import { getUserCollectibles } from '~/Services/user';


interface User{
  id: number;
  username: string;
  walletAddress: string;
  points: number | null;
  createdAt: Date | null;
  userPfp: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user}= useNeynarUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const {address} = useAccount();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"balances" | "collectibles">(
    "balances"
  );
  const [userData, setUserData] = useState<User | null>(null);
  
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

  useEffect(()=>{
    const fetchUserData = async () => {
      const userData = await getUserProfile({
        walletAddress:address as string
      })
      console.log(userData.user)
      setUserData(userData.user);
    }
    const fetchWalletDetails = async () => {
      const walletDetails = await getUserCollectibles({
        walletAddress:address as string
      })
      console.log(walletDetails)
    }
    fetchUserData();
    fetchWalletDetails();
  },[user])

  const handleSignOut = async () => {
    try {
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className='profileWrapper'>
      {userData !== null && <div className='profileContainer'>
        <Image src={userData?.userPfp || ""} alt="profile" width={100} height={100} className='profileLogo'/>
        <div className='usernameWrapper'>
      <span>{userData?.username}</span>
        </div>
        <div className='statsWrapper'>
          <div className='statsItem'>
            <Image src={POINTS} alt="globe" width={20} height={20}/>
            <span>Points</span>
            <span>{userData?.points}</span>
          </div>
          <div className='statsItem'>
            <Image src={GLOBE} alt="globe" width={20} height={20}/>
            <span>Wallet Address</span>
            <span>{userData.walletAddress.slice(0, 6)}...{userData.walletAddress.slice(-4)}</span>
          </div>
        </div>
        <div className="w-full mt-0 bg-gradient-to-b from-[#b3d7fe] via-[#6daafb] to-[#3853b9] rounded-2xl shadow px-0 pb-0 pt-0 border border-[#2955a5]">
              <div className="flex gap-3 px-2 pt-4 w-full">
                <button
                  className={`
      flex-1 font-bold px-5 py-2 transition text-base border-2
      ${
        activeTab === "balances"
          ? "bg-[#132d57] text-white border-[#132d57] shadow"
          : "bg-transparent text-[#132d57] border-[#132d57]"
      }
      rounded-full
    `}
                  onClick={() => setActiveTab("balances")}
                >
                  Balances
                </button>
                <button
                  className={`
      flex-1 font-bold px-5 py-2 transition text-base border-2
      ${
        activeTab === "collectibles"
          ? "bg-[#132d57] text-white border-[#132d57] shadow"
          : "bg-transparent text-[#132d57] border-[#132d57]"
      }
      rounded-full
    `}
                  onClick={() => setActiveTab("collectibles")}
                >
                  Collectibles
                </button>
              </div>

              {/* <div className="px-4 py-5">
                {activeTab === "balances" ? (
                  <>
                    <div className="mb-4">
                      <h3 className="text-white text-lg font-bold">
                        Holding {balances.length} coins
                      </h3>
                      <p className="text-sm text-white/90 font-normal">
                        Low-volume coins may sell for less
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {balances.map((balance) => (
                        <div
                          key={`${balance.contractAddress}-${balance.tokenId}`}
                          className="flex items-center justify-between bg-gradient-to-r from-[#223b78] to-[#3c62db] rounded-2xl px-4 py-3"
                        >
                          <Avatar className="w-10 h-10 bg-[#e6ecfd] border border-[#82b3ff] text-xl font-bold">
                            <AvatarFallback>
                              {balance.metadata.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <div className="font-semibold text-white text-base">
                              {balance.metadata.name}
                            </div>
                            <div className="text-xs text-blue-100">
                              {parseInt(balance.balance).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex flex-col items-end ml-auto">
                            <div className="font-bold text-[#5eefff] text-base">
                              ${balance.usdValue.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-white py-10 text-center">
                    No collectibles yet.
                  </div>
                )}
              </div> */}
            </div>
      </div>}
      <BottomNavbar/>
    </div>
  );
}
