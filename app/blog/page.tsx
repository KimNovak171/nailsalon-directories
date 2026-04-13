import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and tips on nail care, salon visits, manicures, pedicures, and choosing the right nail salon.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | NailSalonDirectories.com",
    description:
      "Guides and tips on nail care, salon visits, and choosing the right nail salon.",
    url: "/blog",
    siteName: "NailSalonDirectories.com",
    type: "website",
  },
};

function formatDisplayDate(isoDate: string): string {
  const t = Date.parse(isoDate);
  if (Number.isNaN(t)) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(t));
}

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Nail care &amp; salons
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">Blog</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Practical guides on manicures, pedicures, nail health, and getting the
          most from your salon visits.
        </p>
      </header>

      <ul className="mt-10 divide-y divide-teal/15 border-t border-teal/15">
        {posts.map((post) => (
          <li key={post.slug} className="py-6">
            <article className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-semibold text-navy">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-navy transition-colors hover:text-teal-soft"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.description ? (
                  <p className="text-sm leading-relaxed text-slate-600">
                    {post.description}
                  </p>
                ) : null}
              </div>
              {post.date ? (
                <time
                  dateTime={post.date}
                  className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500"
                >
                  {formatDisplayDate(post.date)}
                </time>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
