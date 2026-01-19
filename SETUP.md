# Quick Setup Guide

This guide will help you set up and run the Article Scraper web application in a few minutes.

## Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- npm (comes with Node.js)

## Step 1: Get API Keys

### Guardian API Key
1. Visit [The Guardian API Developer Portal](https://open-platform.theguardian.com/access/)
2. Sign up or log in
3. Create a new application
4. Copy your API key

### Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy your API key

## Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
```

3. Activate the virtual environment:
```bash
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
```bash
cp .env.example .env
```

6. Edit `.env` file and add your API keys:
```env
GUARDIAN_API_KEY=your_actual_guardian_api_key_here
GROQ_API_KEY=your_actual_groq_api_key_here
DATABASE_URL=sqlite:///./articles.db
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

7. Start the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

## Step 3: Frontend Setup (New Terminal)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Quick Start (Alternative)

You can also use the provided start script to run both servers at once:

```bash
./start.sh
```

Note: Make sure to edit `backend/.env` with your API keys before running this script.

## Using the Application

### 1. Scrape Articles
- Go to http://localhost:3000/dashboard
- Click "Start Scraping" to fetch articles from The Guardian
- Wait for the scraping to complete (check the stats)

### 2. Browse Articles
- Visit http://localhost:3000/articles
- Browse through the scraped articles
- Use the search bar to find specific articles
- Click on any article to view details

### 3. Generate AI Summaries
- Open an article detail page
- Click "Generate Summary" in the sidebar
- Wait for the AI to generate a summary using Groq

### 4. Bookmark Articles
- Click the bookmark icon on any article card
- Access saved articles from the Bookmarks page

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` to view the interactive API documentation (Swagger UI).

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

**Module not found errors:**
```bash
pip install -r requirements.txt
```

### Frontend Issues

**Port already in use:**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

If you encounter database errors, delete the database file and restart the backend:
```bash
cd backend
rm -f articles.db
```

The database will be automatically recreated on startup.

## Next Steps

- Explore the Dashboard to monitor your article collection
- Generate AI summaries for articles you're interested in
- Bookmark important articles for later reading
- Use search to find articles on specific topics

## Need Help?

- Check the main README.md for detailed information
- Visit the API docs at http://localhost:8000/docs
- Review the code comments in backend/ and frontend/ directories

Happy reading! 📚
