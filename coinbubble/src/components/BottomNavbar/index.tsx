import Link from "next/link";
import Image from "next/image";
import "./styles.scss";
export const BottomNavbar = () => {
   const RoutingTabs=[
    {
        link:"/",
        name:"Home",
        icon:"/assets/leaderboard/home.svg"
    },
    {
        link:"/LeaderBoard",
        name:"LeaderBoard",
        icon:"/assets/leaderboard/board.svg"
    },
 {
        link:"/game",
        name:"Game",
        icon:"/assets/leaderboard/game.svg"
    },
    {
        link:"/profile",
        name:"User Profile",
        icon:"/assets/leaderboard/profile.svg"
    }
   ]
    return (
        <div className="BottomNavbarWrapper">
                {
                    RoutingTabs.map((item,index)=>(
                        <div className="BottomNavbarItem" key={index}>
                        <Link href={item.link} key={index}>
                            <Image src={item.icon} alt={item.name} width={24} height={24} />
                        </Link>
                        <span className="BottomNavbarItemText">{item.name}</span>
                        </div>
                    ))
                }
        </div>
    )
}