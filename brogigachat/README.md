# BroGigaChat

> **Your Phone's New Strict Older Brother** 🔥

A digital accountability partner that **forces action**, not just reminds.

## Features

- ✅ **Task Management** - Add, complete, and track tasks
- ✅ **Aura Points System** - Earn status points with multipliers
- ✅ **Skip & Extend** - Extend tasks but face consequences
- ✅ **Strict Mode** - Skip 3 times and I take control
- ✅ **Level Progression** - Rookie → Grinder → Hustler → Alpha → Sigma → TopG → Legend
- ✅ **Leaderboard** - Compete globally
- ✅ **Persistent Storage** - Progress saved locally

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** TailwindCSS
- **State:** Zustand with persistence
- **Icons:** Lucide React
- **Deploy:** Vercel

## Getting Started

Deploy directly to Vercel - no local Node.js required!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/GigaChad-79/tree/main/brogigachat)

Or run locally:

```bash
npm install
npm run dev
```

## Project Structure

```
brogigachat/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── page.tsx        # Main app with routing
│   │   └── globals.css     # Tailwind + custom styles
│   ├── components/
│   │   ├── Onboarding.tsx  # Welcome flow
│   │   ├── HomeScreen.tsx  # Task dashboard
│   │   ├── TaskCard.tsx    # Individual task display
│   │   ├── AddTaskModal.tsx # Create new task
│   │   ├── NotificationCard.tsx # Skip/extend/do it
│   │   ├── StrictModeOverlay.tsx # Full-screen takeover
│   │   ├── Leaderboard.tsx # Rankings
│   │   ├── Profile.tsx     # User stats & badges
│   │   └── BottomNav.tsx   # Navigation
│   ├── stores/
│   │   ├── userStore.ts    # User state (aura, level, streak)
│   │   └── taskStore.ts    # Task state (CRUD, skips, strict mode)
│   └── types/
│       └── index.ts        # TypeScript types & constants
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## How It Works

1. **Add a task** with target app and schedule
2. **Test notification** triggers the notification UI
3. **Extend** to delay (costs -50 Aura)
4. **Skip 3 times** → **STRICT MODE** activates
5. **Strict Mode** takes over your screen until task completes
6. **Earn Aura** with multipliers for fast completion, streaks, and first notification

## License

MIT - Built with 🔥 for the grinders.
