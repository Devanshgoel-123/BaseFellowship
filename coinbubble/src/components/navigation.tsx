"use client"

import { useState } from "react"
import { Home, Gamepad2, Trophy, User } from "lucide-react"

interface NavigationProps {
  activeTab?: string
}

export function Navigation({ activeTab = "profile" }: NavigationProps) {
  const [active, setActive] = useState(activeTab)

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "games", icon: Gamepad2, label: "Games" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
    { id: "profile", icon: User, label: "User Profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600/90 backdrop-blur-sm border-t border-blue-400/20">
      <div className="flex items-center justify-around py-3">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setActive(id)} className="flex flex-col items-center gap-1 transition-colors">
            <Icon className={`w-6 h-6 ${active === id ? "text-white" : "text-blue-200"}`} />
            <span className={`text-xs ${active === id ? "text-white font-medium" : "text-blue-200"}`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
