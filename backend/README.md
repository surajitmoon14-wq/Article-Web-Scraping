# Article Scraper Backend

FastAPI backend for the Article Scraper web application.

## Features

- RESTful API for article scraping and management
- SQLite database with SQLAlchemy/SQLModel
- Guardian API integration for article scraping
- Groq AI integration for article summaries
- CORS support for frontend communication
- Background task processing for scraping

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```
GUARDIAN_API_KEY=your_guardian_api_key
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=sqlite:///./articles.db
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Running the Server

Development:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Production:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

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

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── models.py            # Database models
├── scraping_service.py  # Guardian API scraping
├── ai_service.py        # Groq AI integration
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── .env.example         # Environment template
```

## Development

The server will automatically create the SQLite database (`articles.db`) on first run.

Database schema is managed through SQLModel and automatically created on startup.
