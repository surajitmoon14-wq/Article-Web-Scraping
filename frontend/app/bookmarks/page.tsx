'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookmarkX, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { articleApi, Article } from '@/app/lib/api';
import { formatDate, truncateText } from '@/app/lib/utils';
import Link from 'next/link';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const data = await articleApi.getBookmarks(100);
      setBookmarks(data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const removeBookmark = async (id: number) => {
    try {
      await articleApi.toggleBookmark(id, false);
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error removing bookmark:', err);
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
        <h1 className="text-4xl font-bold gradient-text mb-2">Bookmarks</h1>
        <p className="text-gray-400">
          Your saved articles for later reading
        </p>
      </motion.div>

      {/* Empty state */}
      {!loading && bookmarks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <BookmarkX className="w-12 h-12 text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">No bookmarks yet</h2>
          <p className="text-gray-400 mb-6">
            Start exploring articles and save the ones you find interesting
          </p>
          <Link href="/articles">
            <Button size="lg">
              Browse Articles
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Bookmarks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {bookmarks.map((article, index) => (
            <motion.div
              key={article.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full gradient-border card-glow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {article.section && (
                      <Badge variant="outline">{article.section}</Badge>
                    )}
                    {article.summary && (
                      <Badge variant="default">AI Summary</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm line-clamp-4">
                    {article.summary
                      ? article.summary
                      : truncateText(article.content || '', 200)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {article.published_date
                        ? formatDate(article.published_date)
                        : formatDate(article.scraped_at)}
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/articles/${article.id}`}>
                        <Button size="sm" variant="outline">
                          Read
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeBookmark(article.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <BookmarkX className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Refresh button */}
      {!loading && bookmarks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            onClick={fetchBookmarks}
            size="icon"
            className="w-14 h-14 rounded-full shadow-lg"
          >
            <RefreshCw className="w-6 h-6" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
