import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
};

function parseDate(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await remark().use(remarkHtml).process(markdown);
  return String(file);
}

export function getAllPostsMeta(): BlogPostMeta[] {
  const slugs = getPostSlugs();
  const posts: BlogPostMeta[] = [];

  for (const slug of slugs) {
    const fullPath = path.join(BLOG_DIR, `${slug}.md`);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);
    const title =
      typeof data.title === "string" ? data.title : slug.replace(/-/g, " ");
    const date = typeof data.date === "string" ? data.date : "";
    const description =
      typeof data.description === "string" ? data.description : "";
    posts.push({ slug, title, date, description });
  }

  return posts.sort(
    (a, b) => parseDate(b.date) - parseDate(a.date),
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const title =
    typeof data.title === "string" ? data.title : slug.replace(/-/g, " ");
  const date = typeof data.date === "string" ? data.date : "";
  const description =
    typeof data.description === "string" ? data.description : "";
  const contentHtml = await markdownToHtml(content);

  return { slug, title, date, description, contentHtml };
}
