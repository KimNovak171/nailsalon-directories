import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";

const siteUrl = "https://nailsalondirectories.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Article not found" };
  }
  return {
    title: post.title,
    description: post.description || undefined,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      url: `/blog/${slug}`,
      siteName: "NailSalonDirectories.com",
      type: "article",
      publishedTime: post.date || undefined,
    },
  };
}

function formatDisplayDate(isoDate: string): string {
  const t = Date.parse(isoDate);
  if (Number.isNaN(t)) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(t));
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "NailSalonDirectories.com", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav className="text-xs text-slate-600">
        <Link href="/blog" className="font-medium text-teal hover:text-teal-soft">
          ← Blog
        </Link>
      </nav>

      <article className="mt-6">
        <header className="space-y-3 border-b border-teal/20 pb-8">
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
            {post.title}
          </h1>
          {post.date ? (
            <p>
              <time
                dateTime={post.date}
                className="text-sm font-medium text-slate-500"
              >
                {formatDisplayDate(post.date)}
              </time>
            </p>
          ) : null}
          {post.description ? (
            <p className="text-sm leading-relaxed text-slate-600">
              {post.description}
            </p>
          ) : null}
        </header>

        <div
          className="blog-md prose-nails mt-8 space-y-4 text-sm leading-relaxed text-slate-700 [&_a]:font-medium [&_a]:text-teal [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-teal-soft [&_blockquote]:border-l-4 [&_blockquote]:border-teal/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_code]:rounded [&_code]:bg-surface-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy [&_h2]:first:mt-0 [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_strong]:font-semibold [&_strong]:text-navy [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </div>
  );
}
