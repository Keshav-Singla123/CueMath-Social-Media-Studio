# 🎨 Cuemath Social Media Studio

A beautiful AI-powered social media creative studio built with React + Vite + Groq AI.

---

## ⚡ Quick Deploy (15 minutes)

### Step 1 — Install dependencies locally (to verify it works)
```bash
npm install
npm run dev
```
Open http://localhost:5173 — but note: API calls won't work locally without a proxy.
For local testing, temporarily hardcode your key in `src/utils/groq.js` (change `/api/generate` to call Groq directly).

---

### Step 2 — Push to GitHub
```bash
git init
git add .
git commit -m "Cuemath Social Studio"
git remote add origin https://github.com/YOUR_USERNAME/social-media-studio.git
git push -u origin main
```

---

### Step 3 — Deploy to Vercel (FREE)

1. Go to **vercel.com** → Sign up with GitHub
2. Click **"Add New Project"** → Import your repo
3. Framework: **Vite** (auto-detected)
4. Click **"Environment Variables"** → Add:
   - Key: `GROQ_API_KEY`
   - Value: `gsk_your_actual_groq_key_here`
5. Click **Deploy**

✅ You get a URL like: `https://social-studio.vercel.app`

---

## 🏗️ Project Structure

```
social-media-studio/
├── api/
│   └── generate.js          # Vercel serverless function (hides your API key)
├── src/
│   ├── components/
│   │   ├── SlideCanvas.jsx   # Renders individual slides
│   │   ├── CarouselPreview.jsx # Carousel navigation
│   │   └── Toast.jsx         # Notification component
│   ├── utils/
│   │   ├── groq.js           # Groq API integration
│   │   ├── slideUtils.js     # Color/style utilities
│   │   └── export.js         # PNG + ZIP export
│   ├── App.jsx               # Main application
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── vite.config.js
├── vercel.json               # Vercel routing config
└── package.json
```

---

## ✨ Features

- **3 Formats**: Instagram Post (1:1), Story (9:16), Carousel (6 slides)
- **AI Generation**: Groq AI (Llama 3 70B) generates structured content
- **Cuemath Brand**: Purple (#6C3AED) + Gold (#F9A825) design system
- **Carousel Storytelling**: Hook → Build → Solution → CTA arc
- **Inline Editing**: Click any text on a slide to edit it
- **Regenerate Slide**: Regenerate just one slide without losing the rest
- **Color Themes**: 3 preset themes to switch between
- **Export PNG**: Export current slide as PNG
- **Export ZIP**: Export all carousel slides as a ZIP
- **Zero Cost**: Runs on Vercel free tier + Groq free/paid tier

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key (get at console.groq.com) |

---

## 🎯 How It Works

1. User types a rough idea (messy, human language)
2. App sends idea + format to `/api/generate` (Vercel serverless)
3. Serverless function calls Groq API with structured prompt
4. Groq returns JSON with headlines, subtext, emojis, slide roles
5. React renders beautiful CSS-designed slides matching Cuemath brand
6. User can edit text inline, regenerate slides, switch themes, export

---

Built for Cuemath Product Design Assignment 🚀
