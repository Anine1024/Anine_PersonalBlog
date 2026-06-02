import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeShiki from '@shikijs/rehype';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const GARDEN_DIR = path.join(ROOT, 'src', 'content', 'garden');
const OUTPUT = path.join(ROOT, 'src', 'generated', 'content.json');

interface PostFrontmatter {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  readingTime: number;
  featured?: boolean;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  html: string;
  headings: Heading[];
  wordCount: number;
  readingTime: number;
}

interface GardenSnippet {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
    relatedPost?: string;
  };
  html: string;
}

function slugify(text: string): string {
  const cleaned = text
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\-一-鿿㐀-䶿]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  if (cleaned) return cleaned;
  // Fallback: hash for purely-symbolic headings
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return 'heading-' + Math.abs(hash).toString(36);
}

function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /<h([2-3])\b[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    });
  }
  return headings;
}

function wrapImagesWithLightbox(html: string): string {
  return html.replace(
    /<img\s+src="([^"]*)"\s+alt="([^"]*)"\s*\/?>/g,
    (_match, src, alt) => {
      return `<img src="${src}" alt="${alt || ''}" class="lightbox-img" />`;
    }
  );
}

function addHeadingIds(html: string): string {
  return html.replace(
    /<(h[2-3])>(.*?)<\/\1>/g,
    (_match: string, tag: string, content: string) => {
      const id = slugify(content.replace(/<[^>]*>/g, ''));
      return `<${tag} id="${id}">${content}</${tag}>`;
    }
  );
}

async function processMarkdown(filePath: string): Promise<{ frontmatter: Record<string, unknown>; html: string }> {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      theme: 'github-dark',
      langs: ['js', 'ts', 'tsx', 'python', 'html', 'css', 'bash', 'json', 'yaml', 'markdown', 'http', 'nginx'],
    })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const vfile = await processor.process(content);
  let html = String(vfile.value);

  // Post-process: add IDs to headings
  html = addHeadingIds(html);

  // Post-process: wrap images
  html = wrapImagesWithLightbox(html);

  return { frontmatter: data, html };
}

function getWordCount(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

async function build() {
  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const posts: Post[] = [];
  const snippets: GardenSnippet[] = [];

  // Recursively collect .md files from blog directory (supports subdirectories like imported/)
  function collectMdFiles(dir: string): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...collectMdFiles(fullPath));
      } else if (entry.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  // Process blog posts
  const blogFiles = collectMdFiles(BLOG_DIR);
  for (const filePath of blogFiles) {
      const { frontmatter, html } = await processMarkdown(filePath);

      const slug = (frontmatter.slug as string) || slugify(path.basename(filePath, '.md'));
      const wordCount = getWordCount(html);
      const headings = extractHeadings(html);

      posts.push({
        slug,
        frontmatter: {
          slug,
          title: (frontmatter.title as string) || path.basename(filePath, '.md'),
          date: (frontmatter.date as string) || new Date().toISOString().split('T')[0],
          updated: frontmatter.updated as string | undefined,
          category: (frontmatter.category as string) || 'Uncategorized',
          tags: (frontmatter.tags as string[]) || [],
          excerpt: (frontmatter.excerpt as string) || '',
          coverImage: frontmatter.coverImage as string | undefined,
          readingTime: frontmatter.readingTime as number || Math.max(1, Math.ceil(wordCount / 250)),
          featured: frontmatter.featured as boolean | undefined,
        },
        html,
        headings,
        wordCount,
        readingTime: frontmatter.readingTime as number || Math.max(1, Math.ceil(wordCount / 250)),
      });
    }

    // Sort by date, newest first
    posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

  // Process garden snippets
  if (fs.existsSync(GARDEN_DIR)) {
    const gardenFiles = fs.readdirSync(GARDEN_DIR).filter((f) => f.endsWith('.md'));
    for (const file of gardenFiles) {
      const filePath = path.join(GARDEN_DIR, file);
      const { frontmatter, html } = await processMarkdown(filePath);

      snippets.push({
        slug: (frontmatter.slug as string) || slugify(path.basename(file, '.md')),
        frontmatter: {
          title: (frontmatter.title as string) || path.basename(file, '.md'),
          date: (frontmatter.date as string) || new Date().toISOString().split('T')[0],
          tags: (frontmatter.tags as string[]) || [],
          excerpt: (frontmatter.excerpt as string) || '',
          relatedPost: frontmatter.relatedPost as string | undefined,
        },
        html,
      });
    }
  }

  // Build search index
  const searchIndex = posts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    tags: p.frontmatter.tags,
    excerpt: p.frontmatter.excerpt,
    category: p.frontmatter.category,
  }));

  const output = {
    posts,
    snippets,
    searchIndex,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`Built content: ${posts.length} posts, ${snippets.length} snippets`);
}

build().catch(console.error);
