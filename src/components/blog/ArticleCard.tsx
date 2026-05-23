import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { Tag } from '../ui/Tag';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
}

export function ArticleCard({ post, featured }: ArticleCardProps) {
  const { frontmatter } = post;

  return (
    <Link to={`/blog/${frontmatter.slug}`} className="block group">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="card-base overflow-hidden h-full flex flex-col"
      >
        {/* Cover Image */}
        {frontmatter.coverImage && (
          <div className="relative overflow-hidden aspect-video">
            <img
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          <div className="mb-3">
            <Badge>{frontmatter.category}</Badge>
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-text-primary group-hover:text-accent-purple-light transition-colors line-clamp-2 tracking-tight ${
              featured ? 'text-xl' : 'text-lg'
            }`}
          >
            {frontmatter.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-text-secondary text-sm line-clamp-3 flex-1">
            {frontmatter.excerpt}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {frontmatter.tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <span>{formatDate(frontmatter.date)}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              阅读 {frontmatter.readingTime} 分钟
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
