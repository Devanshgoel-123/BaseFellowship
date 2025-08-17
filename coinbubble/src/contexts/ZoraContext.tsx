'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ZoraProfile {
  handle?: string
  displayName?: string
  bio?: string
  avatar?: {
    medium?: string
  }
  linkedWallets?: {
    edges?: Array<{
      node: {
        walletType: string
        walletAddress: string
      }
    }>
  }
  creatorCoin?: {
    address: string
    marketCap: string
    marketCapDelta24h: string
  }
}

interface ZoraContextType {
  zoraProfile: ZoraProfile | null
  setZoraProfile: (profile: ZoraProfile | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  walletAddress: string
  setWalletAddress: (address: string) => void
}

const ZoraContext = createContext<ZoraContextType | undefined>(undefined)

export function ZoraProvider({ children }: { children: ReactNode }) {
  const [zoraProfile, setZoraProfile] = useState<ZoraProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  return (
    <ZoraContext.Provider value={{
      zoraProfile,
      setZoraProfile,
      isLoading,
      setIsLoading,
      walletAddress,
      setWalletAddress
    }}>
      {children}
    </ZoraContext.Provider>
  )
}

export function useZora() {
  const context = useContext(ZoraContext)
  if (context === undefined) {
    throw new Error('useZora must be used within a ZoraProvider')
  }
  return context
}
