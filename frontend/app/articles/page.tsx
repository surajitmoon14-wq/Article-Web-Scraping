'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bookmark, BookmarkCheck, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { articleApi, Article } from '@/app/lib/api';
import { formatDate, truncateText } from '@/app/lib/utils';
import Link from 'next/link';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await articleApi.getArticles({ limit: 100 });
      setArticles(data);
      setFilteredArticles(data);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = articles;

    if (bookmarkedOnly) {
      filtered = filtered.filter(a => a.bookmarked);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.content?.toLowerCase().includes(query) ||
        a.summary?.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
  }, [searchQuery, bookmarkedOnly, articles]);

  const toggleBookmark = async (id: number, currentlyBookmarked: boolean) => {
    try {
      await articleApi.toggleBookmark(id, !currentlyBookmarked);
      setArticles(articles.map(a =>
        a.id === id ? { ...a, bookmarked: !currentlyBookmarked } : a
      ));
      setFilteredArticles(filteredArticles.map(a =>
        a.id === id ? { ...a, bookmarked: !currentlyBookmarked } : a
      ));
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Articles</h1>
        <p className="text-gray-400">
          Browse and search through scraped articles
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full md:w-auto"
          >
            <Filter className="mr-2 w-4 h-4" />
            Filters
            <ChevronDown
              className={`ml-2 w-4 h-4 transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookmarkedOnly}
                  onChange={(e) => setBookmarkedOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                />
                <span className="text-gray-300">Show bookmarked only</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-gray-400 mb-4"
      >
        {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
      </motion.p>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-400 text-lg">No articles found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/articles/${article.id}`}>
                  <Card className="h-full gradient-border card-glow hover:cursor-pointer transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleBookmark(article.id, article.bookmarked);
                          }}
                          className="flex-shrink-0"
                        >
                          {article.bookmarked ? (
                            <BookmarkCheck className="w-5 h-5 text-pink-400 fill-pink-400" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        {article.section && (
                          <Badge variant="outline">{article.section}</Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {article.published_date
                            ? formatDate(article.published_date)
                            : formatDate(article.scraped_at)}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm line-clamp-4">
                        {article.summary
                          ? article.summary
                          : truncateText(article.content || '', 200)}
                      </p>
                      {article.author && (
                        <p className="text-xs text-gray-500 mt-3">
                          By {article.author}
                        </p>
                      )}
                      {article.summary && (
                        <Badge variant="default" className="mt-3">
                          AI Summary
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
