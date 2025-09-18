# Overview

This is a futuristic cryptocurrency mining platform called "Ranking" that offers mining plans for two tokens: MGC (purple-themed) and RZ (green-themed). The application features a cyberpunk-inspired design with neon colors and glowing effects, providing users with mining plan selection, live statistics, token performance charts, and a referral system. The platform emphasizes a modern fintech aesthetic similar to Binance or Coinbase but with gaming and cyberpunk visual elements.

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