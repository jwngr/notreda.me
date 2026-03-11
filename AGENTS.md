# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

notreda.me is a React-based website for historical Notre Dame Fighting Irish football schedules, stats, and analyses. The project consists of a modern React frontend (in `/website`) and data processing scripts (in `/scripts`) that scrape and transform football data.

## Common Development Commands

### Website (Frontend)
All commands below should be run from the `/website` directory:

```bash
# Development
npm run start          # Start development server on port 3000
npm run build          # Build production version
npm run preview        # Preview production build locally
npm run clean          # Remove dist/ directory

# Code Quality
npm run lint           # Run Prettier and ESLint checks
npm run format         # Auto-format code with Prettier
npm run analyze        # Analyze bundle size with source-map-explorer

# Dependencies
npm run update-deps    # Update dependencies
```

### Scripts (Data Processing)
All commands below should be run from the `/scripts` directory:

```bash
# Code Quality
npm run lint           # Run Prettier, ESLint, and TypeScript checks
npm run format         # Auto-format code with Prettier
npm run build          # Compile TypeScript

# Data Updates (Production only)
./ndSchedules/update.sh    # Update Notre Dame schedule data (Linux only)
```

## Architecture Overview

### Frontend Structure (`/website`)
- **React 19** with TypeScript and Vite as the build tool
- **Styled Components** for CSS-in-JS styling with a centralized theme
- **React Router** for client-side routing with lazy-loaded screens
- **D3.js** for data visualizations and charts
- **Firebase Hosting** for deployment

#### Key Directories:
- `src/screens/` - Main application screens (FootballScheduleScreen, ExplorablesScreen)
- `src/components/` - Reusable React components organized by feature
- `src/models/` - TypeScript type definitions for games, teams, polls, etc.
- `src/resources/` - Static data files (schedules, game stats, explorables)
- `src/lib/` - Utility functions and custom hooks

### Data Pipeline (`/scripts`)
- **Node.js scripts** for web scraping and data transformation
- **Puppeteer** for browser automation when scraping data
- **Automated validation** to ensure data integrity

#### Key Scripts:
- `ndSchedules/update.ts` - Fetches latest Notre Dame schedule data
- `ndSchedules/validate.ts` - Validates data integrity
- `ndSchedules/transform.ts` - Processes and formats data
- `ndSchedules/update.sh` - Production deployment script

### Data Storage (`/data`)
- `teamSchedules/` - Individual CSV files for each team's historical schedules
- `decadeCsvs/` - Schedule data organized by decade
- `polls/` - Historical polling data

## Development Workflow

1. **Frontend changes**: Work in `/website`, test with `npm run start`
2. **Data changes**: Modify scripts in `/scripts`, validate with local runs
3. **Deployment**: Firebase auto-deploys on merge to main for website changes
4. **Data updates**: Production server runs automated updates via cron

## Key TypeScript Models

The codebase uses comprehensive TypeScript models for type safety:

- `GameInfo` - Complete game data including scores, stats, weather, rankings
- `TeamId` - Enum of all college football team identifiers  
- `TVNetwork` - Supported broadcasting networks
- `GameResult` - Win/Loss/Tie enum for Notre Dame's perspective

## Code Standards

- **ESLint**: Strict TypeScript rules with React hooks validation
- **Prettier**: Enforced code formatting with import sorting
- **No console.log**: Console statements are linted as errors
- **Type safety**: Strict TypeScript configuration with comprehensive models

## Deployment

- **Website**: Automatic deployment to Firebase Hosting on push to main
- **Data**: Production server runs scheduled data updates and commits changes back
- **Preview**: GitHub Actions creates preview deployments for pull requests
