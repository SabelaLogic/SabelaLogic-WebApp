import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { NewsletterSection } from "@/components/marketing/NewsletterSection";
import { BlogCTA } from "@/components/marketing/BlogCTA";
import { BLOG_POSTS } from "@/lib/data/blog-content";
import { AccentText } from "@/components/marketing/AccentText";
import { LiveDot } from "@/components/marketing/LiveDot";

export const metadata: Metadata = {
  title: "Blog — Sabela Logic",
  description: "Practical reads on where software and automation actually pay off for South African businesses.",
};

export default function BlogIndex() {
  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <Nav />
      <main id="main-content">
        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-3.5 flex items-center gap-2 text-[11px] tracking-[0.22em] text-signal">
              <LiveDot />
              BLOG
            </div>
            <h1 className="mb-5 max-w-[24ch] font-display text-[clamp(30px,4.8vw,56px)] font-extrabold leading-[1.04] tracking-[-0.025em]">
              <AccentText text="Systems, use cases, and what they actually cost." />
            </h1>
            <p className="mb-12 max-w-[62ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
              Short, specific reads on where software and automation pay off for South African businesses — plus
              the occasional look inside how Sabela Logic itself is built and run.
            </p>

            <BlogCTA />

            <div className="mb-14 max-w-[720px]">
              <NewsletterSection />
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-px border border-hairline bg-hairline">
              {BLOG_POSTS.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="sl-card-hover flex flex-col gap-4 border border-transparent bg-ink px-[clamp(18px,2.4vw,28px)] py-[clamp(20px,2.8vw,30px)]"
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] tracking-[0.16em] text-grey-darker">
                    <span className="text-signal">{post.tag}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="m-0 font-display text-[19px] font-semibold leading-[1.24] tracking-[-0.01em]">
                    <AccentText text={post.title} />
                  </h2>
                  <p className="m-0 flex-1 text-[12.5px] leading-[1.7] text-bone-dim" style={{ textWrap: "pretty" }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-grey">
                    <span>{post.date}</span>
                    <span className="text-signal">READ →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
