import type { NavItem } from '@/types';

export const SITE_NAME = "Anine's Digital Garden";
export const SITE_DESCRIPTION = "Anine's Digital Garden - AI 前端开发者的个人数字空间，探索技术、记录思考、构建未来。";

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'AI Lab', href: '/ai-lab' },
  { label: 'Garden', href: '/garden' },
  { label: 'About', href: '/about' },
];

export const CATEGORIES = [
  '前端开发',
  '人工智能',
  '工具方法',
  '自动化',
  '认知心理',
  '个人成长',
  '随笔',
];

export const SKILLS = [
  'React', 'TypeScript', 'Coze', 'LLM',
  'AI Agent', 'Koa', 'Zustand', 'Tailwind CSS',
  'Node.js', 'Vite', 'LoRA', 'Ollama',
];

export const SOCIAL_LINKS = {
  gitee: 'https://gitee.com/Anine-repo',
  email: 'mailto:2386415771@qq.com',
};

export const HERO_TITLE = 'Building My AI Digital Universe';

export const HERO_SUBTITLE = [
  'AI 前端开发工程师',
  'Coze 工作流搭建',
  'LLM 本地部署与微调',
  '低代码平台探索者',
];
