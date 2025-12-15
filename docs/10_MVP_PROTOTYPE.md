# BroGigaChat - MVP Prototype Reference

## 📱 Prototype Overview

A functional React-based prototype demonstrating the core BroGigaChat experience.

**Tech Stack:**
- React with Hooks (useState, useEffect)
- Lucide React for icons
- Local storage for persistence (window.storage API)
- Tailwind CSS for styling

---

## 🎯 Core Features Implemented

### 1. User State Management
```javascript
const [user, setUser] = useState({
  username: 'NewGrinder',
  aura: 0,
  level: 1,
  streak: 0,
  lastActive: new Date().toISOString(),
  rank: 0,
  tasksCompleted: 0,
  strictModeCount: 0
});
```

### 2. Level Calculation System
```javascript
const getLevel = (aura) => {
  if (aura < 1000) return { level: 1, name: 'Rookie', color: 'text-gray-400' };
  if (aura < 5000) return { level: 2, name: 'Grinder', color: 'text-blue-400' };
  if (aura < 15000) return { level: 3, name: 'Hustler', color: 'text-purple-400' };
  if (aura < 50000) return { level: 4, name: 'Alpha', color: 'text-yellow-400' };
  if (aura < 150000) return { level: 5, name: 'Sigma', color: 'text-red-400' };
  return { level: 6, name: 'TopG', color: 'text-orange-400' };
};
```

### 3. Task Management
```javascript
const task = {
  id: Date.now(),
  title: string,
  description: string,
  app: string,           // Target app
  baseAura: 100,         // Base reward
  created: ISO8601,
  completed: boolean,
  skips: number,
  scheduledFor: ISO8601,
  completedAt: ISO8601,
  auraGained: number
};
```

### 4. Skip & Extend System
```javascript
const handleExtend = (taskId, minutes) => {
  const currentSkips = skipCount[taskId] || 0;
  const newSkips = currentSkips + 1;
  
  // Update skip count
  setSkipCount({ ...skipCount, [taskId]: newSkips });
  
  // Reschedule task
  setTasks(tasks.map(t => 
    t.id === taskId 
      ? { ...t, scheduledFor: new Date(Date.now() + minutes * 60000).toISOString(), skips: newSkips }
      : t
  ));

  // Deduct aura for skipping
  setUser({ ...user, aura: Math.max(0, user.aura - 50) });

  // Check if strict mode should activate
  if (newSkips >= 3) {
    activateStrictMode(task);
  }
};
```

### 5. Strict Mode Activation
```javascript
const activateStrictMode = (task) => {
  setStrictModeActive(true);
  setActiveNotification(null);
  
  // Auto-complete after 3 seconds (simulating forced execution)
  setTimeout(() => {
    completeTask(task.id, true);
    setStrictModeActive(false);
  }, 3000);
};
```

### 6. Aura Reward Calculation
```javascript
const completeTask = (taskId, fromStrict = false) => {
  const task = tasks.find(t => t.id === taskId);
  const skips = skipCount[taskId] || 0;
  
  // Calculate aura reward with multipliers
  let auraGain = task.baseAura || 100;
  if (skips === 0) auraGain *= 2;        // First notification bonus
  if (fromStrict) auraGain *= 1.5;       // Strict mode bonus
  if (user.streak > 7) auraGain *= 1.5;  // Streak bonus
  
  auraGain = Math.floor(auraGain);
  
  // Update user stats
  setUser({
    ...user,
    aura: user.aura + auraGain,
    tasksCompleted: user.tasksCompleted + 1,
    streak: user.streak + 1,
    strictModeCount: fromStrict ? user.strictModeCount + 1 : user.strictModeCount,
    lastActive: new Date().toISOString()
  });
};
```

---

## 📱 Screens Implemented

### 1. Onboarding Screen
- App branding and tagline
- Feature highlights (One-Tap Action, Strict Mode, Aura Points)
- Username input
- "LET'S GO 🔥" CTA button

### 2. Home Screen
**Top Bar:**
- User avatar with initial
- Username and level display
- Aura points counter
- Streak indicator

**Stats Grid:**
- Active tasks count
- Completed tasks count
- Strict Mode count ("Forced")

**Task List:**
- Active tasks with title, description, aura reward
- Skip warning indicator
- "Test Notification" button
- "Complete Now" button

**Completed Section:**
- Today's completed tasks
- Aura earned per task

### 3. Leaderboard Screen
- Your rank card (Coming Soon for new users)
- Mock leaderboard data
- Top 5 display with rank colors (gold, silver, bronze)
- Username, level, and aura for each entry

### 4. Profile Screen
- Large avatar with user initial
- Username and level display
- Total aura points
- Stats breakdown:
  - Tasks completed
  - Current streak
  - Strict Modes survived
  - Success rate percentage
- Badges section (Founder, 7-Day Streak, Forced)
- Reset Progress button

---

## 🔔 Notification System

### Notification Card UI
```
┌─────────────────────────────────────┐
│ BROGIGACHAT                         │
│ [Task Title]                        │
│ [Task Description]                  │
│                                     │
│ Streak: X days | Aura: +XXX         │
│                                     │
│ ⚠️ Skip #X - Y until Strict Mode   │
│                                     │
│ [+10min] [+30min] [DO IT]          │
└─────────────────────────────────────┘
```

### Strict Mode Overlay
```
┌─────────────────────────────────────┐
│         STRICT MODE ACTIVATED       │
│                                     │
│    ⚠️ [Bouncing Alert Icon]         │
│                                     │
│    You've skipped 3 times.          │
│    No more excuses.                 │
│    DO THE WORK NOW.                 │
│                                     │
│    (Forcing app open in 3 secs...)  │
└─────────────────────────────────────┘
```

---

## 🗂️ Data Persistence

### Storage Keys
```javascript
const STORAGE_KEYS = {
  USER: 'bro_user',
  TASKS: 'bro_tasks', 
  SKIPS: 'bro_skips',
  ONBOARDING: 'bro_onboarding'
};
```

### Load/Save Cycle
```javascript
// Load on mount
useEffect(() => {
  const loadData = async () => {
    const userData = await window.storage.get('bro_user');
    const tasksData = await window.storage.get('bro_tasks');
    const skipData = await window.storage.get('bro_skips');
    const onboardingDone = await window.storage.get('bro_onboarding');
    
    if (userData?.value) setUser(JSON.parse(userData.value));
    if (tasksData?.value) setTasks(JSON.parse(tasksData.value));
    if (skipData?.value) setSkipCount(JSON.parse(skipData.value));
    if (onboardingDone?.value) setShowOnboarding(false);
  };
  loadData();
}, []);

// Save on state change
useEffect(() => {
  const saveData = async () => {
    await window.storage.set('bro_user', JSON.stringify(user));
    await window.storage.set('bro_tasks', JSON.stringify(tasks));
    await window.storage.set('bro_skips', JSON.stringify(skipCount));
  };
  if (!showOnboarding) saveData();
}, [user, tasks, skipCount, showOnboarding]);
```

---

## 🎨 Design Tokens Used

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Background | black | App background |
| Primary | red-600 | CTAs, active states |
| Primary Hover | red-700 | Button hover |
| Surface | gray-900 | Cards, modals |
| Surface Alt | gray-800 | Inputs, secondary buttons |
| Border | gray-700 | Input borders |
| Streak | orange-400/500 | Streak indicators |
| Aura | yellow-400 | Aura points display |
| Success | green-400 | Completed items |

### Typography
- Bold for headings and CTAs
- Regular for body text
- XS/SM sizes for captions and labels

---

## 🧭 Navigation Structure

```
Bottom Navigation:
├── Tasks (Target icon) → Home Screen
├── Ranks (Trophy icon) → Leaderboard Screen
└── Profile (Users icon) → Profile Screen

Modals:
├── Add Task Modal
│   ├── Title input
│   ├── Description input
│   └── App selector dropdown
└── Notification Card (overlays)
```

---

## 📝 Mock Data

### Leaderboard Mock
```javascript
const leaderboard = [
  { rank: 1, username: 'SigmaGrinder', aura: 187000, level: 'TopG' },
  { rank: 2, username: 'HustleKing', aura: 156000, level: 'TopG' },
  { rank: 3, username: 'DisciplinedAF', aura: 134000, level: 'Sigma' },
  { rank: 4, username: 'AlphaMentality', aura: 89000, level: 'Alpha' },
  { rank: 5, username: 'GrindNeverStops', aura: 67000, level: 'Alpha' },
];
```

### App Options
```javascript
const APP_OPTIONS = [
  'Twitter',
  'Instagram', 
  'YouTube',
  'Gym App',
  'Notes',
  'Other'
];
```

---

## 🔄 State Flow Diagram

```
User Opens App
    │
    ├─► [showOnboarding = true]
    │       │
    │       ▼
    │   Onboarding Screen
    │       │
    │       ▼ (Enter username + confirm)
    │   
    ▼
Home Screen (currentScreen = 'home')
    │
    ├─► Add Task → showAddTask modal
    │       │
    │       ▼
    │   Create task → tasks.push(newTask)
    │
    ├─► Test Notification → setActiveNotification(task)
    │       │
    │       ├─► [Extend] → skipCount++ → check strict mode
    │       │       │
    │       │       ▼ (skipCount >= 3)
    │       │   activateStrictMode → strictModeActive = true
    │       │       │
    │       │       ▼ (3 second timer)
    │       │   completeTask(id, fromStrict=true)
    │       │
    │       └─► [DO IT] → completeTask(id)
    │
    ├─► Navigate to Leaderboard (currentScreen = 'leaderboard')
    │
    └─► Navigate to Profile (currentScreen = 'profile')
            │
            └─► Reset Progress → clear all storage → reload
```

---

## 📁 Source File Location

The complete MVP prototype code is located in:
```
DoXs/C AI MVP
```

This file contains the full React component implementation ready for reference during production development.
