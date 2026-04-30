# 🚀 SkillBridge — AI-Powered Career Path Navigator

Next.js 15 app with Firebase auth, Prisma + PostgreSQL, and **Google Gemini AI** powering all intelligent features[cite: 6].

## What's New

### 🗺️ AI Roadmap Generator
- 4-step adaptive form: Background → Skills → Goal → Timeline[cite: 6].
- Collects education, field of study, experience, skill chips, role chips, industry, timeline, and hours/week[cite: 6].
- Powered by Gemini AI. Returns phased roadmap, skill gaps, salary, resources, and tips[cite: 6].
- Save roadmaps to PostgreSQL via Prisma[cite: 6].

### 🔍 ATS Resume Checker
- Paste text or upload .txt/.md resume[cite: 6].
- Optional job description for targeted scoring[cite: 6].
- Returns score rings, section analysis, keyword gaps, priority issues, and improvement examples[cite: 6].

### ✨ Resume Builder
- Craft a professional, ATS-optimized resume from scratch using Gemini.

### 📊 Updated Dashboard
- Shows all tools as accessible cards[cite: 6].
- Displays saved roadmaps dynamically from the database[cite: 6].

---

## Quick Start

### 1. Install
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/skillbridge"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key_here"

# Firebase Auth
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_firebase_project_id"
\`\`\`

### 3. Database Setup
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 4. Run
\`\`\`bash
npm run dev
# Open http://localhost:3000
\`\`\`

---

## Routes

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing page | No[cite: 6] |
| `/login` | Google OAuth + Admin | No[cite: 6] |
| `/user-dashboard` | Dashboard hub | Yes[cite: 6] |
| `/roadmap-generator` | AI roadmap generator | Yes[cite: 6] |
| `/roadmap/[id]` | View saved roadmaps | Yes |
| `/ats-checker` | AI ATS checker | Yes[cite: 6] |
| `/resume-builder` | AI Resume Builder | Yes |
| `/admin-dashboard` | Admin stats | Admin[cite: 6] |

**Admin login:** `admin@skillbridge.com` / `AdminSecret123!`[cite: 6]

---

## API Routes

All AI calls are **server-side** — API key is never exposed to the browser[cite: 6].

- `POST /api/generate-roadmap` — Gemini generates career roadmap[cite: 6].
- `POST /api/ats-check` — Gemini analyzes resume for ATS compatibility[cite: 6].
- `POST /api/users` — Firebase → Prisma user sync[cite: 6].
- `POST /api/roadmaps` — Save roadmap to database[cite: 6].
- `GET /api/roadmaps/:userId` — Fetch all saved roadmaps for a user[cite: 6].
- `GET /api/roadmaps/single/:id` — Fetch a specific saved roadmap.
- `GET /api/admin/stats` — Admin statistics[cite: 6].

---

## Tech Stack
- **Framework:** Next.js 15 App Router[cite: 6]
- **Auth:** Firebase (Google OAuth)[cite: 6]
- **Database:** PostgreSQL + Prisma[cite: 6]
- **AI:** Google Gemini 
- **UI:** React 19, Tailwind CSS, shadcn/ui, Motion[cite: 6]