from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, Session, select
from sqlalchemy import Column, Text


class Article(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str = Field(index=True)
    title: str = Field(index=True)
    content: str = Field(sa_column=Column(Text))
    summary: Optional[str] = Field(default=None, sa_column=Column(Text))
    bookmarked: bool = Field(default=False)
    scraped_at: datetime = Field(default_factory=datetime.utcnow)
    published_date: Optional[datetime] = None
    author: Optional[str] = None
    section: Optional[str] = None
    tags: Optional[str] = None


DATABASE_URL = "sqlite:///./articles.db"
engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
