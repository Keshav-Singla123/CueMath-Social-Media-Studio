# Cuemath Social Media Studio

AI-powered social content generator for education brands and creators.
Build carousel posts, single posts, and stories with editable slides, caption generation, and export tools.

## Overview

Cuemath Social Media Studio helps you turn a rough content idea into polished social creatives in seconds.

What you can do:
- Generate content in 3 formats: Carousel, Post, Story
- Edit generated text directly inside slides
- Regenerate a single carousel slide
- Generate Instagram-ready captions with hashtags
- Export one slide as PNG
- Export all carousel slides as ZIP

## Tech Stack

- React 18
- Vite 5
- Lucide React
- html2canvas
- JSZip

## Features

- AI content generation with strict JSON output parsing
- Multi-format layout handling
- Theme presets for visual styling
- Local history restore panel
- Toast notifications for user feedback
- Keyboard shortcut support (Ctrl/Cmd + Enter to generate)
- Caption generation panel with copy-to-clipboard
- Client-side image and ZIP export

## Project Structure

social-media-studio/
- api/
  - generate.js
- src/
  - components/
    - SlideCanvas.jsx
    - CarouselPreview.jsx
    - CaptionPanel.jsx
    - HistoryPanel.jsx
    - Toast.jsx
  - utils/
    - groq.js
    - export.js
    - slideUtils.js
  - App.jsx
  - main.jsx
  - index.css
- index.html
- package.json
- vite.config.js
- vercel.json

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Installation

~~~bash
npm install