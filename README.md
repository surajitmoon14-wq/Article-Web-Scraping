# Article Scraper - AI-Powered Web Application

A modern full-stack web application for scraping articles from The Guardian with AI-powered summaries and intelligent content management.

## 🌟 Features

### Backend (FastAPI)
- **RESTful API** with comprehensive endpoints for article management
- **Guardian API Integration** - Scrape articles from The Guardian's technology section
- **Groq AI Integration** - Generate intelligent article summaries
- **SQLite Database** - Persistent storage with SQLModel
- **Background Processing** - Async scraping without blocking
- **CORS Support** - Seamless frontend integration
- **Full-text Search** - Search articles by title and content
- **Bookmark System** - Save and manage favorite articles

### Frontend (Next.js)
- **Modern UI** - Beautiful dark theme with vibrant gradient accents
- **Smooth Animations** - Powered by Framer Motion
- **Responsive Design** - Mobile-first approach
- **Real-time Dashboard** - Monitor scraping status and statistics
- **AI Summary Display** - View Groq-generated insights
- **Search & Filters** - Find articles quickly
- **Bookmark Management** - Save articles for later

## 🚀 Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework
- **SQLModel/SQLAlchemy** - Type-safe database ORM
- **Groq Python SDK** - AI-powered summarization
- **Requests & BeautifulSoup4** - Web scraping
- **Python-dotenv** - Environment management

### Frontend
- **Next.js 15+** - React framework with app router
- **React 19+** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS v3** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

## 📦 Project Structure

```
article-scraper/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI application
│   ├── models.py           # Database models
│   ├── scraping_service.py # Guardian API integration
│   ├── ai_service.py       # Groq AI integration
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment variables
│   └── .env.example        # Environment template
├── frontend/               # Next.js frontend
│   ├── app/
│   │   ├── articles/       # Article pages
│   │   ├── bookmarks/      # Bookmarks page
│   │   ├── dashboard/      # Dashboard
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Landing page
│   │   └── lib/            # API client & utilities
│   ├── components/
│   │   ├── ui/             # UI components
│   │   └── Navbar.tsx      # Navigation
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.local          # Frontend env variables
├── saved_articles/         # Legacy saved articles
├── NoteBook_Experiment/    # Development notebooks
├── app.py                  # Legacy CLI scraper
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
GUARDIAN_API_KEY=your_guardian_api_key
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=sqlite:///./articles.db
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

5. Start the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (if needed):
```bash
cp .env.local.example .env.local
```

The default `.env.local` is already configured to connect to `http://localhost:8000`.

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### 1. Start Scraping Articles
- Navigate to the Dashboard (`/dashboard`)
- Click "Start Scraping" to fetch articles from The Guardian
- The scraper will fetch 10 articles from the Technology & AI section

### 2. Browse Articles
- Visit the Articles page (`/articles`)
- Use the search bar to find specific articles
- Filter by bookmarks using the filter dropdown

### 3. View Article Details
- Click on any article card to view the full content
- The sidebar shows AI-generated summaries (if available)
- Click "Generate Summary" to create an AI summary using Groq

### 4. Manage Bookmarks
- Click the bookmark icon on any article to save it
- Access all saved articles from the Bookmarks page (`/bookmarks`)
- Remove bookmarks when you're done reading

## 🎨 Design System

### Color Palette
- **Primary Gradient**: Purple (#667eea) → Pink (#764ba2) → Blue (#f093fb)
- **Background**: Dark gradient from #0f0c29 to #302b63 to #24243e
- **Text**: White (#ffffff) for primary, gray for secondary

### Components
- **Cards**: Semi-transparent with gradient borders and glow effects
- **Buttons**: Gradient backgrounds with hover states
- **Inputs**: Dark backgrounds with focus rings
- **Animations**: Smooth transitions, fade-ins, hover effects

## 🔧 API Endpoints

### Scraping
- `POST /api/scrape` - Trigger article scraping
- `GET /api/health` - Health check

### Articles
- `GET /api/articles` - List all articles (with pagination/filters)
- `GET /api/articles/{id}` - Get single article
- `GET /api/search?q=query` - Full-text search
- `GET /api/bookmarks` - Get bookmarked articles
- `GET /api/stats` - Get statistics

### AI Features
- `POST /api/articles/{id}/summarize` - Generate AI summary

### Bookmarks
- `POST /api/articles/{id}/bookmark` - Toggle bookmark

## 📝 Environment Variables

### Backend (.env)
```env
GUARDIAN_API_KEY=your_guardian_api_key
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=sqlite:///./articles.db
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Backend
Build and run with:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
Build and start with:
```bash
cd frontend
npm run build
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Hema Kalyan Murapaka - [kalyanmurapaka274@gmail.com](mailto:kalyanmurapaka274@gmail.com)

## 🙏 Acknowledgements

- [The Guardian API](https://open-platform.theguardian.com/) for providing the article data
- [Groq](https://groq.com/) for AI-powered summarization
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for beautiful animations
