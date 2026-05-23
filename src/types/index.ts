export interface PostFrontmatter {
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

export interface PostHeading {
  id: string;
  text: string;
  level: number;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  html: string;
  headings: PostHeading[];
  wordCount: number;
  readingTime: number;
}

export interface GardenSnippet {
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

export interface ContentData {
  posts: Post[];
  snippets: GardenSnippet[];
  searchIndex: SearchIndexEntry[];
}

export interface SearchIndexEntry {
  slug: string;
  title: string;
  tags: string[];
  excerpt: string;
  category: string;
}

export interface Category {
  name: string;
  count: number;
}

export interface NavItem {
  label: string;
  href: string;
}
