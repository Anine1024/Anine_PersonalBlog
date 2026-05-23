import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import type { GardenSnippet as GardenSnippetType } from '@/types';

interface GardenSnippetsProps {
  snippets: GardenSnippetType[];
}

export function GardenSnippets({ snippets }: GardenSnippetsProps) {
  if (snippets.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          title="数字花园"
          subtitle="思维碎片 —— 灵感、洞察与思考的记录"
        />
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
                <p className="text-sm font-medium text-text-primary">
                  {snippet.frontmatter.title}
                </p>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {snippet.frontmatter.excerpt}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {snippet.frontmatter.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
