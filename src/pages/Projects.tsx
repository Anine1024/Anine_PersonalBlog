import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';

const PROJECTS = [
  {
    id: 'react-playground',
    title: 'React Playground（React 在线编译平台）',
    description: '开发现代的在线 React 代码编辑与预览平台，基于浏览器编译技术实现实时开发，无需本地环境配置。',
    tech: ['React 19', 'TypeScript', 'Vite', 'Monaco Editor', '@babel/standalone', 'Sass', 'Allotment'],
    category: 'frontend',
    source: 'https://gitee.com/Anine-repo/anine_react-playground',
    demo: 'https://anine-react-playground.pages.dev/',
    highlights: [
      '基于 @babel/standalone 完成 TSX/JSX 即时转译，300ms 内代码修改自动编译与预览刷新',
      '集成 Monaco Editor + @typescript/ata 实现 TypeScript 实时类型检查与第三方库智能提示',
      '基于 React 19 + TypeScript + Vite 构建，CSS Modules + Sass 实现样式隔离',
      '拖拽式响应式布局，Allotment 实现编辑区与预览区比例自由调整',
      '支持主题自动切换（深色/浅色）与代码一键打包导出（ZIP）',
    ],
  },
  {
    id: 'lowcode-editor',
    title: '低代码可视化编辑器',
    description: '低代码可视化编辑平台，通过拖拽式组件操作、实时预览和自动代码生成功能，大幅提升 UI 开发效率。具备组件树视图、动态属性面板等核心功能。',
    tech: ['React 18', 'TypeScript', 'Vite', 'Ant Design', 'Zustand', 'ReactDnD', 'TailwindCSS', 'MonacoEditor'],
    category: 'frontend',
    source: 'https://gitee.com/Anine-repo/Anine_lowcode-editor',
    demo: 'https://anine-lowcode-editor.pages.dev/',
    highlights: [
      '组件化架构，dev/prod 双版本，JSON → 组件递归渲染',
      'ReactDnD 拖拽交互 + 自定义 Hook 封装',
      'Zustand 管理组件树与配置，嵌套递归操作',
      'MonacoEditor 源码视图 + 一键预览切换',
    ],
  },
  {
    id: 'ai-kidedu',
    title: 'AI_KidEdu 亲子教育平台',
    description: '面向低龄家庭的智能亲子教育平台，为孩子提供沉浸式互动学习体验，集成 AI 识物、语音生成、多轮智能对话等能力。',
    tech: ['React', 'TypeScript', 'Koa', 'JWT', 'bcrypt', 'Axios', 'Ant Design Mobile', 'Vite'],
    category: 'ai',
    source: 'https://gitee.com/Anine-repo/ai_-kid-edu',
    demo: 'https://aikidedu-production.up.railway.app/',
    testAccount: { phone: '13800000000', password: '123456' },
    highlights: [
      '基于 Coze 平台设计多套智能体工作流，实现图像理解（OCR/识图）、语音生成、多轮对话',
      '封装天气查询、文件目录查询等 Tool 函数，大模型自动调用工具',
      '大文件分片上传方案（Blob 切片 + 超时重传 + 后端校验合并）',
      'JWT 登录鉴权 + bcrypt 密码哈希',
      'Axios 封装请求并发控制 + 任务优先级机制',
    ],
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'frontend', label: '前端' },
  { key: 'ai', label: 'AI' },
];

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Helmet>
        <title>Projects - Anine's Digital Garden</title>
      </Helmet>
      <Container className="py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Projects</h1>
          <p className="mt-2 text-text-secondary">构建与实验的项目集合，每个项目都源于一个具体的问题或好奇心。</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <Tag
              key={cat.key}
              active={activeCategory === cat.key}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </Tag>
          ))}
        </div>

        <motion.div layout className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <Card className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-text-secondary text-sm leading-relaxed max-w-3xl">
                        {project.description}
                      </p>
                      {project.highlights && (
                        <ul className="mt-4 space-y-1.5">
                          {project.highlights.map((h, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                              <span className="w-1 h-1 rounded-full bg-accent-purple mt-2 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.tech.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="secondary" href={project.source}>
                        <Code size={16} />
                        <span>源码</span>
                      </Button>
                      <Button variant="primary" href={project.demo}>
                        <ExternalLink size={16} />
                        <span>预览</span>
                      </Button>
                    </div>
                  </div>

                  {project.testAccount && (
                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-accent-purple-light shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                        <span className="font-medium">测试账号</span>
                      </div>
                      <span className="text-text-primary font-mono">{project.testAccount.phone}</span>
                      <span className="text-text-secondary">/</span>
                      <span className="text-text-primary font-mono">{project.testAccount.password}</span>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </>
  );
}
