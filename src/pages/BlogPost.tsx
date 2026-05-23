import { useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { ReadingProgress } from '../components/ui/ReadingProgress';
import { TableOfContents } from '../components/ui/TableOfContents';
import { ArticleContent } from '../components/blog/ArticleContent';
import { ArticleSidebar } from '../components/blog/ArticleSidebar';
import { Badge } from '../components/ui/Badge';
import { Tag } from '../components/ui/Tag';
import { formatDate } from '@/lib/utils';
import '@/styles/prose.css';
import contentData from '@/generated/content.json';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const post = useMemo(() => {
    return contentData.posts.find((p) => p.slug === slug);
  }, [slug]);

  if (!post) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold text-text-primary">文章未找到</h2>
        <p className="mt-2 text-text-secondary">
          文章 "{slug}" 不存在或已被移除。
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-accent-purple-light hover:text-accent-purple transition-colors"
        >
          <ArrowLeft size={16} />
          返回博客
        </Link>
      </Container>
    );
  }

  const { frontmatter, headings } = post;

  return (
    <>
      <Helmet>
        <title>{frontmatter.title} - Anine's Digital Garden</title>
        <meta name="description" content={frontmatter.excerpt} />
      </Helmet>

      <ReadingProgress />

      <Container>
        <div className="py-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            返回博客
          </Link>
        </div>

        <header className="max-w-3xl mx-auto pb-10">
          <Badge className="mb-4">{frontmatter.category}</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
            {frontmatter.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-secondary">
            <span>{formatDate(frontmatter.date)}</span>
            <span>阅读 {frontmatter.readingTime} 分钟</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {frontmatter.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </header>

        {frontmatter.coverImage && (
          <div className="max-w-4xl mx-auto mb-12">
            <img
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              className="w-full rounded-2xl border border-border"
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
          <aside className="hidden lg:block w-48 shrink-0">
            <div className="sticky top-[100px]">
              <TableOfContents headings={headings} />
            </div>
          </aside>

          <main className="flex-1 min-w-0 max-w-3xl">
            <ArticleContent html={post.html} />
          </main>

          <aside className="w-full lg:w-56 shrink-0">
            <div className="lg:sticky lg:top-[100px]">
              <ArticleSidebar post={post} />
            </div>
          </aside>
        </div>

        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent-purple-light hover:text-accent-purple transition-colors"
          >
            <ArrowLeft size={16} />
            全部文章
          </Link>
        </div>
      </Container>
    </>
  );
}
