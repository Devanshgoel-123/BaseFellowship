

export const registerUser=async (username: string, walletAddress: string)=>{
    try{
        const user=await prisma.user.create({
            data:{
                username,
                walletAddress
            }
        })
    }catch(error){
}


// getUserProfile(userId: number)
// updateUserWallet(userId: number, newWallet: string)