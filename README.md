# BaseFellowship 🚀

A revolutionary Web3 gaming platform built on Base that combines social gaming, creator monetization, and blockchain rewards. Players can compete in bubble-shooting games while earning rewards from their favorite creators.

## ✨ Features

### 🎮 Gaming Experience
- **Bubble Shooter Game**: Engaging arcade-style gameplay with multiple difficulty modes
- **Real-time Multiplayer**: Compete against other players in live gaming sessions
- **Leaderboards**: Track your performance and compete for top positions
- **Achievement System**: Earn badges and rewards for your gaming accomplishments

### 💰 Creator Economy
- **Creator Profiles**: Build your fanbase with customizable profiles and coin addresses
- **Reward Distribution**: Automatically distribute rewards to top-performing fans
- **Social Integration**: Connect with Farcaster, X (Twitter), and other social platforms
- **Fan Engagement**: Track hits and reward your most loyal supporters

### 🔐 Web3 Integration
- **Multi-Wallet Support**: Connect with MetaMask, Coinbase Wallet, and more
- **Farcaster Auth**: Seamless social authentication and identity verification
- **Decentralized Rewards**: Transparent and trustless reward distribution

## 🏗️ Architecture

### Backend (`/Backend`)
- **Express.js Server**: RESTful API with TypeScript
- **PostgreSQL Database**: Reliable data storage with Drizzle ORM
- **Neynar Integration**: Social media API integration
- **Cron Jobs**: Automated reward distribution
- **Authentication Middleware**: Secure user verification

### Frontend (`/coinbubble`)
- **Next.js 15**: Modern React framework with App Router
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **Wagmi + Viem**: Ethereum wallet integration
- **Farcaster SDK**: Social platform integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Solana wallet (Phantom, Solflare, etc.)
- Farcaster account (optional)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the Backend directory:
   ```env
   PORT=8080
   NEYNAR_API_KEY=your_neynar_api_key
   DATABASE_URL=your_postgres_connection_string
   ```

4. **Database Setup**
   ```bash
   
   # Start the development server
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd coinbubble
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📱 App Structure

### Core Pages
- **Home** (`/`): Landing page with wallet connection and game start
- **Profile** (`/profile`): User profile creation and management
- **Mode Selection** (`/ModeSelection`): Choose game difficulty and mode
- **Game** (`/game`): Main bubble shooter gameplay
- **Leaderboard** (`/LeaderBoard`): Player rankings and achievements
- **Creator Dashboard** (`/creator`): Creator profile and analytics

### Key Components
- **GameCanvas**: Core game rendering and logic
- **BottomNavbar**: Mobile navigation
- **ScoreBoard**: Real-time score tracking
- **PopUpPfp**: Profile picture management
- **BubbleRenderer**: Game bubble animations

## 🎯 API Endpoints

### User Routes (`/api/v1/users`)
- `GET /profile` - Get user profile
- `POST /profile` - Create/update user profile
- `GET /rewards` - Get user rewards

### Creator Routes (`/api/v1/creator`)
- `GET /profile` - Get creator profile
- `POST /profile` - Create/update creator profile
- `GET /analytics` - Get creator analytics

### Game Routes
- `POST /hits` - Record game hits
- `GET /leaderboard` - Get game leaderboard
- `POST /rewards` - Distribute rewards

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradients (#35A5F7, #152E92)
- **Accent**: Purple (#226ED8), Light Blue (#44A5F4)
- **Background**: Radial gradients with floating bubbles

### Typography
- **Fonts**: System fonts with custom styling
- **Hierarchy**: Clear visual hierarchy for game elements

### Components
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion integration
- **Game Assets**: Custom SVG illustrations and icons

## 🔧 Development

### Scripts

#### Backend
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run test         # Run tests
```

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run deploy       # Deploy to Vercel
```

### Database Schema

#### Users Table
- `id`: Primary key
- `username`: Unique username
- `walletAddress`: User's wallet address
- `points`: User's game points
- `userPfp`: Profile picture URL

#### Creators Table
- `id`: Primary key
- `creatorAddress`: Creator's wallet address
- `displayName`: Creator's display name
- `totalHits`: Total hits received
- `coinAddress`: Creator's coin address
- `pfp`: Creator's profile picture

#### Rewards Table
- `id`: Primary key
- `coinAddress`: Reference to creator's coin
- `userAddress`: Reference to user's wallet
- `amount`: Reward amount
- `claimed`: Claim status

## 🌐 Deployment

### Backend Deployment
- **Platform**: Any Node.js hosting (Railway, Render, Heroku)
- **Database**: Neon PostgreSQL (serverless)
- **Environment**: Set production environment variables

### Frontend Deployment
- **Platform**: Vercel (recommended)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
---

**Built with ❤️ by the BaseFellowship Pod 01 team**