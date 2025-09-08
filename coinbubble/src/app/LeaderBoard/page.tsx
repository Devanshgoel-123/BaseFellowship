"use client";
import { useEffect, useRef, useState } from "react";
import "./styles.scss";
import Image from "next/image";
import { MEDALS } from "~/lib/constants";
import { getUserLeaderBoard } from "~/Services/user";
import { motion } from "framer-motion";
import { BottomNavbar } from "~/components/BottomNavbar";
export interface LeaderboardUser {
  id: number;
  username: string;
  walletAddress: string;
  userPfp: string;
  points: number;
  createdAt: string;
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("weekly");
  const menuRef = useRef<HTMLDivElement>(null);
  const [leaderboardUserData, setLeaderboardUserData] = useState<
    LeaderboardUser[]
  >([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const duration = activeTab === "weekly" ? "weekly" : "allTime";
      setLeaderboardUserData([]);
      const leaderboard = await getUserLeaderBoard(duration);
      setLeaderboardUserData(leaderboard.leaderboard);
    };
    fetchLeaderboard();
  }, [activeTab]);

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
  //menuOpe
  return (
    <div className="LeaderBoardWrapper">
      <div className="LeaderBoardContainer">
        {/* Header */}
        <div className="LeaderHeader">
          {/* <span onClick={() => router.back()}  className='backIcon'>
            <GoArrowLeft />
          </span> */}
          <span>Leaderboard</span>
        </div>
        <div className="LeaderBoardTab">
          <div
            className={`LeaderBoardTabItem ${
              activeTab === "weekly" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("weekly");
            }}
          >
            <span>Weekly</span>
          </div>
          <div
            className={`LeaderBoardTabItem ${
              activeTab === "allTime" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("allTime");
            }}
          >
            <span>All Time</span>
          </div>
        </div>
        {leaderboardUserData.length > 0 ? (
          <motion.div
            className="LeaderContainer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {leaderboardUserData.map((item, index) => (
              <motion.div
                key={item.id}
                className="userData"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 * index }}
              >
                <div className="rank">{index + 1}</div>
                <div className="userProfile">
                  <Image
                    src={item.userPfp}
                    height={35}
                    width={35}
                    alt={item.username}
                    className="logo"
                  />
                </div>
                <div className="userPoints">
                  <span>
                    {" "}
                    {item.username.slice(0, 1).toUpperCase() +
                      item.username.slice(1, 15)}{" "}
                  </span>
                  <span>{item.points} points</span>
                </div>
                {MEDALS[(index + 1) as keyof typeof MEDALS] && (
                  <div className="medal">
                    <Image
                      src={MEDALS[(index + 1) as keyof typeof MEDALS]}
                      height={20}
                      width={20}
                      alt="medal"
                      className="medalLogo"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </div>
      <BottomNavbar />
    </div>
  );
}
