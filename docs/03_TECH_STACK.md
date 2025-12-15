# BroGigaChat - Tech Stack

## 🏗️ The Brutalized T3 Hybrid Stack 2025

```
┌─────────────────────────────────────────────────────────┐
│           THE BRUTALIZED T3 HYBRID STACK 2025           │
│                (Web + Native Napalm)                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  FRAMEWORK:                                             │
│  ├─ Next.js 14 (App Router) – Web Core                  │
│  └─ Expo (React Native) – Native Fork (Week 5+)         │
│                                                          │
│  LANGUAGE:                                              │
│  └─ TypeScript (Strict Mode, ESLint/Prettier)           │
│                                                          │
│  DATABASE:                                              │
│  └─ PostgreSQL via Neon (Serverless Shards)             │
│                                                          │
│  ORM:                                                   │
│  └─ Prisma (w/ Accelerate Caching)                      │
│                                                          │
│  STYLING:                                               │
│  ├─ TailwindCSS + NativeWind (Expo)                     │
│  └─ shadcn/ui (Components Carnage)                      │
│                                                          │
│  STATE MANAGEMENT:                                      │
│  ├─ Server Components (Server State)                    │
│  └─ Zustand (Client State – Zippy Streaks)              │
│                                                          │
│  API LAYER:                                             │
│  ├─ Server Actions (Primary – Simple Stabs)             │
│  └─ tRPC (Tier 6+ – Type-Tormented Endpoints)           │
│                                                          │
│  VALIDATION:                                            │
│  └─ Zod (Input Immolation Everywhere)                   │
│                                                          │
│  AUTH:                                                  │
│  └─ Supabase Auth (Magic Links + RLS + Biometrics)      │
│                                                          │
│  HOSTING/DEPLOY:                                        │
│  ├─ Vercel (Web/Edge Empire)                            │
│  └─ Expo EAS (Native Builds – App Store Onslaught)      │
│                                                          │
│  AI INTEGRATION:                                        │
│  └─ Grok API + TensorFlow Lite (On-Device Ghosts)       │
│                                                          │
│  NOTIFICATIONS:                                         │
│  └─ Expo Notifications (Native Nukes) + FCM (Web)       │
│                                                          │
│  SOCIAL HOOKS:                                          │
│  └─ Ayrshare (X/TikTok/IG Cross-Post Carnage)           │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Framework Details

### Web Core: Next.js 14 (App Router)
- Server Components for pillar data fetching
- Partial Prerendering for lightning loads
- Edge-capable performance via Vercel

### Mobile: Expo (React Native)
- Native fork starting Week 5 of development
- TypeScript shared with web (no context-switching)
- NativeWind for consistent styling
- EAS for App Store builds

---

## 💾 Database Architecture

### PostgreSQL via Neon
- **Why Neon over Supabase?** 3x faster queries, serverless shards
- Branching for beta testing without bill explosions
- Row-Level Security (RLS) for user data protection

### Prisma ORM
- Schema-first development
- Prisma Accelerate for global caching (70% latency reduction)
- Type-safe queries propagated to all clients

---

## 🎨 Styling Stack

### TailwindCSS
- Utility-first CSS framework
- Custom "Bro Boil" theme: Crimson for blood-boils, shadows for intensity
- Dark mode default (optional light)

### NativeWind
- Tailwind for React Native
- Same utility classes cross-platform
- Consistent design language

### shadcn/ui
- Copy-paste component library
- Customizable notification components
- Draggable modals for task management

---

## 📊 State Management

### Server Components (Primary)
- Fetch pillar data server-side
- No client-side state bloat
- Better performance for initial loads

### Zustand (Client State)
- Lightweight client state management
- Streak sliders, local preferences
- No TanStack Query complexity until 10K+ users

---

## 🔌 API Layer

### Server Actions (Primary)
- Simple mutations for MVP
- Teleport triggers
- Task CRUD operations

### tRPC (Advanced - Type-Safe Endpoints)
- End-to-end TypeScript inference
- For complex AI enhancement APIs
- Added in later phases for type-tormented endpoints

### Zod Validation
- Input validation everywhere
- Shared schemas between client and server
- Runtime type checking

---

## 🔐 Authentication

### Supabase Auth
- Magic Links (passwordless)
- OAuth providers (Google, Apple, GitHub)
- Row Level Security integration
- Biometric support for mobile (Face ID, Touch ID)

### JWT Flow
- Mobile app obtains JWT from Supabase
- Passed in Authorization header for all API calls
- Context decodes token to identify user consistently

---

## 📤 Notifications

### Expo Notifications (Mobile)
- Native push notifications that actually work
- Background app refresh support
- Rich notifications with action buttons

### Firebase Cloud Messaging (Web)
- Service worker based notifications
- Fallback for PWA users

---

## 🤖 AI Integration

### Grok API (Cloud)
- Custom rant generation ("Tate-twist this tweet")
- Task enhancement suggestions
- RAG pipeline with persona knowledge bases

### TensorFlow Lite (On-Device)
- Local form tracking via camera
- Offline AI capabilities
- No data latency for critical features

---

## 🌐 Hosting & Deployment

### Vercel (Web)
- Edge function deployment
- Automatic previews for PRs
- Zero-config Next.js hosting

### Expo EAS (Mobile)
- App Store and Play Store builds
- Over-the-air updates (where permitted)
- Development builds for testing

---

## 🔗 Third-Party Integrations

### Social Platforms (via Ayrshare)
- Single API for X/TikTok/IG cross-posting
- $49/mo starter plan
- OAuth for user platform connections

### Deep Linking
- Branch.io or Firebase Dynamic Links
- Custom URL schemes for each target app
- Fallback handling for uninstalled apps

### Analytics
- Mixpanel for product analytics
- Amplitude for growth metrics
- Custom event tracking

### Payments
- Stripe for web subscriptions
- Apple/Google In-App Purchase for mobile
- Unified subscription management

---

## 📂 Monorepo Structure

```
/apps
  /nextjs          - Web application (Next.js App Router)
  /expo            - Mobile application (React Native)
  
/packages
  /api             - tRPC router definitions (business logic)
  /db              - Prisma schema and client
  /ui              - Shared UI components (Tamagui/NativeWind)
  /config          - Shared configuration
  /types           - Shared TypeScript types
```

---

## ⚡ Performance Benchmarks

- **Cold starts:** 2-3s per route (Cal.com benchmarks)
- **Dev time reduction:** 60% less boilerplate than MERN
- **Cross-platform savings:** 40% cheaper than separate native apps
- **Type coverage target:** 95%+

---

## 🛠️ Development Tools

### Build System
- Turborepo for monorepo management
- Caching for faster builds
- Parallel task execution

### Code Quality
- ESLint with strict config
- Prettier for formatting
- Husky for pre-commit hooks

### CI/CD
- GitHub Actions for testing
- Vercel/EAS for deployments
- Automated preview environments
