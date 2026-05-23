import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from '../components/home/HeroSection';
import { SkillsTags } from '../components/home/SkillsTags';
import { FeaturedArticles } from '../components/home/FeaturedArticles';
import { ProjectsShowcase } from '../components/home/ProjectsShowcase';
import { GardenSnippets } from '../components/home/GardenSnippets';
import { initSearch } from '@/lib/search';
import contentData from '@/generated/content.json';

export function Home() {
  const { posts, snippets } = contentData;

  useMemo(() => {
    if (contentData.searchIndex.length > 0) {
      initSearch(contentData.searchIndex);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Anine's Digital Garden</title>
        <meta name="description" content="探索 AI、Web 开发与个人知识管理，构建辅助思考的数字工具。" />
      </Helmet>

      <HeroSection />
      <SkillsTags />
      <FeaturedArticles posts={posts} />
      <ProjectsShowcase />
      <GardenSnippets snippets={snippets} />
    </>
  );
}
