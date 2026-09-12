# SocialPilot AI — Your AI Marketing Manager

**SocialPilot AI** is an AI-powered digital marketing assistant and Instagram content publishing SaaS for entrepreneurs and small businesses.

An entrepreneur connects their Instagram Professional account, completes intelligent onboarding, and the AI generates a personalized **7-day Instagram content plan**. The entrepreneur reviews, edits, and approves the content. Approved content is automatically scheduled and published to Instagram using Meta's official Graph APIs.

---

## Key Features

- 🤖 **Your AI Marketing Manager**: Tailored 7-day content plans tailored specifically to your business category (Restaurant, Real Estate, Fashion, Fitness, Tech, etc.).
- 🧠 **Brand Intelligence & Voice Memory**: Persistent `BrandProfile` and `brand_preferences` system that learns from manual text edits to avoid generic AI buzzwords ("Elevate", "Unlock", "Unleash").
- 🔌 **Decoupled `AIProvider` Abstraction**: Swap between built-in Smart Local Engine, OpenAI (`gpt-4o`), or Google Gemini via settings without tightly coupling code.
- 📱 **10-Step Interactive Onboarding**: Captures business details, category, audience, location, products, marketing goals, brand personality multi-select, and content preferences.
- 🎨 **Live Content Editor & AI Regeneration**: Split-view editor featuring a live Instagram mockup, editable fields, custom single-item AI regeneration prompts ("Make it shorter", "Make it more premium"), and auto-save learning.
- 📅 **7-Day Visual Calendar & Approve All**: Color-coded status cards (`DRAFT`, `APPROVED`, `SCHEDULED`, `PROCESSING`, `PUBLISHED`, `FAILED`) with confirmation modal for 1-click **Approve All**.
- 🔐 **Official Meta Instagram Integration**: Isolated `metaInstagramService` using official Meta Graph API v19.0 endpoints for single images, carousels, and Reels.
- 📊 **Analytics & AI Weekly Strategy Report**: Performance metrics, engagement breakdowns, AI Insights, and Weekly Strategy Reports ("What worked", "What didn't", "Recommended changes").

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React
- **Backend / API**: Next.js / Node Server Handlers & Vite API Services
- **Database**: Supabase PostgreSQL (`supabase_schema.sql` included)
- **Authentication**: Supabase Auth with Local Auth Fallback
- **Storage**: Supabase Storage
- **AI Abstraction**: Replaceable `AIProvider` (Local Engine, OpenAI, Gemini)
- **Instagram Publishing**: Meta Graph API v19.0 Content Publishing API

---

## Environment Variables Setup

Copy `.env.example` to `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
META_REDIRECT_URI=http://localhost:5173/auth/meta/callback
VITE_AI_PROVIDER=mock # mock | openai | gemini
OPENAI_API_KEY=
GEMINI_API_KEY=
```

---

## Local Development Quickstart

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## Database Setup (Supabase)

1. Open your Supabase Dashboard -> **SQL Editor**.
2. Run the included [`supabase_schema.sql`](file:///C:/Users/Acer%20Nitro%20Anv%2015/.gemini/antigravity-ide/scratch/socialpilot-ai/supabase_schema.sql) script.
3. This creates all necessary tables (`businesses`, `brand_profiles`, `brand_preferences`, `social_accounts`, `posts`, `publisher_logs`, `scheduled_posts`, `post_analytics`) with multi-tenant Row Level Security (RLS).

---

## Meta Developer Setup & Instagram OAuth

1. Go to [developers.facebook.com](https://developers.facebook.com/) and create a **Business App**.
2. Add **Instagram Graph API** and **Facebook Login for Business** products.
3. In Facebook Login Settings, add your OAuth Redirect URI:
   `http://localhost:5173/auth/meta/callback`
4. Request permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
5. Ensure your Instagram account is a **Professional Account (Business or Creator)** linked to a Facebook Page.

---

## License

MIT License. Built for production deployment.
