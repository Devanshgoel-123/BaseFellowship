'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import { useEffect, useRef, useState } from 'react';
import { BottomNavbar } from '@/components/BottomNavbar';
import "./styles.scss";
import Image from 'next/image';
import { getUserProfile } from '@/Services/user';
import { useAccount } from 'wagmi';
import { GLOBE, POINTS } from '@/lib/constants';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [userData, setUserData] = useState<User | null>(null);
  const {address} = useAccount();
  
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
        walletAddress:"0x36ca9f30d48acd5e1fa10ed995783edd8741eb3f"
      })
      console.log(userData.user)
      setUserData(userData.user);
    }
    fetchUserData();
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
        <div>
          
        </div>
      </div>}
      <BottomNavbar/>
    </div>
  );
}
