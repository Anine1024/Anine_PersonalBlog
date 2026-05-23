import { Clock, Calendar, Tag as TagIcon } from 'lucide-react';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { Tag } from '../ui/Tag';
import { Avatar } from '../ui/Avatar';

interface ArticleSidebarProps {
  post: Post;
}

export function ArticleSidebar({ post }: ArticleSidebarProps) {
  const { frontmatter } = post;

  return (
    <div className="space-y-6">
      {/* Author */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          作者
        </h4>
        <div className="flex items-center gap-3">
          <Avatar size="md" />
          <div>
            <p className="text-sm font-medium text-text-primary">Anine</p>
            <p className="text-xs text-text-secondary">AI 开发者</p>
          </div>
        </div>
      </div>

      {/* Reading info */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          信息
        </h4>
        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{formatDate(frontmatter.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>阅读 {frontmatter.readingTime} 分钟</span>
          </div>
          {post.wordCount != null && (
            <div className="flex items-center gap-2">
              <span className="w-[14px] text-center">#</span>
              <span>{post.wordCount.toLocaleString()} 字</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          标签
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {frontmatter.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
