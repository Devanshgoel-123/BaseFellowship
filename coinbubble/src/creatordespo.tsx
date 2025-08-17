"use client"

import { ArrowLeft, MoreHorizontal, X } from "lucide-react"
import { Button } from "./components/ui/Button"
import { useState, useEffect } from "react"
import { useZora } from "./contexts/ZoraContext"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const { zoraProfile, walletAddress: zoraWalletAddress } = useZora()
  const [showDepositPopup, setShowDepositPopup] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [farcasterFid, setFarcasterFid] = useState("")
  const [tokenAddress, setTokenAddress] = useState("")
  const [isDepositing, setIsDepositing] = useState(false)
  const [depositStatus, setDepositStatus] = useState("")

  // Redirect to creatorauth if no Zora profile is available
  useEffect(() => {
    if (!zoraProfile) {
      router.push('/creatorauth')
    }
  }, [zoraProfile, router])

  const handleDeposit = () => {
    console.log("[v0] Deposit button clicked")
    setShowDepositPopup(true)
  }

  const handleBack = () => {
    console.log("[v0] Back button clicked")
    router.push('/creatorauth')
  }

  const handleConfirmDeposit = () => {
    if (!depositAmount || !farcasterFid || !tokenAddress) {
      alert("Please fill in all fields")
      return
    }
    console.log("[v0] Confirming deposit:", { farcasterFid, tokenAddress, depositAmount })
    alert(`Deposit confirmed! Creator ID: ${farcasterFid}, Token: ${tokenAddress}, Amount: ${depositAmount}`)
    setShowDepositPopup(false)
    setDepositAmount("")
    setFarcasterFid("")
    setTokenAddress("")
  }

  const handleCancelDeposit = () => {
    setShowDepositPopup(false)
    setDepositAmount("")
    setFarcasterFid("")
    setTokenAddress("")
    setDepositStatus("")
    setIsDepositing(false)
  }

  // Show loading state if no profile
  if (!zoraProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-900 p-2 sm:p-4">
        <div className="text-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-blue-200 text-sm sm:text-base">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900 p-2 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg h-auto min-h-[600px] sm:min-h-[667px] md:min-h-[700px] relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
        {/* Background decorative elements */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/game/iphone-bg.png')" }}
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 pt-8 sm:pt-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <ArrowLeft 
              className="w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer" 
              onClick={handleBack} 
            />
            <span className="text-white text-base sm:text-lg font-medium">Profile</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative z-10 px-3 sm:px-4 mt-4 sm:mt-6">
          <div className="flex sm:flex-col sm:items-start justify-between gap-3 sm:gap-0">
            <div className="flex-1 order-2 sm:order-1">
              <h1 className="text-white text-lg sm:text-xl font-bold">
                {zoraProfile.displayName || "Creator Profile"}
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm">
                {zoraProfile.handle ? `@${zoraProfile.handle}` : "No handle set"}
              </p>
              {zoraProfile.bio && (
                <p className="text-blue-100 text-xs sm:text-sm mt-2">{zoraProfile.bio}</p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                <span className="text-blue-100 text-xs sm:text-sm">
                  <span className="text-white font-bold">
                    {zoraProfile.linkedWallets?.edges?.length || 0}
                  </span> linked wallets
                </span>
                <span className="text-blue-100 text-xs sm:text-sm">
                  <span className="text-white font-bold">
                    {zoraProfile.creatorCoin ? "1" : "0"}
                  </span> creator coin
                </span>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="w-16 h-16 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/20 order-1 sm:order-2 self-center sm:self-start">
              {zoraProfile.avatar?.medium ? (
                <img 
                  src={zoraProfile.avatar.medium} 
                  alt="Zora Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {zoraProfile.displayName?.[0] || "C"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Market Cap Section */}
        <div className="relative z-10 px-3 sm:px-4 mt-6 sm:mt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm">Market cap</p>
              <p className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
                {zoraProfile.creatorCoin?.marketCap ? `$${zoraProfile.creatorCoin.marketCap}` : "N/A"}
              </p>
              {zoraProfile.creatorCoin?.marketCapDelta24h && (
                <p className={`text-xs ${parseFloat(zoraProfile.creatorCoin.marketCapDelta24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(zoraProfile.creatorCoin.marketCapDelta24h) >= 0 ? '+' : ''}{zoraProfile.creatorCoin.marketCapDelta24h}% (24h)
                </p>
              )}
            </div>

            {/* Top Holders */}
            <div>
              <p className="text-blue-100 text-xs sm:text-sm text-right mb-2">Creator Coin</p>
              <div className="flex items-center -space-x-2">
                {zoraProfile.creatorCoin ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white overflow-hidden flex items-center justify-center">
                    <span className="text-white text-xs font-bold">$</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-400 border-2 border-white overflow-hidden flex items-center justify-center">
                    <span className="text-white text-xs font-bold">-</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Connection Status */}
        <div className="relative z-10 px-3 sm:px-4 mt-4 sm:mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Zora Wallet</p>
                <p className="text-white text-sm sm:text-base font-medium">
                  {zoraWalletAddress ? `${zoraWalletAddress.slice(0, 6)}...${zoraWalletAddress.slice(-4)}` : "Not connected"}
                </p>
              </div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse"></div>
            </div>
            {zoraProfile.creatorCoin && (
              <div className="mt-2">
                <p className="text-blue-100 text-xs sm:text-sm">Creator Coin Address</p>
                <p className="text-white font-medium text-xs">
                  {zoraProfile.creatorCoin.address.slice(0, 6)}...{zoraProfile.creatorCoin.address.slice(-4)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Linked Wallets Section */}
        {zoraProfile.linkedWallets?.edges && zoraProfile.linkedWallets.edges.length > 0 && (
          <div className="relative z-10 px-3 sm:px-4 mt-3 sm:mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
              <p className="text-blue-100 text-xs sm:text-sm mb-3">Linked Wallets</p>
              <div className="space-y-2">
                {zoraProfile.linkedWallets.edges.map((link: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-white/80">{link.node.walletType}</span>
                    <span className="text-white font-mono">
                      {link.node.walletAddress.slice(0, 6)}...{link.node.walletAddress.slice(-4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deposit Button */}
        <div className="relative z-10 px-3 sm:px-4 mt-4 sm:mt-6 mb-6 sm:mb-8">
          <Button
            onClick={handleDeposit}
            className="w-full bg-black hover:bg-gray-900 text-white py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
          >
            Deposit Creator Tokens
          </Button>
        </div>

        {/* Deposit Popup Modal */}
        {showDepositPopup && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-sm border border-blue-400/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">Deposit Creator Tokens</h3>
                <X
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-100 hover:text-white cursor-pointer transition-colors"
                  onClick={handleCancelDeposit}
                />
              </div>

              {/* Deposit Status */}
              {depositStatus && (
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-white/20 rounded-lg">
                  <p className="text-white text-xs sm:text-sm">{depositStatus}</p>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-blue-100 text-xs sm:text-sm mb-2">Creator ID (FID)</label>
                  <input
                    type="number"
                    placeholder="12345"
                    value={farcasterFid}
                    onChange={(e) => setFarcasterFid(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white/10 border border-blue-300/30 rounded-lg sm:rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 backdrop-blur-sm text-sm"
                  />
                </div>

                <div>
                  <label className="block text-blue-100 text-xs sm:text-sm mb-2">Token Contract Address</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white/10 border border-blue-300/30 rounded-lg sm:rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 backdrop-blur-sm text-sm"
                  />
                </div>

                <div>
                  <label className="block text-blue-100 text-xs sm:text-sm mb-2">Amount (ETH)</label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white/10 border border-blue-300/30 rounded-lg sm:rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 backdrop-blur-sm text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={handleCancelDeposit}
                  disabled={isDepositing}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm disabled:opacity-50 text-sm sm:text-base py-2 sm:py-3"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmDeposit} 
                  disabled={!depositAmount || !farcasterFid || !tokenAddress || isDepositing}
                  className="flex-1 bg-black hover:bg-gray-900 text-white disabled:opacity-50 text-sm sm:text-base py-2 sm:py-3"
                >
                  {isDepositing ? "Processing..." : "Confirm Deposit"}
                </Button>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  )
}
