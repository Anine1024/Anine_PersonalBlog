import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Workflow, Cpu, Monitor, Puzzle } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';

const SECTIONS = [
  {
    icon: Workflow,
    title: 'Coze 工作流',
    description: '基于 Coze 平台构建多套智能体工作流，通过插件集成与节点配置，实现图像理解、语音生成、多轮对话等 AI 交互能力。',
    items: [
      { name: 'OCR / 识图工作流', desc: '插件集成实现图像内容识别与理解' },
      { name: '语音生成工作流', desc: 'TTS 节点配置，文本转自然语音输出' },
      { name: '多轮对话系统', desc: '上下文记忆 + 意图识别，实现智能连续对话' },
      { name: 'Tool 函数封装', desc: '天气查询、文件查询等工具，大模型自动调用' },
    ],
    tags: ['Coze', 'Plugin', 'Node Config'],
  },
  {
    icon: Cpu,
    title: 'LLM 部署与微调',
    description: '熟悉大模型本地部署流程与微调方法，掌握 LoRA 等参数高效微调技术，了解模型推理优化。',
    items: [
      { name: 'Ollama 本地部署', desc: '本地模型拉取、运行与管理' },
      { name: 'LoRA 微调', desc: '低秩适配，小样本下的模型适配训练' },
      { name: '模型推理', desc: '本地推理接口调用与性能优化' },
    ],
    tags: ['Ollama', 'LoRA', 'Fine-tuning'],
  },
  {
    icon: Monitor,
    title: 'AI 前端交互',
    description: '将 AI 能力落地到前端页面交互中，实现流式输出、长对话、FunctionCall 等核心用户体验。',
    items: [
      { name: '流式输出', desc: 'SSE / WebSocket 实现打字机效果' },
      { name: '长对话能力', desc: '多轮会话状态管理与上下文维护' },
      { name: 'FunctionCall 集成', desc: '大模型调用前端工具函数' },
      { name: '请求并发控制', desc: 'Axios 封装 + 优先级队列' },
    ],
    tags: ['SSE', 'FunctionCall', 'Axios'],
  },
  {
    icon: Puzzle,
    title: 'MCP & Agent 探索',
    description: '持续关注 AI Agent 生态，探索 MCP（模型上下文协议）、自主 Agent 架构与多智能体协作模式。',
    items: [
      { name: 'MCP 协议', desc: '模型上下文协议的学习与实践' },
      { name: 'AI Agent 架构', desc: '记忆、工具调用、推理循环' },
      { name: '智能体协作', desc: '多 Agent 分工与信息传递' },
    ],
    tags: ['MCP', 'Agent', 'LLM'],
  },
];

export function AILab() {
  return (
    <>
      <Helmet>
        <title>AI Lab - Anine's Digital Garden</title>
      </Helmet>
      <Container className="py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">AI Lab</h1>
          <p className="mt-2 text-text-secondary">
            AI 技术实践与探索 —— Coze 工作流、LLM 部署微调、AI 前端交互与 Agent 架构。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
                    <section.icon size={20} className="text-accent-purple-light" />
                  </div>
                  <h3 className="font-bold text-text-primary">{section.title}</h3>
                </div>
                <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                  {section.description}
                </p>
                <div className="space-y-2 mb-4">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent-purple mt-2 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{item.name}</p>
                        <p className="text-xs text-text-secondary">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {section.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </>
  );
}
