"use client";

import { useRouter } from "next/navigation";
import AddSocialAccounts from "~/components/AddSocialAccounts";
import { BottomNavbar } from "~/components/BottomNavbar";

export default function AddSocialsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/ModeSelection"); 
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">
        {/* Background pattern */}
        <div className="relative z-10 h-full flex flex-col bg-[url('/assets/backgrounds/gameMode.svg')] bg-cover bg-center">
          
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            <AddSocialAccounts onBack={handleBack} />
          </div>

          {/* Bottom Navigation */}
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
}
