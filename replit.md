# Overview

This is a Korean wedding gift management application (축의금 관리 장부) built as a full-stack web application. The system allows users to manage wedding guest information including gift amounts, relationships, meal tickets, and other details. It features a modern React frontend with complete internationalization support (Korean, English, Japanese, Chinese) including proper currency formatting, timezone support, and localized data display, multiple color themes, dark mode, advanced blur functionality with grayscale effects, and data visualization capabilities. The backend uses Express.js with in-memory storage, though it's configured to work with PostgreSQL through Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state, local state with React hooks
- **Routing**: Wouter for client-side routing
- **Form Management**: React Hook Form with Zod validation
- **Internationalization**: Custom translation system supporting 4 languages (ko, en, ja, zh)
- **Theme System**: 5 color themes (classic-blue, wedding-rose, elegant-purple, modern-green, luxury-gold) with dark mode support
- **Charts**: Chart.js for data visualization (pie and bar charts)

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Current Storage**: In-memory storage implementation (MemStorage class)
- **API Design**: RESTful endpoints for CRUD operations on guest data
- **Development**: Vite integration for hot reloading in development
- **Validation**: Zod schemas for request validation

## Data Model
The core entity is the Guest record with the following schema:
- `id`: UUID primary key
- `name`: Guest name (required)
- `amount`: Gift amount in Korean won (required)
- `side`: Either "신랑" (groom) or "신부" (bride) (required)
- `relationship`: One of "친구" (friend), "직장" (work), "가족/친척" (family), "지인/기타" (other) (required)
- `tickets`: Number of meal tickets (default 0)
- `memo`: Optional memo field
- `timestamp`: Creation timestamp

## Component Architecture
- **Header**: Navigation with theme toggle and settings access
- **GuestForm**: Form for adding new guests with quick amount buttons
- **GuestList**: Table display with search, filtering, and deletion capabilities
- **SummaryStats**: Dashboard showing totals and statistics with blur toggle
- **Charts**: Data visualization with switchable chart types
- **SettingsModal**: Language and theme configuration

## Key Features
- **Multi-language Support**: Complete translation system for Korean, English, Japanese, and Chinese with proper localization
- **Currency Formatting**: Language-appropriate currency display (KRW for Korean, USD for English, JPY for Japanese, CNY for Chinese)
- **Timezone Support**: Time display based on language (Seoul for Korean, New York for English, Tokyo for Japanese, Shanghai for Chinese)
- **Localized Data Display**: All text values (side, relationship, tickets, people count) properly translated based on selected language
- **Theming**: 5 color themes with CSS custom properties and dark mode (fixed theme switching)
- **Advanced Data Privacy**: Blur functionality with grayscale effects for statistics, charts, and guest lists
- **Minimum Guarantee**: Setting and tracking of minimum guaranteed attendee count with remaining person calculation
- **Export**: Both CSV and XLSX export functionality for guest data
- **Wedding Couple Icon**: Custom icon in header showing bride and groom
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Comprehensive validation using Zod schemas
- **Search & Filter**: Real-time search and side-based filtering
- **Data Visualization**: Charts showing gift distribution by side and relationship with Recharts library

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL database driver (configured but not actively used)
- **drizzle-orm**: Database ORM and migration system
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **chart.js**: Data visualization library

## UI & Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Variant management for component styling
- **lucide-react**: Icon library

## Form & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle and Zod

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and development experience
- **@vitejs/plugin-react**: React support for Vite
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Backend Dependencies
- **express**: Web server framework
- **connect-pg-simple**: PostgreSQL session store (configured)
- **date-fns**: Date manipulation utilities

The application is designed to be easily deployable on Replit with the current in-memory storage, but can be migrated to use PostgreSQL by updating the storage implementation to use the configured Drizzle setup.