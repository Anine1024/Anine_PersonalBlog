import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ArticleCard } from '../blog/ArticleCard';
import type { Post } from '@/types';

interface FeaturedArticlesProps {
  posts: Post[];
}

export function FeaturedArticles({ posts }: FeaturedArticlesProps) {
  const featured = posts.filter((p) => p.frontmatter.featured).slice(0, 3);

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
