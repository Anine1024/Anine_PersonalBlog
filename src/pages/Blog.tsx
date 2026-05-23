import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Container } from '../components/ui/Container';
import { CategorySidebar } from '../components/blog/CategorySidebar';
import { BlogList } from '../components/blog/BlogList';
import type { Category } from '@/types';
import contentData from '@/generated/content.json';

export function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  const posts = contentData.posts;

  const categories: Category[] = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      const cat = p.frontmatter.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return posts;
    return posts.filter((p) => p.frontmatter.category === activeCategory);
  }, [posts, activeCategory]);

  const handleCategoryChange = (category: string | null) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <Helmet>
        <title>Blog - Anine's Digital Garden</title>
      </Helmet>
      <Container className="py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">博客</h1>
          <p className="mt-2 text-text-secondary">
            关于 AI、Web 开发与软件工程的思考与实践。
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-48 shrink-0">
            <CategorySidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </aside>
          <main className="flex-1">
            <BlogList posts={filteredPosts} />
          </main>
        </div>
      </Container>
    </>
  );
}
