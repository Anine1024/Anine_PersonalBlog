import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

const PROJECTS = [
  {
    title: 'React Playground（React 在线编译平台）',
    description: '开发现代的在线 React 代码编辑与预览平台，基于浏览器编译技术实现实时开发，无需本地环境配置。',
    tech: ['React 19', 'TypeScript', 'Vite', 'Monaco Editor', 'Babel', 'Sass'],
    source: 'https://gitee.com/Anine-repo/anine_react-playground',
    demo: 'https://anine-react-playground.pages.dev/',
  },
  {
    title: '低代码可视化编辑器',
    description: '低代码可视化编辑平台，通过拖拽式组件操作、实时预览和自动代码生成功能，大幅提升 UI 开发效率。具备组件树视图、动态属性面板等核心功能。',
    tech: ['React 18', 'TypeScript', 'Vite', 'Zustand', 'ReactDnD', 'MonacoEditor'],
    source: 'https://gitee.com/Anine-repo/Anine_lowcode-editor',
    demo: 'https://anine-lowcode-editor.pages.dev/',
  },
  {
    title: 'AI_KidEdu 亲子教育平台',
    description: '面向低龄家庭的智能亲子教育平台，集成 AI 识物、语音生成、多轮智能对话。基于 Coze 平台构建多套智能体工作流，实现图像理解、TTS、语义交互等能力。',
    tech: ['React', 'TypeScript', 'Koa', 'Coze', 'JWT', 'Ant Design Mobile'],
    source: 'https://gitee.com/Anine-repo/ai_-kid-edu',
    demo: 'https://aikidedu-production.up.railway.app/',
  },
];

export function ProjectsShowcase() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          title="项目作品"
          subtitle="构建与实验的项目集合"
        />
        <div className="flex flex-col gap-6">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-primary">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-text-secondary text-sm max-w-2xl">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tech.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" href={project.source}>
                      <Github size={16} />
                      <span className="hidden sm:inline">源码</span>
                    </Button>
                    <Button variant="primary" href={project.demo}>
                      <ExternalLink size={16} />
                      <span className="hidden sm:inline">预览</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
