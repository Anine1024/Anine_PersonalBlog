import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { CodeBackground } from '../components/home/CodeBackground';
import { LightBeams } from '../components/home/LightBeams';
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

      {/* Background effects layer */}
      <CodeBackground />
      <LightBeams />

      {/* Hero readability overlay: fade background to protect text */}
      <div
        className="fixed top-0 left-0 w-full pointer-events-none"
        style={{
          zIndex: 5,
          height: '300px',
          background: 'linear-gradient(to bottom, var(--color-bg-primary) 0%, var(--color-bg-primary) 20%, transparent 100%)',
        }}
      />

      {/* Content layer */}
      <div className="relative z-10">
        <HeroSection />
        <SkillsTags />
        <FeaturedArticles posts={posts} />
        <ProjectsShowcase />
        <GardenSnippets snippets={snippets} />
      </div>
    </>
  );
}
