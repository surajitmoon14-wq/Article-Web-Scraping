'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark, BookmarkCheck, Sparkles, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { articleApi, Article } from '@/app/lib/api';
import { formatDate } from '@/app/lib/utils';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const data = await articleApi.getArticle(Number(params.id));
      setArticle(data);
    } catch (err) {
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const handleGenerateSummary = async () => {
    if (!article) return;
    
    setGeneratingSummary(true);
    try {
      const updated = await articleApi.generateSummary(article.id);
      setArticle(updated);
    } catch (err) {
      console.error('Error generating summary:', err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const toggleBookmark = async () => {
    if (!article) return;
    
    try {
      await articleApi.toggleBookmark(article.id, !article.bookmarked);
      setArticle({ ...article, bookmarked: !article.bookmarked });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 w-64 bg-white/5 rounded animate-pulse" />
          <div className="h-64 bg-white/5 rounded animate-pulse" />
          <div className="h-96 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">Article not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Article Header */}
          <Card className="gradient-border">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    {article.section && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <Badge variant="outline">{article.section}</Badge>
                      </div>
                    )}
                    {article.published_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.published_date)}</span>
                      </div>
                    )}
                    {article.author && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleBookmark}
                  className="flex-shrink-0"
                >
                  {article.bookmarked ? (
                    <BookmarkCheck className="w-5 h-5 text-pink-400 fill-pink-400" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View original article
              </a>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="gradient-border">
            <CardContent className="pt-6">
              {article.content ? (
                <div className="prose prose-invert max-w-none">
                  {article.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No content available</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* AI Summary Card */}
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.summary ? (
                <div className="text-gray-300 leading-relaxed">
                  {article.summary.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-gray-500 text-sm">
                    Generate an AI-powered summary of this article using Groq's advanced language models.
                  </p>
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary}
                    className="w-full"
                  >
                    {generatingSummary ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 w-4 h-4" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Article Metadata */}
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Scraped</p>
                <p className="text-sm text-gray-300">
                  {formatDate(article.scraped_at)}
                </p>
              </div>
              {article.tags && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.split(',').map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Content Length</p>
                <p className="text-sm text-gray-300">
                  {article.content ? `${article.content.length} characters` : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
