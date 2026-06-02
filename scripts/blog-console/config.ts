import 'dotenv/config';

export const CONFIG = {
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
  deepseekBaseUrl: 'https://api.deepseek.com/v1',
  outputDir: 'src/content/blog/imported',
  juejinSearchUrl: 'https://api.juejin.cn/search_api/v1/search',
  juejinArticleUrl: 'https://juejin.cn/post',
} as const;

export const TAG_TO_CATEGORY: Record<string, string> = {
  react: '前端开发',
  vue: '前端开发',
  typescript: '前端开发',
  javascript: '前端开发',
  css: '前端开发',
  html: '前端开发',
  next: '前端开发',
  vite: '前端开发',
  webpack: '前端开发',
  node: '后端开发',
  python: '人工智能',
  ai: '人工智能',
  llm: '人工智能',
  agent: '人工智能',
  langchain: '人工智能',
  prompt: '人工智能',
  deepseek: '人工智能',
  openai: '人工智能',
  coze: '人工智能',
  docker: '工具方法',
  git: '工具方法',
  自动化: '自动化',
  obsidian: '工具方法',
};
