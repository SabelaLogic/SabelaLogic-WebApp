import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { CONTRIBUTORS } from "@/lib/data/contributors";
import { CONTACT } from "@/lib/data/site-content";
import { AccentText } from "@/components/marketing/AccentText";
import { LiveDot } from "@/components/marketing/LiveDot";

export const metadata: Metadata = {
  title: "Team — Sabela Logic",
  description: "Sabela Logic is built by one operator, with specialists brought in per build where the job needs it.",
};

export default function TeamPage() {
  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <Nav />
      <main id="main-content">
        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-3.5 flex items-center gap-2 text-[11px] tracking-[0.22em] text-signal">
              <LiveDot />
              TEAM
            </div>
            <h1 className="mb-5 max-w-[26ch] font-display text-[clamp(30px,4.8vw,56px)] font-extrabold leading-[1.04] tracking-[-0.025em]">
              <AccentText text="One operator. Specialists brought in per build." />
            </h1>
            <p className="mb-14 max-w-[62ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
              Sabela Logic is built and run by one person — no account layer between you and the code. On
              builds where the job calls for it, specific specialists join for that piece of work. Listed
              here with what they cover and how to reach them directly.
            </p>

            {CONTRIBUTORS.length === 0 ? (
              <p className="text-[13px] text-grey">No outside specialists on active builds right now.</p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-px border border-hairline bg-hairline">
                {CONTRIBUTORS.map((person) => (
                  <div
                    key={person.slug}
                    className="flex flex-col gap-4 border border-transparent bg-ink px-[clamp(18px,2.4vw,28px)] py-[clamp(20px,2.8vw,30px)]"
                  >
                    <Image
                      src={person.image}
                      alt={person.name}
                      width={480}
                      height={480}
                      className="h-[120px] w-[120px] self-start rounded-[2px] border border-hairline object-cover"
                    />
                    <div>
                      <h2 className="m-0 mb-1.5 font-display text-[17px] font-semibold leading-[1.24] tracking-[-0.01em]">
                        <AccentText text={person.name} />
                      </h2>
                      <div className="mb-3 text-[10.5px] tracking-[0.14em] text-signal">
                        {person.role.toUpperCase()}
                      </div>
                      <p className="m-0 mb-4 text-[12.5px] leading-[1.7] text-bone-dim" style={{ textWrap: "pretty" }}>
                        {person.bio}
                      </p>
                    </div>
                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="mt-auto text-[12px] text-grey hover:text-signal"
                      >
                        {person.email} ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="mt-12 max-w-[62ch] text-[12.5px] leading-[1.7] text-grey">
              Everything shipped still runs through one architect end to end.{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-signal hover:text-signal-hover">
                {CONTACT.email}
              </a>{" "}
              is still the fastest way to reach the person building your project.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
