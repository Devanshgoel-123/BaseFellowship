"use client";
import { useNeynarUser } from "~/hooks/useNeynarUser";
import { useEffect, useRef, useState } from "react";
import { BottomNavbar } from "~/components/BottomNavbar";
import "./styles.scss";
import Image from "next/image";
import { getUserProfile } from "~/Services/user";
import { useAccount } from "wagmi";
import { GLOBE, POINTS } from "~/lib/constants";
import { getUserCollectibles } from "~/Services/user";

interface User {
  id: number;
  username: string;
  walletAddress: string;
  points: number | null;
  createdAt: Date | null;
  userPfp: string;
}

export default function ProfilePage() {
  const { user } = useNeynarUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const { address } = useAccount();
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserProfile({
        walletAddress: address as string,
      });
      console.log(userData.user);
      setUserData(userData.user);
    };
    const fetchWalletDetails = async () => {
      const walletDetails = await getUserCollectibles({
        walletAddress: address as string,
      });
      console.log(walletDetails);
    };
    fetchUserData();
    fetchWalletDetails();
  }, [user]);

  // const handleSignOut = async () => {
  //   try {
  //     router.push('/');
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   }
  // };

  return (
    <div className="profileWrapper">
      {userData !== null && (
        <div className="profileContainer">
          <Image
            src={userData?.userPfp || ""}
            alt="profile"
            width={100}
            height={100}
            className="profileLogo"
          />
          <div className="usernameWrapper">
            <span>{userData?.username.slice(0, 15)}</span>
          </div>
          <div className="statsWrapper">
            <div className="statsItem">
              <Image src={POINTS} alt="globe" width={20} height={20} />
              <span>Points</span>
              <span>{userData?.points}</span>
            </div>
            <div className="statsItem">
              <Image src={GLOBE} alt="globe" width={20} height={20} />
              <span>Wallet Address</span>
              <span>
                {userData.walletAddress.slice(0, 6)}...
                {userData.walletAddress.slice(-4)}
              </span>
            </div>
          </div>
          <div className="w-[95%] mt-0 bg-gradient-to-b from-[#b3d7fe] via-[#6daafb] to-[#3853b9] rounded-2xl shadow px-0 pb-0 pt-0 border border-[#2955a5]">
            <div className="flex gap-3 px-2 py-4 w-[100%]">
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
            <div className="flex items-center justify-center bg-transparent my-[48%]">
              <h1 className="text-4xl font-semibold text-gray-700">
                Coming Soon
              </h1>
            </div>
          </div>
        </div>
      )}
      <BottomNavbar />
    </div>
  );
}
