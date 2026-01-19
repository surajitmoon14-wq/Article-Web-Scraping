# Article Scraper Frontend

Next.js frontend for the Article Scraper web application.

## Features

- Modern, responsive UI with Tailwind CSS
- Beautiful animations with Framer Motion
- Dark theme with vibrant gradient accents
- Real-time article scraping control
- AI-powered article summaries
- Search and filter functionality
- Bookmark management
- Mobile-responsive design

## Tech Stack

- Next.js 15+ with React 19+
- TypeScript
- Tailwind CSS v3
- Framer Motion
- Axios for API calls
- Lucide React icons
- shadcn/ui components

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (if needed):
```bash
cp .env.local.example .env.local
```

The default `.env.local` is already configured to connect to `http://localhost:8000`.

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Pages

- `/` - Landing page with hero section and feature overview
- `/dashboard` - Scraping controls and statistics
- `/articles` - Browse all articles with search and filters
- `/articles/[id]` - Individual article detail with AI summary
- `/bookmarks` - Saved articles collection

## Project Structure

```
frontend/
├── app/
│   ├── articles/
│   │   ├── [id]/
│   │   │   └── page.tsx          # Article detail page
│   │   └── page.tsx              # Articles listing
│   ├── bookmarks/
│   │   └── page.tsx              # Bookmarks page
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard with controls
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles
│   └── lib/
│       ├── api.ts                # API client
│       └── utils.ts              # Utility functions
├── components/
│   ├── ui/                       # UI components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── Navbar.tsx                # Navigation bar
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## API Integration

The frontend communicates with the backend API via the `api.ts` module. Make sure the backend server is running on `http://localhost:8000` (or configure via `NEXT_PUBLIC_API_URL`).

## Styling

The application uses a dark theme with vibrant gradients. Key design tokens:

- **Primary gradient**: Purple → Pink → Blue
- **Background**: Dark gradient (dark purple/indigo tones)
- **Cards**: Semi-transparent with gradient borders
- **Animations**: Smooth transitions and hover effects

All colors and animations are defined in `tailwind.config.ts` and `globals.css`.
