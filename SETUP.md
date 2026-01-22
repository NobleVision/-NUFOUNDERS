# NuFounders - Local Setup Guide

## Prerequisites

Before running the application locally, ensure you have the following installed:

- **Node.js** v22 or higher
- **pnpm** v10 or higher (install with `npm install -g pnpm`)
- **MySQL** or **TiDB** database

## Quick Start

### 1. Install Dependencies

```bash
cd nufounders
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=mysql://username:password@localhost:3306/nufounders

# Authentication (for local development, you can use placeholder values)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
VITE_APP_ID=local-dev
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# Owner info (optional for local dev)
OWNER_OPEN_ID=local-owner
OWNER_NAME=Local Developer

# AI Services (optional - features will work with mock data without these)
BUILT_IN_FORGE_API_URL=https://your-forge-api-url
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
VITE_FRONTEND_FORGE_API_URL=https://your-forge-api-url
```

### 3. Set Up Database

Create the database and run migrations:

```bash
# Create the database first in MySQL
mysql -u root -p -e "CREATE DATABASE nufounders;"

# Push the schema to the database
pnpm db:push
```

### 4. Seed Demo Data (Optional)

To populate the database with sample data for demo purposes:

```bash
node scripts/seed-data.mjs
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Production Build

To create a production build:

```bash
pnpm build
pnpm start
```

## Project Structure

```
nufounders/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utilities and tRPC client
├── server/                 # Express + tRPC backend
│   ├── _core/             # Framework internals
│   ├── services/          # AI and business logic services
│   ├── db.ts              # Database queries
│   └── routers.ts         # tRPC API routes
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
├── scripts/               # Utility scripts
├── README.md              # Project documentation
├── VIDEO_PROMPTS.md       # 50 Veo 3.1 video prompts
└── todo.md                # Development task tracking
```

## Features Overview

1. **Landing Page** - Hero section with CTAs
2. **Onboarding Wizard** - Multi-step user registration
3. **Course Catalog** - AI-powered training courses
4. **Business Formation** - AI scoring and business plan generation
5. **Community Hub** - Forums and peer groups
6. **Events** - Community event calendar
7. **Scholarships** - Funding opportunities
8. **Admin Dashboard** - Analytics and platform management

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify MySQL is running: `sudo systemctl status mysql`
2. Check credentials in `.env` file
3. Ensure the database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use

If port 3000 is in use:

```bash
# Find the process
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Missing Dependencies

If you see module not found errors:

```bash
rm -rf node_modules
pnpm install
```

## Support

For questions or issues, refer to the README.md documentation or contact the development team.
