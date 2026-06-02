import { crawlJuejin } from './crawler';
import { formatWithLLM } from './formatter';
import { writeMdFile } from './writer';
import { CONFIG } from './config';

function parseArgs() {
  const args = process.argv.slice(2);
  const title = args.find((a) => !a.startsWith('-')) || '';
  const tagsArg = (args[args.indexOf(title) + 1] || '').replace(/，/g, ',');
  const tags = tagsArg && !tagsArg.startsWith('-')
    ? tagsArg.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  return { title, tags };
}

async function main() {
  const { title, tags } = parseArgs();

  if (!title || tags.length === 0) {
    console.log(`
🖊  Anine's Blog Console

用法:  npm run console -- "<标题>" <标签1>,<标签2>,<标签3>

示例:  npm run console -- "玩转 JavaScript 中的 this" JavaScript,this,前端
       npm run console -- "React 19 新特性深度解析" React,TypeScript,Vite
       npm run console -- "AI Agent 开发实战" Python,LangChain,AI

流程:  输入标题+标签 → 爬取掘金 → DeepSeek LLM 整理 → 输出到 blog/imported/
`);
    return;
  }

  console.log(`\n🖊  Anine's Blog Console`);
  console.log(`  标题: ${title}`);
  console.log(`  标签: ${tags.join(', ')}\n`);

  // Crawl
  console.log('⏳ 爬取掘金...');
  const sources = await crawlJuejin(title, tags, 8);
  if (sources.length === 0) {
    console.log('  ✗ 未找到相关文章\n  提示: 尝试换更通用的关键词，或检查网络连接\n');
    return;
  }
  console.log(`  ✓ 找到 ${sources.length} 篇\n`);
  sources.slice(0, 5).forEach((s, i) => {
    console.log(`    ${i + 1}. ${s.title.slice(0, 50)}...`);
  });
  console.log('');

  // Format
  const apiKey = CONFIG.deepseekApiKey;
  const useLLM = !!apiKey;
  console.log(useLLM ? '⏳ DeepSeek LLM 整理...' : '⏳ 整理 Markdown...');
  const markdown = await formatWithLLM(title, tags, sources, apiKey);

  // Write
  const filePath = writeMdFile(markdown, CONFIG.outputDir);
  if (filePath) {
    console.log(`  ✅ ${filePath}\n`);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
