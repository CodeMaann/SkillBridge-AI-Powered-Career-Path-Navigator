# SkillBridge — AI-Powered Career Path Navigator

Next.js 15 app with Firebase auth, Prisma + PostgreSQL, and **Claude AI (Anthropic)** powering all intelligent features.

## What's New

### AI Roadmap Generator (Enhanced)
- 4-step adaptive form: Background → Skills → Goal → Timeline
- Education, field of study, experience, skill chips, role chips, industry, timeline, hours/week
- Powered by Claude (replaced Gemini). Returns phased roadmap, skill gaps, salary, resources, tips
- Save roadmaps to PostgreSQL via Prisma

### ATS Resume Checker (New)
- Paste text or upload .txt/.md resume
- Optional job description for targeted scoring
- Returns 5 score rings, section analysis, keyword gaps, priority issues, improvement examples

### Updated Dashboard
- Shows both tools as cards
- Displays saved roadmaps from the database

---

## Quick Start

### 1. Install
```bash
npm install
```

### 2. Configure
```bash
cp .env.example .env.local
```
Fill in:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here   # from console.anthropic.com
DATABASE_URL=postgresql://user:pass@localhost:5432/skillbridge
```

### 3. Database
```bash
createdb skillbridge
npx prisma migrate dev --name init
```

### 4. Run
```bash
npm run dev
# Open http://localhost:3000
```

---

## Routes

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing page | No |
| `/login` | Google OAuth + Admin | No |
| `/user-dashboard` | Dashboard hub | Yes |
| `/roadmap-generator` | AI roadmap generator | Yes |
| `/ats-checker` | AI ATS checker | Yes |
| `/admin-dashboard` | Admin stats | Admin |

**Admin login:** `admin@skillbridge.com` / `AdminSecret123!`

---

## API Routes

All AI calls are **server-side** — API key is never exposed to browser.

- `POST /api/generate-roadmap` — Claude generates career roadmap
- `POST /api/ats-check` — Claude analyzes resume for ATS
- `POST /api/users` — Firebase → Prisma user sync
- `POST /api/roadmaps` — Save roadmap
- `GET /api/roadmaps/:userId` — Fetch saved roadmaps
- `GET /api/admin/stats` — Admin statistics

---

## Tech Stack
- **Framework:** Next.js 15 App Router
- **Auth:** Firebase (Google OAuth)
- **Database:** PostgreSQL + Prisma
- **AI:** Claude Sonnet (Anthropic)
- **UI:** React 19, Tailwind CSS, shadcn/ui, Motion
