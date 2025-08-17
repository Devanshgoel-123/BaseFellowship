import { getProfile } from "@zoralabs/coins-sdk";
 
async function fetchUserProfile() {
  const response = await getProfile({
    identifier: "0xUserWalletAddress",
  });
  
  // TODO: fix profile graphql types
  const profile: any = response?.data?.profile;
  
  if (profile) {
    console.log("Profile Details:");
    console.log("- Handle:", profile.handle);
    console.log("- Display Name:", profile.displayName);
    console.log("- Bio:", profile.bio);
    
    // Access profile image if available
    if (profile.avatar?.medium) {
      console.log("- Profile Image:", profile.avatar.medium);
    }
    
    // Access social links if available
    if (profile?.linkedWallets && profile?.linkedWallets?.edges?.length || 0 > 0) {
      console.log("Linked Wallets:");
      profile?.linkedWallets?.edges?.forEach((link: any) => {
        console.log(`- ${link?.node?.walletType}: ${link?.node?.walletAddress}`);
      });
    }
    
    // Access Creator Coin if available
    if (profile?.creatorCoin) {
      console.log("Creator Coin:");
      console.log("- Address:", profile.creatorCoin.address);
      console.log("- Market Cap:", profile.creatorCoin.marketCap);
      console.log("- 24h Market Cap Change:", profile.creatorCoin.marketCapDelta24h);
    }
  } else {
    console.log("Profile not found or user has not set up a profile");
  }
  
  return response;
}