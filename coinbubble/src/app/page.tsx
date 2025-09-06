/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Connector } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BackgroundBubbles } from "~/components/BottomBubbles";
import { useAccount, useConnect } from "wagmi";
import { NAME_IMAGE } from "~/lib/constants";
import { getUserProfile } from "~/Services/user";
import sdk from "@farcaster/miniapp-sdk";
export default function HomePage() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  console.log(isConnected, address);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {}

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const initializeSdk = async () => {
      console.log("sdk ready");
      await sdk.actions.ready();
    };
    initializeSdk();
  }, []);

  const handleStart = async () => {
    try {
      const user = await getUserProfile({
        walletAddress: address as string,
      });
      if (user) {
        router.push("/ModeSelection");
      } else {
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
    }
    router.push("/ModeSelection");
  };

  const handleWalletConnect = async () => {
    try {
      console.log("Available connectors:", connectors);

      if (connectors.length === 0) {
        alert("No wallet connectors available.");
        return;
      }

      // Define priority order (functions to pick connector)
      const priorityOrder: ((
        cs: readonly Connector[]
      ) => Connector | undefined)[] = [
        (cs) => cs.find((c) => c?.name?.toLowerCase().includes("metamask")),
        (cs) => cs.find((c) => c?.name?.toLowerCase().includes("farcaster")),
        (cs) => cs.find((c) => c?.name?.toLowerCase().includes("coinbase")),
        (cs) => cs[0], // fallback to first available
      ];

      let connected: Connector | null = null;

      for (const getConnector of priorityOrder) {
        // ✅ Call the function to actually get the connector
        const connector = getConnector(connectors);
        if (!connector) continue;

        try {
          console.log(`🔍 Trying connector: ${connector.name}`);
          await connect({ connector }); // connector is now the right type
          console.log(`✅ Connected with ${connector.name}`);
          connected = connector;
          break;
        } catch (err) {
          console.warn(`❌ Failed with ${connector?.name}`, err);
        }
      }

      if (!connected) {
        throw new Error("No connectors could be used.");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Mobile-first responsive container */}
      <div className="relative w-full max-w-[450px] h-full flex flex-col items-center justify-center mx-auto px-4">
        <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">
          {/* Large background bubbles - responsive sizing */}
          <div className="absolute w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[406px] lg:h-[406px] left-[-75px] sm:left-[-100px] md:left-[-150px] lg:left-[-224px] top-[-60px] sm:top-[-80px] md:top-[-120px] lg:top-[-159px] bg-gradient-to-b from-[#226ED8] to-[rgba(35,136,242,0)] opacity-70 rounded-full blur-[2.9px]"></div>

          {/* Top right bubble - responsive positioning */}
          <div className="absolute w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px] left-[240px] sm:left-[260px] md:left-[280px] lg:left-[334px] top-[60px] sm:top-[80px] md:top-[100px] lg:top-[119px] bg-gradient-to-b from-[rgba(44,155,244,0.28)] to-[rgba(48,158,245,0.098)] backdrop-blur-[13.1px] rounded-full"></div>

          {/* Bubble cluster - responsive sizing and positioning */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Row 1 */}
            <div className="absolute w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[123px] lg:h-[123px] left-[20px] sm:left-[30px] md:left-[40px] lg:left-[48px] top-[150px] sm:top-[200px] md:top-[240px] lg:top-[281px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[123px] lg:h-[123px] left-[80px] sm:left-[100px] md:left-[140px] lg:left-[171px] top-[180px] sm:top-[220px] md:top-[280px] lg:top-[331px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[123px] lg:h-[123px] left-[140px] sm:left-[160px] md:left-[200px] lg:left-[259px] top-[160px] sm:top-[200px] md:top-[260px] lg:top-[313px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>

            {/* Row 2 */}
            <div className="absolute w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[123px] lg:h-[123px] left-[5px] sm:left-[5px] md:left-[5px] lg:left-[5px] top-[200px] sm:top-[240px] md:top-[290px] lg:top-[351px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[123px] lg:h-[123px] left-[40px] sm:left-[50px] md:left-[70px] lg:left-[90px] top-[220px] sm:top-[260px] md:top-[310px] lg:top-[374px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>

            {/* Row 3 */}
            <div className="absolute w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[123px] lg:h-[123px] left-[45px] sm:left-[60px] md:left-[80px] lg:left-[97px] top-[250px] sm:top-[290px] md:top-[340px] lg:top-[412px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[123px] lg:h-[123px] left-[80px] sm:left-[100px] md:left-[140px] lg:left-[171px] top-[260px] sm:top-[300px] md:top-[350px] lg:top-[425px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[123px] lg:h-[123px] left-[140px] sm:left-[160px] md:left-[200px] lg:left-[261px] top-[240px] sm:top-[280px] md:top-[330px] lg:top-[404px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>

            {/* Bottom row */}
            <div className="absolute w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[123px] lg:h-[123px] left-[10px] sm:left-[15px] md:left-[15px] lg:left-[17px] top-[240px] sm:top-[280px] md:top-[330px] lg:top-[404px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
          </div>

          {/* Bottom large bubble */}
          <div className="absolute w-full h-[95vh] bg-gradient-to-b from-[#226ED8] to-[rgba(35,136,242,0)] blur-[1px]">
            <BackgroundBubbles />
          </div>
        </div>

        {/* Game title - responsive sizing */}
        <div className="absolute w-[350px] h-[210px] mt-[100px] sm:w-[250px] sm:h-[130px] md:w-[300px] md:h-[160px] lg:w-[378px] lg:h-[202.73px] left-1/2 -translate-x-1/2 top-[180px] sm:top-[220px] md:top-[260px] lg:top-[324px]">
          <img
            src={NAME_IMAGE}
            alt="Bubble Shooter"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Start button - mobile optimized */}
        <button
          onClick={() => {
            console.log(connectors);
            if (isConnected) {
              handleStart();
            } else {
              handleWalletConnect();
            }
          }}
          className="absolute bottom-[60px] sm:bottom-[70px] md:bottom-[80px] lg:bottom-[100px] w-[240px] sm:w-[280px] md:w-[320px] lg:w-auto px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-3 md:py-3 lg:py-4 bg-white text-[#0B3E84] text-sm sm:text-base md:text-base lg:text-md font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors touch-manipulation"
        >
          {isConnected ? "Start Game" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}
