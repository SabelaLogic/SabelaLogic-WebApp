import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { NewsletterSection } from "@/components/marketing/NewsletterSection";
import { BLOG_POSTS, getBlogPost } from "@/lib/data/blog-content";
import { AccentText } from "@/components/marketing/AccentText";
import { LiveDot } from "@/components/marketing/LiveDot";
import { SITE_NAME, SITE_URL, absoluteUrl, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { BLOG_POSTS_UPDATED, displayDateToIso } from "@/lib/data/content-dates";

function articleJsonLd(post: NonNullable<ReturnType<typeof getBlogPost>>) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const published = displayDateToIso(post.date);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        url,
        mainEntityOfPage: url,
        ...(published ? { datePublished: published } : {}),
        dateModified: BLOG_POSTS_UPDATED,
        inLanguage: "en",
        image: absoluteUrl("/og/default"),
        author: { "@type": "Person", name: "Lunga Xhamela", url: absoluteUrl("/team") },
        publisher: { "@id": `${SITE_URL}/#organization`, "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Sabela Logic" };
  return pageMetadata({
    // Long post titles already fill the ~60-char SERP width; skip the brand suffix there.
    title: post.title.length > 55 ? post.title : `${post.title} — Sabela Logic`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogType: "article",
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const published = displayDateToIso(post.date);
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <JsonLd data={articleJsonLd(post)} />
      <Nav />
      <main id="main-content">
        <article className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
          <div className="mx-auto max-w-[720px]">
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-[11.5px] tracking-[0.08em] text-grey hover:text-signal"
            >
              ← ALL ARTICLES
            </Link>
            <div className="mb-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] tracking-[0.16em] text-grey-darker">
              <LiveDot />
              <span className="text-signal">{post.tag}</span>
              <span>·</span>
              {published ? <time dateTime={published}>{post.date}</time> : <span>{post.date}</span>}
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="mb-8 font-display text-[clamp(28px,4.4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.025em]">
              <AccentText text={post.title} />
            </h1>
            <div className="flex flex-col gap-5">
              {post.body.map((para, i) => (
                <p key={i} className="m-0 text-[15px] leading-[1.85] text-bone-dim" style={{ textWrap: "pretty" }}>
                  {para}
                </p>
              ))}
            </div>
            <nav aria-label="More from Sabela Logic" className="mt-14 border-t border-hairline pt-8">
              <h2 className="mb-4 text-[11px] font-normal tracking-[0.18em] text-grey">KEEP READING</h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {more.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="text-[14px] text-bone hover:text-signal">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mb-0 mt-6 text-[12px] text-grey">
                Want this built for your business?{" "}
                <Link href="/start-a-build" className="text-signal underline-offset-4 hover:underline">
                  Start a build
                </Link>{" "}
                or see the{" "}
                <Link href="/services" className="text-signal underline-offset-4 hover:underline">
                  fixed-price services
                </Link>
                .
              </p>
            </nav>
            <div className="mt-14">
              <NewsletterSection />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
