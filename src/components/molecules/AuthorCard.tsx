import React from 'react';
import { Author } from '@/data/mock/authors';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Twitter, Globe, Mail, Award } from 'lucide-react';

interface AuthorCardProps {
  author: Author;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, className = '', layout = 'horizontal' }) => {
  return (
    <Card className={`bg-slate-50 border-slate-200 ${className}`}>
      <CardContent className="p-6">
        <div className={`flex gap-6 items-start ${layout === 'vertical' ? 'flex-col' : 'flex-col md:flex-row'}`}>
          <div className="flex-shrink-0">
            <Avatar className="w-20 h-20 border-2 border-white shadow-sm">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 space-y-3 min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{author.name}</h3>
                <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                  {author.role}
                </Badge>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {author.bio}
              </p>
            </div>

            {author.credentials && author.credentials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {author.credentials.map((cred, index) => (
                  <div key={index} className="flex items-center text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                    <Award className="w-3 h-3 mr-1 text-amber-500" />
                    {cred}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              {author.social?.linkedin && (
                <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0077b5] transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {author.social?.twitter && (
                <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1DA1F2] transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {author.social?.website && (
                <a href={author.social.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {author.email && (
                <a href={`mailto:${author.email}`} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
