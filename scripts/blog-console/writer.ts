import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname!, '..', '..');

function slugify(text: string): string {
  return text
    .replace(/[^\w\s一-鿿-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function writeMdFile(markdown: string, outputDir: string): string | null {
  // Try to extract slug from frontmatter
  let slug = '';
  const slugMatch = markdown.match(/slug:\s*"([^"]+)"/);
  if (slugMatch) {
    slug = slugMatch[1];
  } else {
    // Fallback: extract from title line in frontmatter
    const titleMatch = markdown.match(/title:\s*"([^"]+)"/);
    if (titleMatch) {
      slug = slugify(titleMatch[1]);
    } else {
      // Last resort: extract from first markdown heading
      const headingMatch = markdown.match(/^# (.+)$/m);
      if (headingMatch) {
        slug = slugify(headingMatch[1]);
      }
    }
  }

  if (!slug) {
    console.log('  ✗ 无法从内容中提取标题生成 slug');
    return null;
  }

  // Ensure the markdown has a proper slug in frontmatter
  let finalMd = markdown;
  if (!slugMatch) {
    // Inject slug right after the first --- line
    finalMd = markdown.replace(
      /^(---\n)/,
      `$1slug: "${slug}"\n`,
    );
  }

  const dir = path.join(ROOT, outputDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, finalMd, 'utf-8');
  return filePath;
}
