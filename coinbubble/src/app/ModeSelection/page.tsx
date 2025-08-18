"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef} from "react";
import Image from "next/image";
import "./styles.scss";
import { BottomNavbar } from "~/components/BottomNavbar";
export default function ModeSelection() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

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

  const Buttons = [
    {
      name: "Creator",
      text: "Lock your tokens, climb the leaderboard. let players mint your coin.",
      link: "/creator",
      src: "/assets/selectMode/controller.svg",
    },
    {
      name: "Player",
      text: "Play the game and compete for high scores",
      link: "/game",
      src: "/assets/selectMode/controller.svg",
    },
  ];
  return (
    <div className="relative w-full h-screen overflow-hidden ">
        <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-start pt-[120px] px-8 bg-[url('/assets/backgrounds/gameMode.svg')] bg-cover bg-center">
            <h1 className="ModeText">Choose Your Mode</h1>

            <div className="w-[90vw] space-y-6 mt-10 flex flex-col gap-10">
              {Buttons.map((item, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => router.push(`${item.link}`)}
                    className="w-[100%] h-[180px] bg-cover bg-center bg-[#05245e] rounded-2xl p-6  hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center relative rounded-3xl opacity-70"
                  >
                    <div className="absolute top-[-30px] w-[70px] h-[70px] bg-[#b1cadc] rounded-full flex items-center justify-center mb-4">
                      <Image
                        height={40}
                        width={40}
                        src={item.src}
                        alt="controller"
                      />
                    </div>
                    <h2 className="absolute top-[60px] text-2xl font-bold text-white gradient-text">
                      {item.name}
                    </h2>
                    <p className="gradient-sub-text">{item.text}</p>
                  </button>
                );
              })}
            </div>

            <BottomNavbar />
          </div>
        </div>
    </div>
  );
}
