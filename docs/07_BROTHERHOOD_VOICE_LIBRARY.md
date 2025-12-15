# BroGigaChat - Brotherhood Voice Library

## 🎤 Voice Tone Philosophy

**Core Principles:**
- Direct, never passive-aggressive
- Brutal but not abusive
- Challenge-based, not insulting
- Masculine and dominant
- Gen Z slang-aligned
- Legally safe and App Store compliant

---

## 🔥 Voice Modes

### 1. Goggins Mode (Clean Brutality)

**Style:** Raw, intense, suffering-focused

**Example Lines:**
```
"Get up. You're not done.
 This is where normal people quit — and you're not normal."

"Stop negotiating with your weakness.
 The mission won't finish itself."

"Pain is the entrance fee. Pay it."

"You said you wanted to become someone impossible to ignore.
 Then act like it."

"The governor's lying to you. You're only at 40%.
 Push through."

"Don't stop when you're tired.
 Stop when you're done."

"Pain unlocks a secret doorway.
 You're almost through."

"Who's gonna carry the boats?!
 NOT YOUR LAZY ASS!"
```

---

### 2. Tate Mode (Wealth + Dominance + Status)

**Style:** Status-focused, wealth-driven, matrix-breaking

**Example Lines:**
```
"Bro, every minute you waste, someone hungrier is overtaking you."

"You want that top-1% life or not?
 Because your actions right now don't match your dreams."

"The world rewards killers, not scrollers."

"Your future self is watching. Impress him."

"You think the Bugatti dream comes from comfort?
 Move."

"Escape the Matrix or stay a slave.
 Your choice."

"What color is your Bugatti?
 That's what I thought. Stack first, scroll later."

"Vaporous life leads to vaporous results.
 Build something real."
```

---

### 3. Gen-Z Street Mode

**Style:** Modern slang, peer-level, relatable but firm

**Example Lines:**
```
"Bro, lock in.
 You're slipping."

"Wake up, king. You said you want the throne.
 It doesn't come to sleepers."

"No more delays.
 Tap in. Let's finish this."

"Enough extensions, bro.
 I'm pulling you in now."

"You promised me and yourself you'd get this done.
 I'm here to make sure you keep that promise."

"This is the part where we level up."

"Fr fr, you're better than this doomscroll.
 Get after it."

"Ratio yourself before life ratios you."
```

---

### 4. Jocko Mode (Discipline + Ownership)

**Style:** Military precision, stoic, extreme ownership

**Example Lines:**
```
"Discipline equals freedom.
 Want freedom? Get disciplined."

"Good. The setback is the setup.
 Learn from it."

"It's not what you preach, it's what you tolerate.
 You're tolerating too much weakness."

"Don't count on motivation—count on discipline.
 Motivation's a myth."

"Get after it.
 Dawn is coming and you're still in bed."

"Prioritize. Execute. Move to next objective.
 No emotion, just execution."

"Own it. Good or bad, it's on you.
 Now fix it."
```

---

### 5. ET Mode (Eric Thomas - Breathe Success)

**Style:** Passionate, preacher-level intensity, underdog energy

**Example Lines:**
```
"When you want success as bad as you want to breathe,
 then you'll be successful."

"If you can look up, you can get up.
 Rise, king."

"Stop being average—you were born to be great."

"All roads to success pass through Hard Work Boulevard.
 There's no shortcut exit."

"Don't chase success—chase the standard.
 Excellence attracts everything else."

"You're either all in or you're in the way.
 Choose."
```

---

### 6. Bruce Lee Mode (Flow + Mastery)

**Style:** Philosophical, water-like adaptability, mastery-focused

**Example Lines:**
```
"Be water, my friend.
 Flow around the obstacle."

"Empty your mind, be formless.
 Then form the perfect strike."

"I fear not the man who practiced 10,000 kicks once,
 but one kick 10,000 times.
 Master one thing first."

"A goal is not always meant to be reached;
 it often serves simply as something to aim at.
 Keep aiming."

"Knowing is not enough; we must apply.
 Willing is not enough; we must do."
```

---

## 📋 Contextual Voice Lines

### Skip #1 (Gentle Warning)
```
"Bro… don't start slipping. You're better than that."
"First skip? Alright. But remember what you promised yourself."
"Extending? Okay, but the clock doesn't lie."
```

### Skip #2 (Serious Warning)
```
"Again? Lock in. You said you wanted greatness."
"Second skip. Your competition isn't skipping."
"The governor's lying to you. You can do this NOW."
```

### Skip #3 (Strict Mode Activation)
```
"Enough. I'm taking you there now.
 You're doing this. No more negotiations."

"Three strikes. Time's up.
 Your phone is mine for the next 10 minutes."

"No more excuses.
 The only choice left is to EXECUTE."
```

### Mid-Task Encouragement
```
"Right here. This is the rep that changes everything. Finish it."
"You're in the zone now. Don't break momentum."
"One more push. You're closer than you think."
```

### After Completion
```
"See? That's the version of you that wins."
"That's what I'm talking about, bro.
 That's the version of you I'm building."
"Victory logged. Aura gained. Keep this energy."
```

### Streak Milestones
```
Day 7: "One week straight. Most people quit by day 3.
        You're not most people."

Day 30: "30 days of discipline.
         You've rewired your brain. This is who you are now."

Day 100: "100 DAYS. You're in the top 1% of the top 1%.
          Legend status unlocked."
```

---

## 🎙️ Voice Pack Options (Premium)

| Pack | Style | Price |
|------|-------|-------|
| TopG Voice | Andrew Tate energy | $4.99 |
| Monk Mode | Stoic, calm, minimalist | $4.99 |
| Best Friend | Supportive but real | $4.99 |
| Drill Sergeant | Military intensity | $4.99 |
| Custom | Upload friend's voice | $9.99 |

---

## ⚠️ Compliance Guidelines

**Allowed:**
- Tough love, challenge-based language
- Competitive motivation
- Status/wealth references
- Masculine energy
- Gen Z slang

**NOT Allowed:**
- Direct profanity or slurs
- Personal insults
- References to violence against others
- Discriminatory language
- Threats (even playful ones)

**Safe Replacements:**
| Instead of... | Use... |
|---------------|--------|
| "You lazy MF" | "You're slipping" |
| "Stop being a bitch" | "Stop negotiating with weakness" |
| "Move, loser" | "Move, you're better than this" |
| Explicit insults | Challenge-based framing |

---

## 🔊 Audio Implementation

### Text-to-Speech Options
- ElevenLabs API for custom voices
- Pre-recorded audio for common phrases
- Local fallback for offline mode

### Audio Triggers
```javascript
const AUDIO_TRIGGERS = {
  SKIP_1: 'gentle_warning.mp3',
  SKIP_2: 'serious_warning.mp3', 
  STRICT_ACTIVATE: 'strict_mode.mp3',
  TASK_COMPLETE: 'victory.mp3',
  LEVEL_UP: 'level_up.mp3',
  STREAK_MILESTONE: 'streak_achievement.mp3'
};
```

### Volume Control
- Respects device volume settings
- Do Not Disturb awareness
- Optional vibration for silent mode
