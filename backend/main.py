from fastapi import FastAPI, HTTPException, Query, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from models import Article, create_db_and_tables, get_session, engine
from scraping_service import ScrapingService
from ai_service import AIService

load_dotenv()

app = FastAPI(title="Article Scraper API", version="1.0.0")

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
guardian_api_key = os.getenv("GUARDIAN_API_KEY", "")
groq_api_key = os.getenv("GROQ_API_KEY", "")

scraper = ScrapingService(api_key=guardian_api_key)
ai_service = AIService(api_key=groq_api_key)

# Pydantic models
class ArticleResponse(BaseModel):
    id: int
    url: str
    title: str
    content: Optional[str] = None
    summary: Optional[str] = None
    bookmarked: bool
    scraped_at: datetime
    published_date: Optional[datetime] = None
    author: Optional[str] = None
    section: Optional[str] = None
    tags: Optional[str] = None

    class Config:
        from_attributes = True


class ScrapeRequest(BaseModel):
    section: str = "technology/artificialintelligenceai"
    page_size: int = 10
    force_scrape: bool = False


class ScrapeStatus(BaseModel):
    message: str
    articles_count: int
    timestamp: datetime


class BookmarkRequest(BaseModel):
    bookmarked: bool


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def read_root():
    return {"message": "Article Scraper API", "version": "1.0.0"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}


@app.post("/api/scrape", response_model=ScrapeStatus)
async def scrape_articles(
    request: ScrapeRequest,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session)
):
    """Trigger article scraping from Guardian API"""
    try:
        # Fetch article metadata
        articles_metadata = scraper.fetch_articles(
            section=request.section,
            page=1,
            page_size=request.page_size
        )
        
        new_articles_count = 0
        updated_articles_count = 0
        
        for metadata in articles_metadata:
            # Check if article already exists
            existing = session.exec(
                select(Article).where(Article.url == metadata['url'])
            ).first()
            
            if existing and not request.force_scrape:
                # Update metadata only
                existing.title = metadata['title']
                existing.author = metadata['author']
                existing.section = metadata['section']
                existing.tags = metadata['tags']
                updated_articles_count += 1
            else:
                # Scrape full content in background
                background_tasks.add_task(
                    scrape_and_save_article,
                    metadata,
                    session,
                    request.force_scrape
                )
                if not existing:
                    new_articles_count += 1
        
        return ScrapeStatus(
            message=f"Scraping initiated. {new_articles_count} new articles, {updated_articles_count} updated.",
            articles_count=len(articles_metadata),
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def scrape_and_save_article(metadata: dict, session: Session, force_scrape: bool):
    """Background task to scrape and save article"""
    try:
        # Get a new session for this background task
        from sqlmodel import Session as NewSession
        new_session = NewSession(engine)
        
        try:
            content = scraper.scrape_article_content(metadata['url'])
            
            existing = new_session.exec(
                select(Article).where(Article.url == metadata['url'])
            ).first()
            
            if existing:
                existing.content = content
                existing.title = metadata['title']
                existing.author = metadata['author']
                existing.section = metadata['section']
                existing.tags = metadata['tags']
                existing.published_date = metadata['published_date']
            else:
                article = Article(
                    url=metadata['url'],
                    title=metadata['title'],
                    content=content,
                    author=metadata['author'],
                    section=metadata['section'],
                    tags=metadata['tags'],
                    published_date=metadata['published_date']
                )
                new_session.add(article)
            
            new_session.commit()
        finally:
            new_session.close()
            
    except Exception as e:
        print(f"Error in background scraping: {e}")


@app.get("/api/articles", response_model=List[ArticleResponse])
def get_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    bookmarked_only: bool = Query(False),
    section: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    session: Session = Depends(get_session)
):
    """List all scraped articles with pagination and filters"""
    query = select(Article)
    
    if bookmarked_only:
        query = query.where(Article.bookmarked == True)
    
    if section:
        query = query.where(Article.section.ilike(f"%{section}%"))
    
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            (Article.title.ilike(search_pattern)) |
            (Article.content.ilike(search_pattern))
        )
    
    query = query.order_by(Article.scraped_at.desc()).offset(skip).limit(limit)
    articles = session.exec(query).all()
    
    return articles


@app.get("/api/articles/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, session: Session = Depends(get_session)):
    """Get single article details"""
    article = session.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@app.post("/api/articles/{article_id}/summarize", response_model=ArticleResponse)
async def summarize_article(
    article_id: int,
    session: Session = Depends(get_session)
):
    """Generate AI summary using Groq API"""
    article = session.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if not article.content:
        raise HTTPException(status_code=400, detail="Article has no content to summarize")
    
    try:
        summary = ai_service.generate_summary(article.title, article.content)
        article.summary = summary
        session.add(article)
        session.commit()
        session.refresh(article)
        return article
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")


@app.get("/api/search", response_model=List[ArticleResponse])
def search_articles(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """Full-text search articles"""
    search_pattern = f"%{q}%"
    query = select(Article).where(
        (Article.title.ilike(search_pattern)) |
        (Article.content.ilike(search_pattern)) |
        (Article.summary.ilike(search_pattern))
    ).order_by(Article.scraped_at.desc()).offset(skip).limit(limit)
    
    articles = session.exec(query).all()
    return articles


@app.post("/api/articles/{article_id}/bookmark", response_model=ArticleResponse)
def toggle_bookmark(
    article_id: int,
    request: BookmarkRequest,
    session: Session = Depends(get_session)
):
    """Save/unsave articles"""
    article = session.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article.bookmarked = request.bookmarked
    session.add(article)
    session.commit()
    session.refresh(article)
    
    return article


@app.get("/api/bookmarks", response_model=List[ArticleResponse])
def get_bookmarks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """Get all bookmarked articles"""
    query = select(Article).where(Article.bookmarked == True).order_by(Article.scraped_at.desc()).offset(skip).limit(limit)
    articles = session.exec(query).all()
    return articles


@app.get("/api/stats")
def get_stats(session: Session = Depends(get_session)):
    """Get statistics about articles"""
    total_articles = session.exec(select(Article)).all()
    bookmarked_articles = session.exec(select(Article).where(Article.bookmarked == True)).all()
    articles_with_summary = session.exec(select(Article).where(Article.summary.isnot(None))).all()
    
    sections = {}
    for article in total_articles:
        if article.section:
            sections[article.section] = sections.get(article.section, 0) + 1
    
    return {
        "total_articles": len(total_articles),
        "bookmarked_articles": len(bookmarked_articles),
        "articles_with_summary": len(articles_with_summary),
        "sections": sections
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
