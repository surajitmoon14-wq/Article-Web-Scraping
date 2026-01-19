'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, Database, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { articleApi, Stats } from '@/app/lib/api';

export default function DashboardPage() {
  const [isScraping, setIsScraping] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastScrape, setLastScrape] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const data = await articleApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    const savedLastScrape = localStorage.getItem('lastScrape');
    if (savedLastScrape) {
      setLastScrape(savedLastScrape);
    }
  }, []);

  const handleScrape = async () => {
    setIsScraping(true);
    setError(null);
    
    try {
      const result = await articleApi.scrape('technology/artificialintelligenceai', 10);
      setLastScrape(new Date().toISOString());
      localStorage.setItem('lastScrape', new Date().toISOString());
      
      // Wait a bit for background tasks to complete
      setTimeout(() => {
        fetchStats();
      }, 2000);
      
      // Refresh stats after 5 more seconds
      setTimeout(() => {
        fetchStats();
      }, 7000);
      
    } catch (err) {
      console.error('Error scraping:', err);
      setError('Failed to scrape articles. Please try again.');
    } finally {
      setIsScraping(false);
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
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Control article scraping and monitor your collection
        </p>
      </motion.div>

      {/* Scrape Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="gradient-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Article Scraping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p className="text-gray-300 mb-2">
                  Scrape latest articles from The Guardian's Technology & AI section
                </p>
                {lastScrape && (
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last scrape: {new Date(lastScrape).toLocaleString()}
                  </p>
                )}
              </div>
              <Button
                onClick={handleScrape}
                disabled={isScraping}
                size="lg"
                className="min-w-[180px]"
              >
                {isScraping ? (
                  <>
                    <RefreshCw className="mr-2 w-5 h-5 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 w-5 h-5" />
                    Start Scraping
                  </>
                )}
              </Button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="gradient-border card-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <motion.div
                  key={stats?.total_articles}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-bold text-white"
                >
                  {stats?.total_articles || 0}
                </motion.div>
                <p className="text-sm text-gray-500">In database</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border card-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              Bookmarked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <motion.div
                  key={stats?.bookmarked_articles}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-bold text-white"
                >
                  {stats?.bookmarked_articles || 0}
                </motion.div>
                <p className="text-sm text-gray-500">Saved articles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border card-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              AI Summaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <motion.div
                  key={stats?.articles_with_summary}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-bold text-white"
                >
                  {stats?.articles_with_summary || 0}
                </motion.div>
                <p className="text-sm text-gray-500">Generated by AI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sections Breakdown */}
      {stats?.sections && Object.keys(stats.sections).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="text-lg">Articles by Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.sections)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([section, count]) => (
                    <div key={section} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">{section}</span>
                          <span className="text-sm text-gray-500">{count} articles</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / (stats.total_articles || 1)) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="gradient-bg h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
