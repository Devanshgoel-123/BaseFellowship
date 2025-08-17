'use client'

import { ArrowLeft, Home, Gamepad2, Trophy, User, Plus } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { useState, useEffect } from "react"
import { getProfile } from "@zoralabs/coins-sdk"
import { useZora } from "../../contexts/ZoraContext"
import { useRouter } from "next/navigation"

export default function SocialAccountsPage() {
  const router = useRouter()
  const { zoraProfile, setZoraProfile, isLoading: isLoadingZora, setIsLoading, walletAddress, setWalletAddress } = useZora()

  const fetchZoraProfile = async (address: string) => {
    if (!address) return
    
    setIsLoading(true)
    try {
      const response = await getProfile({
        identifier: address,
      })
      
      const profile = response?.data?.profile
      if (profile) {
        setZoraProfile(profile)
        console.log("Zora Profile loaded:", profile)
        
        // Automatically route to creatordespo page after successful profile fetch
        setTimeout(() => {
          router.push('/creatordespo')
        }, 1000) // Small delay to show success state
      }
    } catch (error) {
      console.error("Error fetching Zora profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectZora = () => {
    // For demo purposes, using a sample address
    // In production, this would come from wallet connection
    const sampleAddress = "0x1234567890123456789012345678901234567890"
    setWalletAddress(sampleAddress)
    fetchZoraProfile(sampleAddress)
  }

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
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-3">Link your Socials</h2>
          <p className="text-white/80 text-sm leading-relaxed px-4 mb-6">
            Adding your social accounts makes it easier to get discovered
          </p>
          
          {/* Wallet Address Input */}
          <div className="w-full max-w-xs mx-auto">
            <input
              type="text"
              placeholder="Enter wallet address (0x...)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
            />
            <Button
              onClick={() => fetchZoraProfile(walletAddress)}
              disabled={!walletAddress || isLoadingZora}
              className="w-full mt-2"
            >
              {isLoadingZora ? 'Loading...' : 'Fetch Profile'}
            </Button>
          </div>
        </div>

        {/* Social Platform Cards */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          {/* Zora Card */}
          <div 
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center hover:bg-white/15 transition-colors cursor-pointer"
            onClick={handleConnectZora}
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-purple-500 rounded-full"></div>
            </div>
            {isLoadingZora ? (
              <p className="text-white text-sm font-medium">Loading...</p>
            ) : zoraProfile ? (
              <div>
                <p className="text-white text-sm font-medium mb-2">{zoraProfile.displayName || 'Zora Profile'}</p>
                {zoraProfile.handle && (
                  <p className="text-white/60 text-xs">@{zoraProfile.handle}</p>
                )}
                {zoraProfile.creatorCoin && (
                  <p className="text-blue-300 text-xs mt-1">Creator Coin: ${zoraProfile.creatorCoin.marketCap}</p>
                )}
              </div>
            ) : (
              <p className="text-white text-sm font-medium">Connect Zora</p>
            )}
          </div>

          {/* X (Twitter) Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 mx-auto mb-3 bg-black rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <p className="text-white/60 text-xs mb-1">@bubblebanger</p>
            <p className="text-white text-sm font-medium">coming soon </p>
          </div>
        </div>

                  {/* Profile Information Display */}
          {zoraProfile && (
            <div className="w-full max-w-xs mt-6 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-3 text-center">✅ Profile Connected!</h3>
              <div className="space-y-2 text-sm">
                <p className="text-green-300 text-center mb-3">
                  Redirecting to creator dashboard...
                </p>
                {zoraProfile.bio && (
                  <p className="text-white/80">
                    <span className="text-white/60">Bio:</span> {zoraProfile.bio}
                  </p>
                )}
                {zoraProfile.avatar?.medium && (
                  <div className="flex items-center justify-center">
                    <img 
                      src={zoraProfile.avatar.medium} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full border-2 border-white/20"
                    />
                  </div>
                )}
                {zoraProfile.linkedWallets?.edges && zoraProfile.linkedWallets.edges.length > 0 && (
                  <div>
                    <p className="text-white/60 mb-1">Linked Wallets:</p>
                    {zoraProfile.linkedWallets.edges.map((link: any, index: number) => (
                      <p key={index} className="text-white/80 text-xs">
                        {link.node.walletType}: {link.node.walletAddress.slice(0, 6)}...{link.node.walletAddress.slice(-4)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingZora && (
            <div className="w-full max-w-xs mt-6 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-300 text-sm">Fetching Zora profile...</p>
              </div>
            </div>
          )}
      </div>


    </div>
  )
}




