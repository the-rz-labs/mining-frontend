# Overview

This is a futuristic cryptocurrency mining platform called "Ranking" that offers mining plans for two tokens: MGC (purple-themed) and RZ (green-themed). The application features a cyberpunk-inspired design with neon colors and glowing effects, providing users with mining plan selection, live statistics, token performance charts, a referral system, and comprehensive company information through dedicated Contact and About Us pages. The platform emphasizes a modern fintech aesthetic similar to Binance or Coinbase but with gaming and cyberpunk visual elements.

## Recent Updates (October 6, 2025)
- **ActiveMiners Component Refactoring**: Optimized API calls and simplified code
  - Removed redundant `/api/plans` query for video URLs
  - Miners API (`/api/stakes/miners`) now directly provides `video_url` field in response
  - Updated `ApiMinerResponse` interface to include `video_url` field
  - Simplified component by removing video URL merging logic
  - Improved performance by eliminating unnecessary API calls

## Previous Updates (October 5, 2025)
- **Enhanced Miners Page Design**: Complete redesign with modern, unified grid layout
  - Unified grid view displaying all 10 mining plans (MGC + RZ) together, no separate tabs
  - Fetches from `/api/plans` endpoint using `https://api.coinmaining.game/api/plans/plans/`
  - Responsive grid: 1-4 columns adapting to screen size
  - Live wallet balances displayed in prominent cards at top (MGC purple, RZ orange)
  - Tier-based visual hierarchy:
    - Elite miners (level 5+): 3px borders, pulsing glow effects, ⚡ ELITE badge with animation
    - Premium miners (level 4): 2.5px borders, enhanced shadows, ★ PREMIUM badge
    - Standard miners: 2px borders with basic styling
  - Beautiful hover effects: scale animations, shadow intensification, image zoom
  - Monthly reward percentage displayed with trend icon
  - Real miner images from API with glass morphism cards
  
- **Deploy Miner Functionality**: Implemented stake/deploy API integration
  - Backend proxy route at `/api/stakes/stake` calling `https://api.coinmaining.game/api/stakes/stake/`
  - Mutation sends `{ miner: plan.id, amount: plan.price, token: token.id }` to API
  - "Deploy Miner" button with loading state (spinner + "Deploying..." text)
  - Success toast notification: "Miner Deployed Successfully!"
  - Error handling with descriptive toast messages
  - Auto-refresh after deployment: invalidates stakes/miners and profile queries
  - Token IDs extracted from plan.token_details[0].id (MGC=1, RZ=2)

## Previous Updates (October 4, 2025)
- **Route Protection**: Implemented authentication guards for protected routes
  - Created `ProtectedRoute` wrapper component in App.tsx
  - All `/app/*` routes now require valid JWT token in localStorage
  - Unauthenticated users automatically redirected to `/sign-in` page
  - Protection applies to: Dashboard, Miners, Profile, Referrals, Giveaways, Support, FAQ, and Achievements pages
  
## Previous Updates (October 4, 2025)
- **Wagmi Token Balance Integration**: Integrated wagmi for real-time wallet token balances
  - MGC Token: `0xa5b2324c9d9EBa3Bf7A392bEf64F56cC3061D1a8` (BSC)
  - RZ Token: `0x1B1052b305a30a9F4d77B53e0d09772a920c5A23` (BSC)
  - Uses `useReadContract` with ERC20 ABI to fetch balanceOf for connected wallet
  - Displays real-time wallet balances formatted to 2 decimal places
  - USD value cards removed, showing only token balances
  
- **Earnings Overview Simplified**: Streamlined earnings card to show only essential data
  - Removed MGC Claimed, MGC Pending, and RZ Available fields
  - Now displays only "Total MGC" and "Total RZ" earned from miners
  - Values calculated from miners API data with 6 decimal precision
  
- **Miners Dashboard API Integration**: Integrated miners/stakes API for real-time mining operations display
  - Backend proxy route at `/api/stakes/miners` calling `https://api.coinmaining.game/api/stakes/staked-miner-dashboard-get/`
  - Dashboard fetches and displays real user miners with auto-refresh every 5 seconds
  - Shows live earnings, mining rate, working time, and miner status (MGC/RZ)
  - Handles empty state gracefully when user has no active miners (404 returns empty array)
  - Profile stats updated with correct max values: Mining Power (1000), Active Miners (2), Referrals (50), Bonus Rate (1.5%)
  
## Previous Updates (October 4, 2025)
- **JWT Token Authentication**: Implemented secure token-based authentication
  - Login/signup API responses return JWT access token in `data.access` field
  - Tokens stored in localStorage with key `auth_token`
  - queryClient automatically includes `Authorization: Bearer {token}` header in all authenticated requests
  - Token cleared from localStorage on wallet disconnect
  - Backend `/api/users/me` forwards Authorization header to external API
  - Proper 401 handling for unauthorized requests

- **Profile API Integration**: Integrated external profile API for real user data
  - Backend proxy route at `/api/users/me` calling `https://api.coinmaining.game/api/users/me/`
  - Requires Authorization header with Bearer token for authentication
  - Profile page now displays real user data: username, email, avatar
  - Avatar URLs constructed from API avatar key: `https://coinmaining.game/profiles/{avatar_key}`
  - Stats dynamically updated: Active Miners (stakes count), Referrals (active_referrals), Bonus Rate (calculated from referrals)
  - Removed username edit functionality as requested
  - Badges display kept but not yet integrated with API data

- **Authentication Flow & Navigation**: Enhanced user experience with smart redirects
  - Successful sign-in/sign-up now redirects users to `/app` instead of homepage
  - Landing page navigation dynamically updates based on auth state:
    - Shows "Start Mining" button when user is not authenticated
    - Shows "Dashboard" button when user is authenticated (wallet connected)
  - Applied to both desktop and mobile navigation layouts

- **Wallet Authentication API Integration**: Integrated external wallet authentication API
  - Backend proxy routes for nonce generation, signup, and login
  - Signup endpoint: `https://api.coinmaining.game/api/users/auth/wallet_signup/`
  - Login endpoint: `https://api.coinmaining.game/api/users/auth/wallet_login/`
  - SignIn page fetches nonce from `POST /api/wallets/nonce` and authenticates via `POST /api/auth/wallet-login`
  - SignUp page uses same nonce flow and registers via `POST /api/auth/wallet-signup`
  - Provider parameter removed from both signup and login requests
  - Proper error handling for wallet-not-found (404) and wallet-already-registered (409) scenarios
  - All API calls proxied through backend to avoid CORS and use HTTPS
  
- **HTTPS API Integration**: Fixed Mixed Content error by updating API proxy to use HTTPS
  - Backend proxy now fetches from `https://api.coinmaining.game/api/plans/plans/`
  - Frontend uses default TanStack Query behavior with backend proxy at `/api/plans`
  - Successfully loading live mining plans data from external API
  
- **UI Enhancement**: Updated mining plan cards to show token type (MGC/RZ) instead of $ for minimum investment

## Previous Updates (September 30, 2025)
- **Wallet Authentication**: Integrated Reown AppKit for Web3 wallet-based authentication
- **Auto-Logout on Disconnect**: Implemented automatic logout and cache clearing when wallet is disconnected
- **Profile UI Refinements**: 
  - Changed Settings and Logout buttons from horizontal row to vertical column layout
  - Replaced "Daily Earnings" stat with "Bonus Rate" showing 0.5% percentage
  - Removed Settings button from header, kept only Notifications and Reown account button

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using Vite as the build tool. The application follows a component-based architecture with:

- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens for the cyberpunk theme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom color palette with neon purple, green, and orange themes for different token types

The design emphasizes dark themes with neon accent colors, custom fonts (Inter, Orbitron), and CSS-based glow effects to create a futuristic mining platform aesthetic.

## Backend Architecture
The backend uses Express.js with TypeScript in an ESM setup:

- **Framework**: Express.js with middleware for JSON parsing and logging
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage)
- **Development**: Vite integration for hot module replacement and development server
- **Error Handling**: Centralized error handling middleware

The server is designed with a pluggable storage interface, currently using in-memory storage but structured to easily swap in database implementations.

## Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL configuration:

- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (via Neon serverless)
- **Schema**: User management with username/password authentication
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Environment variable-based database URL configuration

The current schema supports basic user management, with the structure prepared for expanding to mining plans, transactions, and user investments.

## External Dependencies

- **Database**: Neon PostgreSQL serverless database
- **UI Components**: Radix UI primitives for accessible component foundations
- **Styling**: Tailwind CSS for utility-first styling approach
- **Fonts**: Google Fonts (Inter, Orbitron, DM Sans, Geist Mono) for typography
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for token performance visualization
- **Development**: Replit integration for development environment support
- **Asset Management**: Custom asset pipeline for generated mining rig images

The application is configured for deployment on Replit with development-specific tooling and banner integration.