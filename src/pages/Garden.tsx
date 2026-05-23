import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { formatDate } from '@/lib/utils';
import contentData from '@/generated/content.json';

export function Garden() {
  const snippets = useMemo(() => contentData.snippets, []);

  return (
    <>
      <Helmet>
        <title>Digital Garden - Anine's Digital Garden</title>
      </Helmet>
      <Container className="py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Digital Garden</h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            数字花园是个人认知空间 —— 灵感、思考碎片、认知洞察与心理成长的开放式记录。
            每一条笔记都可能生长、链接、演化为更完整的想法。
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {snippets.map((snippet, i) => (
            <motion.div
              key={snippet.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="break-inside-avoid"
            >
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-text-primary leading-relaxed">
                  {snippet.frontmatter.title}
                </h3>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {snippet.frontmatter.excerpt}
                </p>
                <div
                  className="mt-3 text-xs text-text-secondary leading-relaxed prose-content opacity-75"
                  dangerouslySetInnerHTML={{ __html: snippet.html }}
                />
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-text-secondary">
                    {formatDate(snippet.frontmatter.date)}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {snippet.frontmatter.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
                {snippet.frontmatter.relatedPost && (
                  <a
                    href={`/blog/${snippet.frontmatter.relatedPost}`}
                    className="inline-block mt-2 text-xs text-accent-purple-light hover:text-accent-purple transition-colors"
                  >
                    关联文章 →
                  </a>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </>
  );
}
