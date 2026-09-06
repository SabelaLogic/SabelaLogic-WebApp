import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { NewsletterSection } from "@/components/marketing/NewsletterSection";
import { BLOG_POSTS, getBlogPost } from "@/lib/data/blog-content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return {
    title: post ? `${post.title} — Sabela Logic` : "Sabela Logic",
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
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
            <div className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] tracking-[0.16em] text-grey-darker">
              <span className="text-signal">{post.tag}</span>
              <span>·</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="mb-8 font-display text-[clamp(28px,4.4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.025em]">
              {post.title}
            </h1>
            <div className="flex flex-col gap-5">
              {post.body.map((para, i) => (
                <p key={i} className="m-0 text-[15px] leading-[1.85] text-bone-dim" style={{ textWrap: "pretty" }}>
                  {para}
                </p>
              ))}
            </div>
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
