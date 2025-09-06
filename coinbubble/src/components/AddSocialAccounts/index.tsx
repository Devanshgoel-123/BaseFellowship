"use client";
import { ArrowLeft, User, Plus } from "lucide-react";
import { useState } from "react";

interface LinkSocialAccountsProps {
  onBack?: () => void;
}

export default function AddSocialAccounts({ onBack }: LinkSocialAccountsProps) {
  const [clickedCard, setClickedCard] = useState<string | null>(null);

  const handleCardClick = (cardType: string) => {
    setClickedCard(cardType);

    // Reset animation after a short delay
    setTimeout(() => {
      setClickedCard(null);
    }, 200);

    // Callback functions for each card
    if (cardType === "zora") {
      // Add your Zora connection logic here
    } else if (cardType === "twitter") {
      console.log("Disconnecting Twitter account...");
      // Add your Twitter disconnection logic here
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="w-full bg-transparent text-white p-6">
      {/* Header */}
      <div className="flex items-center mb-20">
        <ArrowLeft
          className="w-6 h-6 text-white cursor-pointer hover:text-white/80 transition-colors"
          onClick={handleBackClick}
        />
        <span className="ml-4 text-2xl font-medium">Add Social Accounts</span>
      </div>

      <div className="max-w-sm mx-auto">
        {/* Profile Icon and Title Section */}
        <div className="flex flex-col items-center mb-12">
          <img src="/assets/add_social_accounts/account.svg" alt="Account" />
          <h2 className="text-3xl font-semibold mb-2">Link your Socials</h2>
          <p className="text-black/70 text-center leading-relaxed">
            Adding your social accounts
            <br />
            makes it easier to get discovered
          </p>
        </div>

        {/* Social Account Cards */}
        <div className="relative grid grid-cols-2 gap-4">
          {/* Zora Card */}
          <div
            onClick={() => handleCardClick("zora")}
            className={`aspect-square bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer active:scale-95 ${
              clickedCard === "zora" ? "scale-95 bg-white/20" : ""
            }`}
          >
            <div className="relative flex flex-col items-center justify-center h-full">
              <div className="absolute w-18 flex items-center justify-center mb-4">
                <img
                  src="/assets/add_social_accounts/zora.svg"
                  alt="Zora"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute text-black font-medium text-base text-center top-[80%]">
                Add Zora
              </span>
            </div>
          </div>

          {/* Twitter/X Card */}
          <div
            onClick={() => handleCardClick("twitter")}
            className={`aspect-square bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer active:scale-95 ${
              clickedCard === "twitter" ? "scale-95 bg-white/20" : ""
            }`}
          >
            <div className="relative flex flex-col items-center justify-center h-full">
              <div className="absolute w-18 flex items-center justify-center mb-4">
                <img
                  src="/assets/add_social_accounts/x.svg"
                  alt="X/Twitter"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute top-[80%] text-center mb-4">
                <span className="block text-black font-medium text-base mb-[-4px]">
                  @bubblebanger
                </span>
                <span className="block text-white/50 text-sm">Disconnect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
