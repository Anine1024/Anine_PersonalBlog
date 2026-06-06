import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ArticleCard } from '../blog/ArticleCard';
import type { Post } from '@/types';

interface FeaturedArticlesProps {
  posts: Post[];
}

// Slugs of featured articles — pick the best 3 from all blog posts
const FEATURED_SLUGS = [
  '从零开始构建 AI Agent：一份实用指南',
  '前端性能优化实战：从首屏秒开到打包加速的全链路指南',
  '深入拆解 Koa 核心：洋葱模型、中间件与代理机制',
];

export function FeaturedArticles({ posts }: FeaturedArticlesProps) {
  const featured = FEATURED_SLUGS
    .map((title) => posts.find((p) => p.frontmatter.title.includes(title) || p.frontmatter.title === title))
    .filter(Boolean) as Post[];

  if (featured.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          title="精选文章"
          subtitle="AI、开发与技术的深度思考"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((post) => (
            <ArticleCard key={post.slug} post={post} featured />
          ))}
        </div>
      </Container>
    </section>
  );
}
