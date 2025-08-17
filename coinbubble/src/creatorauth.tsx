import { ArrowLeft, Home, Gamepad2, Trophy, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SocialAccountsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 text-white flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pt-12">
        <ArrowLeft className="w-6 h-6" />
        <h1 className="text-lg font-medium">Add social accounts</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        {/* Avatar with Plus Icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-10 h-10 text-white/80" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Plus className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-3">Link your Socials</h2>
          <p className="text-white/80 text-sm leading-relaxed px-4">
            Adding your social accounts makes it easier to get discovered
          </p>
        </div>

        {/* Social Platform Cards */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          {/* Zora Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-purple-500 rounded-full"></div>
            </div>
            <p className="text-white text-sm font-medium">Add Zora</p>
          </Card>

          {/* X (Twitter) Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 mx-auto mb-3 bg-black rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <p className="text-white/60 text-xs mb-1">@bubblebanger</p>
            <p className="text-white text-sm font-medium">Disconnect</p>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 px-6 py-3">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="text-xs">Game</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Leaderboard</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-white hover:text-white hover:bg-white/10"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">User Profile</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
