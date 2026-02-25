
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, TrendingUp, BookOpen } from 'lucide-react';
import LangLink from '@/components/molecules/LangLink';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured_image?: string;
  published_at: string;
  author: string;
  read_time?: number;
}

interface ArticleGridProps {
  articles: Article[];
  showCategory?: boolean;
  maxItems?: number;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ 
  articles, 
  showCategory = true,
  maxItems 
}) => {
  const { t, i18n } = useTranslation();
  const displayArticles = maxItems ? articles.slice(0, maxItems) : articles;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'market-analysis':
        return <TrendingUp className="w-4 h-4" />;
      case 'technology':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'market-analysis':
        return 'bg-green-100 text-green-700';
      case 'technology':
        return 'bg-blue-100 text-blue-700';
      case 'guide':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayArticles.map((article) => (
        <Card key={article.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4">
            {article.featured_image && (
              <div className="mb-3">
                <img 
                  src={article.featured_image} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
              {showCategory && (
                <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
                  <span className="flex items-center gap-1">
                    {getCategoryIcon(article.category)}
                    {article.category}
                  </span>
                </Badge>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {new Date(article.published_at).toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US')}
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {article.title}
            </h3>
            
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {(Array.isArray(article.tags) ? article.tags : []).slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User className="w-3 h-3" />
                <span>{article.author}</span>
                {article.read_time && (
                  <>
                    <span>•</span>
                    <span>{t('organisms.articleGrid.readMinutes', { minutes: article.read_time })}</span>
                  </>
                )}
              </div>
              
              <LangLink to="/blog/$slug" params={{ slug: article.slug }}>
                <Button variant="outline" size="sm">
                  {t('organisms.articleGrid.readMore')}
                </Button>
              </LangLink>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArticleGrid;
