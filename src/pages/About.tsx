import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { Avatar } from '../components/ui/Avatar';

const SKILL_TREE = [
  {
    category: '前端开发',
    skills: ['React', 'TypeScript', 'HTML5', 'CSS3', 'JavaScript ES6+', 'Vite', 'Ant Design', 'Tailwind CSS', 'Zustand', 'MonacoEditor'],
  },
  {
    category: 'AI & LLM',
    skills: ['Coze 工作流', 'LoRA 微调', 'Ollama 本地部署', 'FunctionCall', 'MCP', 'AI Agent', '流式输出', '多轮对话'],
  },
  {
    category: '后端 & 工程化',
    skills: ['Node.js', 'Koa', 'JWT', 'bcrypt', 'RESTful API', 'Webpack', 'Git', 'Axios'],
  },
];

const WORKFLOW = [
  { tool: 'VS Code', purpose: '代码编辑' },
  { tool: 'Trae', purpose: 'AI 辅助开发' },
  { tool: 'Claude Code', purpose: '智能编程助手' },
  { tool: 'Coze', purpose: 'AI 工作流平台' },
  { tool: 'Ollama', purpose: '本地模型部署' },
  { tool: 'Git', purpose: '版本管理' },
];

export function About() {
  return (
    <>
      <Helmet>
        <title>About - Anine's Digital Garden</title>
      </Helmet>
      <Container className="py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <Avatar size="lg" className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">王志凯</h1>
          <p className="mt-2 text-accent-purple-light font-medium">AI 前端开发工程师</p>
          <p className="mt-4 text-text-secondary leading-relaxed max-w-lg mx-auto">
            软件工程本科毕业，专注于 AI 与前端开发的交叉领域。
            具备独立开发 React 项目的经验，熟悉 Coze 工作流搭建与 LLM 本地部署，
            致力于将 AI 能力融入前端交互体验。
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-3 py-1 text-xs rounded-full bg-bg-card border border-border text-text-secondary"
            >
              东华理工大学 · 软件工程 · 2021-2025
            </motion.span>
          </div>
        </motion.div>

        {/* Skill tree */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-xl font-bold text-text-primary mb-6 text-center">技能树</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SKILL_TREE.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="p-5 h-full" hover={false}>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">{group.category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <Tag key={skill}>{skill}</Tag>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-text-primary mb-6 text-center">开发环境</h2>
          <Card className="p-6" hover={false}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {WORKFLOW.map((w) => (
                <div key={w.tool} className="flex items-center gap-2 p-2 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-accent-purple" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{w.tool}</p>
                    <p className="text-xs text-text-secondary">{w.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
}
