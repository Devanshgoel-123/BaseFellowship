"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "./styles.scss";
import { BottomNavbar } from "~/components/BottomNavbar";
import { StartScreen } from "~/components/StartScreen";
import { useGameStore } from "~/store/gameStats";
export const dynamic = "force-dynamic";

export default function ModeSelection() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showStartScreen, setShowStartScreen] = useState<boolean>(false);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set default creator if not set
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("chosenCreator")
    ) {
      localStorage.setItem("chosenCreator", "default");
    }
  }, []);

  const handlePlayerClick = () => {
    setShowStartScreen(true);
  };

  const handleCreatorClick = () => {
    router.push("/AddSocials");
  };

  const handleStartGame = () => {
    useGameStore.getState().setGameOn(true);
    useGameStore.getState().setGameOver(false);
    setShowStartScreen(false);
    router.push("/game");
  };

  const handleCloseStartScreen = () => {
    setShowStartScreen(false);
  };

  const Buttons = [
    {
      name: "Player",
      text: "Play the game and compete for high scores",
      link: "/game",
      src: "/assets/selectMode/controller.svg",
      onClick: handlePlayerClick,
    },
    {
      name: "Creator",
      text: "Lock your tokens, climb the leaderboard. let players mint your coin.",
      link: "/AddSocials",
      src: "/assets/selectMode/controller.svg",
      onClick: handleCreatorClick,
    },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 bg-[url('/assets/backgrounds/gameMode.svg')] bg-cover bg-center gap-[20px]">
          <h1 className="ModeText">Choose Your Mode</h1>

          <div className="w-[90vw] space-y-4 mt-6 flex flex-col gap-6">
            {Buttons.map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-[100%] h-[150px] bg-cover bg-center bg-[#05245e] rounded-3xl p-4 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center relative opacity-70"
                >
                  <div className="absolute top-[-25px] w-[60px] h-[60px] bg-[#b1cadc] rounded-full flex items-center justify-center mb-4">
                    <Image
                      height={32}
                      width={32}
                      src={item.src}
                      alt="controller"
                    />
                  </div>
                  <h2 className="absolute top-[45px] text-xl font-bold text-white gradient-text">
                    {item.name}
                  </h2>
                  <p className="gradient-sub-text">{item.text}</p>
                </button>
              );
            })}
          </div>
        </div>

        <BottomNavbar />
      </div>

      {showStartScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseStartScreen}
          />

          {/* Start Screen Content */}
          <div className="relative z-60 w-full h-full">
            <StartScreen onStart={handleStartGame} />

            <button
              onClick={handleCloseStartScreen}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
