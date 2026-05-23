import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Container } from '../components/ui/Container';

const MILESTONES = [
  {
    year: '2026',
    title: '构建个人数字大脑',
    description: '搭建 Anine\'s Digital Garden，将知识管理、博客写作与 AI 实验整合为统一的个人数字空间。',
    tags: ['React', 'TypeScript', 'AI'],
  },
  {
    year: '2025',
    title: '深入 AI Agent 开发',
    description: '从 Prompt Engineering 到自主 Agent 系统，探索 LLM 的能力边界。构建多个 Agent 原型和自动化工具。',
    tags: ['AI Agent', 'LangChain', 'Python'],
  },
  {
    year: '2024',
    title: 'Web 开发技术栈升级',
    description: '深入学习 React Server Components、Next.js App Router 和现代前端工程化。开始用 Obsidian 构建第二大脑。',
    tags: ['React', 'Next.js', 'Obsidian'],
  },
  {
    year: '2023',
    title: '自动化工作流探索',
    description: '用 n8n、Make 和 Python 脚本构建个人效率工具链，开始对"自动化思维"产生系统性认知。',
    tags: ['Automation', 'Python', 'n8n'],
  },
  {
    year: '2022',
    title: '前端开发起步',
    description: '系统学习 HTML/CSS/JavaScript 和 React，开始构建个人项目并持续输出技术博客。',
    tags: ['JavaScript', 'CSS', 'React'],
  },
];

export function Timeline() {
  return (
    <>
      <Helmet>
        <title>Timeline - Anine's Digital Garden</title>
      </Helmet>
      <Container className="py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Timeline</h1>
          <p className="mt-2 text-text-secondary">成长不是一蹴而就，而是一个持续积累与进化的过程。</p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-purple via-accent-purple-light to-transparent md:-translate-x-px" />

          <div className="flex flex-col gap-12">
            {MILESTONES.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Node on timeline */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent-purple border-2 border-bg-primary shadow-[0_0_8px_var(--color-accent-purple-glow)] md:-translate-x-1/2 z-10" />

                {/* Content card */}
                <div
                  className={`ml-10 md:ml-0 md:w-1/2 ${
                    i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                  }`}
                >
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent-purple/10 text-accent-purple-light border border-accent-purple/20 mb-2">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mt-1">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <div
                    className={`flex flex-wrap gap-1.5 mt-3 ${
                      i % 2 === 0 ? 'md:justify-end' : ''
                    }`}
                  >
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-bg-card border border-border text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
