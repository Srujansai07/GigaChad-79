# BroGigaChat - UI/UX Design

## 🎨 Design Philosophy

### Core Aesthetic: Dark, Edgy, Powerful

| Aspect | Specification |
|--------|---------------|
| Default Mode | Dark mode (optional light) |
| Color Scheme | Red/black (intensity, power) |
| Design Style | Angular, brutalist (popular with GenZ) |
| Corners | Sharp, not soft rounded |

### Micro-interactions That Hit Different

| Event | Animation |
|-------|-----------|
| Task Complete | Explosive animation + sound |
| Aura Gained | Numbers fly up with particle effects |
| Streak Milestone | Screen shake + celebration |
| Level Up | Full-screen takeover moment |

---

## 📱 Core Screens

### 1. Home Screen

```
┌─────────────────────────────────────┐
│ TOP:                                │
│ ├─ Aura score (large, prominent)    │
│ ├─ Current streak (fire icon)       │
│ └─ Today's completion (5/8)         │
├─────────────────────────────────────┤
│ MIDDLE:                             │
│ ├─ Next 3 tasks (one-tap execute)   │
│ └─ Quick actions: "Add" "Focus"     │
├─────────────────────────────────────┤
│ BOTTOM:                             │
│ ├─ Leaderboard preview              │
│ ├─ Squad status                     │
│ └─ Profile shortcut                 │
└─────────────────────────────────────┘
```

### 2. Task Creation (Voice-First)

```
┌─────────────────────────────────────┐
│                                     │
│  "Yo Bro, set up a tweet about      │
│   productivity at 8pm"              │
│                                     │
├─────────────────────────────────────┤
│  AI interprets:                     │
│  ✓ Action: Post tweet               │
│  ✓ Platform: Twitter                │
│  ✓ Topic: Productivity              │
│  ✓ Time: 8pm                        │
│  ✓ Aura reward: 100                 │
│                                     │
│  [Looks good?] [Edit] [Confirm]     │
│                                     │
└─────────────────────────────────────┘
```

### 3. Notification Design

```
┌─────────────────────────────────────┐
│ [BroGigaChat]                       │
│ 🔥 Time to crush that workout       │
│                                     │
│ You promised yourself this morning. │
│ Let's get it.                       │
│                                     │
│ [Extend 10m] [Extend 30m] [LET'S GO]│
│                                     │
│ Streak: 12 days | Aura: +150        │
└─────────────────────────────────────┘
```

### 4. Strict Mode Takeover

```
┌─────────────────────────────────────┐
│                                     │
│    ████████ STRICT MODE ████████    │
│           ACTIVATED                 │
│                                     │
│   "You've skipped 3 times.          │
│    No more excuses.                 │
│    Your phone is mine for the       │
│    next 10 minutes."                │
│                                     │
│   [Workout app launches]            │
│   [All distractions blocked]        │
│   [Timer: 10:00]                    │
│                                     │
│   "Don't even try to exit.          │
│    Do the work."                    │
│                                     │
└─────────────────────────────────────┘

Color: Full-screen RED alert
Animation: Pulse effect
```

### 5. Leaderboard Screen

```
┌─────────────────────────────────────┐
│ Tabs:                               │
│ [Global] [Country] [City] [Friends] │
├─────────────────────────────────────┤
│ Your position:                      │
│ [#1,234] You (15,670 Aura)          │
│ [↑ 156 from yesterday]              │
├─────────────────────────────────────┤
│ Top 10:                             │
│ 1. @sigmagrinder (187K) 🏆          │
│ 2. @hustleking (156K) 🥈            │
│ 3. @disciplinedaf (134K) 🥉         │
│ 4. @alphamentality (89K)            │
│ 5. @grindneverstops (67K)           │
│ ...                                 │
│                                     │
│ [Challenge #1] [View Profile]       │
└─────────────────────────────────────┘
```

### 6. Profile Screen

```
┌─────────────────────────────────────┐
│         [Avatar]                    │
│      Username: @yourhandle          │
│      Level: Alpha (Level 5)         │
│      Aura: 45,670                   │
│      Rank: #1,234 Global            │
├─────────────────────────────────────┤
│ Badges:                             │
│ [Founder] [100-Day Streak] [Squad]  │
├─────────────────────────────────────┤
│ Stats:                              │
│ - Tasks completed: 1,247            │
│ - Current streak: 47 days           │
│ - Strict Mode survived: 23 times    │
│ - Success rate: 87%                 │
├─────────────────────────────────────┤
│ [Edit Profile] [Share] [Settings]   │
└─────────────────────────────────────┘
```

---

## 🎯 Notification UX Flow

### Standard Flow (3-Strike System)

```
STRIKE 1 (Gentle):
┌─────────────────────────────────────┐
│ 🔔 BroGigaChat                      │
│ Time for your task                  │
│ [Extend 10m] [Extend 30m] [Do It]   │
└─────────────────────────────────────┘

STRIKE 2 (Warning):
┌─────────────────────────────────────┐
│ ⚠️ BroGigaChat                      │
│ "Bro... don't start slipping.       │
│  You're better than that."          │
│                                     │
│ Skip #2 - 1 more until Strict Mode  │
│ [-50 Aura penalty applied]          │
│                                     │
│ [Extend once more] [Do It NOW]      │
└─────────────────────────────────────┘

STRIKE 3 (Activation):
┌─────────────────────────────────────┐
│ 🔴 STRICT MODE ACTIVATED            │
│                                     │
│ "Enough. I'm taking you there now.  │
│  You're doing this.                 │
│  No more negotiations."             │
│                                     │
│ [App auto-opens in 3... 2... 1...]  │
└─────────────────────────────────────┘
```

---

## 🖌️ Color Palette

| Use Case | Color | Hex |
|----------|-------|-----|
| Background | Deep Black | #0A0A0A |
| Primary Action | Fierce Red | #DC2626 |
| Secondary | Dark Gray | #1F1F1F |
| Aura/Success | Gold | #EAB308 |
| Streak Fire | Orange | #EA580C |
| Level Colors | Per tier | See hierarchy |
| Text Primary | White | #FFFFFF |
| Text Secondary | Gray | #9CA3AF |
| Warning | Yellow | #FBBF24 |
| Danger/Strict | Red | #EF4444 |

---

## 📐 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headlines | Inter/Outfit | Bold | 24-32px |
| Body Text | Inter | Regular | 14-16px |
| Aura Numbers | Inter | Black | 28-48px |
| Captions | Inter | Medium | 12px |
| Bro Messages | Custom/Italic | Bold | 18px |

---

## 🎬 Animation Specifications

### Task Complete Celebration
```javascript
animation: {
  type: 'explosion',
  particles: 20,
  colors: ['#EAB308', '#DC2626', '#EA580C'],
  duration: 600,
  sound: 'victory_chime.mp3'
}
```

### Aura Counter
```javascript
animation: {
  type: 'countUp',
  duration: 800,
  easing: 'easeOutExpo',
  particles: true
}
```

### Strict Mode Pulse
```javascript
animation: {
  type: 'pulse',
  color: '#DC2626',
  interval: 500,
  duration: 'until_complete'
}
```

### Level Up
```javascript
animation: {
  type: 'fullscreen_takeover',
  glowColor: levelInfo.color,
  particles: 100,
  sound: 'level_up.mp3',
  duration: 2000
}
```

---

## 📱 Component Library (shadcn/ui Based)

### Custom Components Needed

1. **BroNotification** - Animated notification card with skip counter
2. **StrictOverlay** - Full-screen red takeover
3. **AuraCounter** - Animated number display
4. **StreakBadge** - Fire icon with day count
5. **TaskCard** - Task display with quick actions
6. **LeaderboardRow** - Ranked user display
7. **ProfileAvatar** - Level-colored avatar
8. **ProgressBar** - XP to next level
9. **BrotherhoodBadge** - Achievement badges
10. **VoiceInput** - Voice-to-task component

---

## 📐 Responsive Breakpoints

| Device | Breakpoint | Layout |
|--------|------------|--------|
| Mobile | 0-640px | Single column, bottom nav |
| Tablet | 641-1024px | Two column optional |
| Desktop | 1025px+ | Full sidebar navigation |

---

## 🌓 Theme System

### Dark Mode (Default)
- Preferred for "intensity" feel
- Reduces eye strain for late-night grinders
- Matches "Monk Mode" aesthetic

### Light Mode (Optional)
- For users who prefer it
- Maintains color intensity
- Keeps red/black accent scheme

### Theme Toggle Location
- Profile > Settings > Appearance
- Respects system preference by default
