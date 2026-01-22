# NuFounders - Local Setup Guide

## Prerequisites

Before running the application locally, ensure you have the following installed:

- **Node.js** v22 or higher
- **pnpm** v10 or higher (install with `npm install -g pnpm`)
- **PostgreSQL** database (Neon recommended for serverless)

## Quick Start

### 1. Install Dependencies

```bash
cd nufounders
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database (PostgreSQL - Neon recommended)
# Get your connection string from: https://console.neon.tech
DATABASE_URL=postgresql://username:password@your-project.neon.tech/nufounders?sslmode=require

# Authentication
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
VITE_APP_ID=nufounders

# OAuth - Google (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# OAuth - GitHub (https://github.com/settings/developers)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
VITE_GITHUB_CLIENT_ID=your-github-client-id

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

For **Neon** (recommended for Vercel deployment):
1. Create a free account at [Neon](https://console.neon.tech)
2. Create a new project and database
3. Copy the connection string to your `.env` file

For **local PostgreSQL**:
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE nufounders;"
```

Then push the schema:
```bash
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

## Vercel Deployment

### Prerequisites

1. A [Vercel account](https://vercel.com)
2. A MySQL-compatible database (recommended: [TiDB Serverless](https://tidbcloud.com) or [PlanetScale](https://planetscale.com))
3. OAuth credentials for Google and/or GitHub

### Deploy to Vercel

#### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/nufounders)

#### Option 2: CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time - will prompt for settings)
vercel

# Deploy to production
vercel --prod
```

### Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string (use TiDB Serverless or PlanetScale) |
| `JWT_SECRET` | Secret for JWT tokens (generate with `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `VITE_APP_ID` | Application ID (e.g., `nufounders`) |
| `VITE_GOOGLE_CLIENT_ID` | Same as `GOOGLE_CLIENT_ID` (for frontend) |
| `VITE_GITHUB_CLIENT_ID` | Same as `GITHUB_CLIENT_ID` (for frontend) |

### OAuth Redirect URIs

Configure these redirect URIs in your OAuth provider settings:

**Google Cloud Console:**
```
https://your-app.vercel.app/api/oauth/callback
```

**GitHub Developer Settings:**
```
https://your-app.vercel.app/api/oauth/callback
```

### Database Setup for Serverless

For serverless environments, use a connection-pooling compatible database:

1. **TiDB Serverless** (recommended):
   - Free tier available
   - MySQL-compatible
   - Built-in connection pooling
   - Get connection string from TiDB Cloud dashboard

2. **PlanetScale**:
   - MySQL-compatible
   - Automatic connection management
   - Free tier available

### Post-Deployment

1. Run database migrations:
   ```bash
   # Set DATABASE_URL to your production database
   export DATABASE_URL="mysql://..."
   pnpm db:push
   ```

2. Seed initial data (optional):
   ```bash
   node scripts/seed-data.mjs
   ```

3. Verify deployment at `https://your-app.vercel.app`

## Support

For questions or issues, refer to the README.md documentation or contact the development team.
