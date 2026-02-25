import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LangLink from '@/components/molecules/LangLink';
import { TrendingUp, Clock, Eye, ArrowRight } from 'lucide-react';
import { useRecommendations } from '@/hooks/useRecommendations';

interface ContentRecommendationProps {
  currentPath: string;
  currentTags?: string[];
  maxItems?: number;
  className?: string;
}

const ContentRecommendation = ({ 
  currentPath, 
  currentTags = [], 
  maxItems = 6,
  className = ''
}: ContentRecommendationProps) => {
  const { t } = useTranslation();
  const { recommendations, loading } = useRecommendations({
    currentPath,
    currentTags,
    maxItems
  });

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) return null;

  const getTypeLabel = (type: string) => t(`organisms.contentRecommendation.types.${type}`);

  const getTypeColor = (type: string) => {
    const colors = {
      device: 'bg-blue-500/10 text-blue-600',
      manufacturer: 'bg-green-500/10 text-green-600',
      article: 'bg-purple-500/10 text-purple-600',
      guide: 'bg-orange-500/10 text-orange-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/10 text-gray-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t('organisms.contentRecommendation.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((item) => (
          <div key={item.id} className="group">
            <LangLink to={item.url} params={item.params} className="block">
              <div className="p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all duration-200">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTypeColor(item.type)}`}
                    >
                      {getTypeLabel(item.type)}
                    </Badge>
                    {item.trending && (
                      <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600">
                        {t('organisms.contentRecommendation.trending')}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {item.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.readTime}
                      </span>
                    )}
                    {item.views && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views}
                      </span>
                    )}
                  </div>
                </div>
                
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </LangLink>
          </div>
        ))}
        
        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <LangLink to="/resources">
            {t('organisms.contentRecommendation.viewMore')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </LangLink>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContentRecommendation;
