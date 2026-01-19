import requests
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Optional
import os


class ScrapingService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://content.guardianapis.com"

    def fetch_articles(self, section: str = "technology/artificialintelligenceai", 
                      page: int = 1, page_size: int = 10) -> List[Dict]:
        """Fetch article metadata from Guardian API"""
        url = f"{self.base_url}/{section}"
        params = {
            "api-key": self.api_key,
            "type": "article",
            "page": page,
            "page-size": page_size,
            "show-fields": "headline,byline,shortUrl,bodyText,publication,sectionName"
        }
        
        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            articles = []
            for item in data.get('response', {}).get('results', []):
                fields = item.get('fields', {})
                article = {
                    'url': item.get('webUrl'),
                    'title': item.get('webTitle'),
                    'published_date': self._parse_date(item.get('webPublicationDate')),
                    'author': fields.get('byline'),
                    'section': item.get('sectionName'),
                    'tags': ','.join([tag.get('webTitle', '') for tag in item.get('tags', [])]),
                    'short_url': fields.get('shortUrl')
                }
                articles.append(article)
            
            return articles
        except Exception as e:
            print(f"Error fetching articles: {e}")
            raise

    def scrape_article_content(self, url: str) -> str:
        """Scrape full article content from URL"""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Try to find the article content in Guardian's structure
            content_parts = []
            
            # Guardian articles typically have content in article body divs
            article_body = soup.find('div', class_='article-body-commercial-selector') or \
                          soup.find('div', {'data-component': 'article-body'})
            
            if article_body:
                paragraphs = article_body.find_all('p')
                content_parts = [p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)]
            else:
                # Fallback: get all paragraphs
                paragraphs = soup.find_all('p')
                content_parts = [p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)]
            
            content = '\n\n'.join(content_parts)
            return content.strip()
            
        except Exception as e:
            print(f"Error scraping article from {url}: {e}")
            raise

    def _parse_date(self, date_str: Optional[str]) -> Optional[datetime]:
        """Parse Guardian API date format"""
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except:
            return None
