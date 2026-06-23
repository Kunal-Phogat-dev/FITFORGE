# FitForge (v3.0) 🏋️‍♂️

FitForge is a premium, production-grade AI Fitness Coach SaaS built for personal trainers. It allows coaches to manage their client roster, track daily nutrition and progress, and instantly generate highly personalized, science-backed workout plans using Google's Gemini AI.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Analytics**: Recharts
- **State Management**: Zustand
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **AI Integration**: Google Gemini API (`@google/genai`)

---

## 🛠️ Local Setup Instructions

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add the following keys. You will need to obtain these from your Supabase Dashboard and Google AI Studio:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Google Gemini API
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗄️ Database Setup (Supabase)

For true multi-tenancy and data persistence, run the following SQL script in your Supabase SQL Editor. This will create the `clients` and `workouts` tables and enforce Row Level Security (RLS) so coaches can only see their own data.

```sql
-- Create clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  goal TEXT NOT NULL,
  last_session TEXT DEFAULT 'Never',
  progress INTEGER DEFAULT 0,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create workouts table
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  sections JSONB NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Create policies for isolated multi-tenancy
CREATE POLICY "Coaches can view own clients" ON clients FOR SELECT USING (auth.uid() = coach_id);
CREATE POLICY "Coaches can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = coach_id);
CREATE POLICY "Coaches can update own clients" ON clients FOR UPDATE USING (auth.uid() = coach_id);
CREATE POLICY "Coaches can delete own clients" ON clients FOR DELETE USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can view own workouts" ON workouts FOR SELECT USING (auth.uid() = coach_id);
CREATE POLICY "Coaches can insert own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = coach_id);
CREATE POLICY "Coaches can update own workouts" ON workouts FOR UPDATE USING (auth.uid() = coach_id);
CREATE POLICY "Coaches can delete own workouts" ON workouts FOR DELETE USING (auth.uid() = coach_id);
```

---

## 🌍 Vercel Deployment Guide

FitForge is optimized for Vercel deployment. 

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your FitForge repository.
4. **Important:** Before clicking Deploy, expand the **Environment Variables** section and add all the keys from your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
5. Click **Deploy**. Vercel will automatically build the Next.js app and provide you with a live, production URL!
