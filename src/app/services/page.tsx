import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { AccentText } from "@/components/marketing/AccentText";
import { LiveDot } from "@/components/marketing/LiveDot";
import { PaystackDepositButton } from "@/components/monetization/PaystackDepositButton";
import { GUMROAD_BASE, SERVICE_OFFERS } from "@/lib/monetization/config";

export const metadata: Metadata = pageMetadata({
  title: "Fixed-Price Setup Services — Sabela Logic",
  description:
    "Fixed-price, pay-first setups: WhatsApp booking with Paystack on WordPress, n8n lead follow-up automation, and Next.js + Paystack integration.",
  path: "/services",
});

const zar = (n: number) => `R${n.toLocaleString("en-ZA")}`;

export default function ServicesPage() {
  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <Nav />
      <main id="main-content">
        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
          <div className="mx-auto max-w-[1000px]">
            <div className="mb-3.5 flex items-center gap-2 text-[11px] tracking-[0.22em] text-signal">
              <LiveDot />
              FIXED-PRICE SERVICES
            </div>
            <h1 className="mb-5 max-w-[24ch] font-display text-[clamp(30px,4.8vw,56px)] font-extrabold leading-[1.04] tracking-[-0.025em]">
              <AccentText text="Clear scope. Fixed price. Pay a deposit to start." />
            </h1>
            <p className="max-w-[62ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
              Three setups with a defined scope. Pay the deposit through Paystack, and I&rsquo;ll email you to
              collect access details and agree a start date. The balance is due on handover. Prices are in South
              African rand; Paystack converts for international cards.
            </p>
          </div>
        </section>

        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(40px,5vw,64px)]">
          <div className="mx-auto grid max-w-[1000px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-px border border-hairline bg-hairline">
            {SERVICE_OFFERS.map((offer) => (
              <article key={offer.id} className="flex flex-col gap-4 bg-ink px-6 py-7">
                <h2 className="m-0 font-display text-[clamp(18px,2.2vw,22px)] font-semibold tracking-[-0.01em]">
                  {offer.name}
                </h2>
                <p className="m-0 text-[13px] leading-[1.75] text-bone-dim">{offer.summary}</p>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[12.5px] text-bone-dim">
                  {offer.includes.map((i) => (
                    <li key={i}>
                      <span className="text-signal">+ </span>
                      {i}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto text-[12px] text-grey">
                  <div className="text-[20px] font-bold text-bone">{zar(offer.priceZar)}</div>
                  Deposit {zar(offer.depositZar)} up front
                </div>
                <PaystackDepositButton amountZar={offer.depositZar} item={`service:${offer.id}`} label="PAY DEPOSIT →" />
                {offer.gumroadSlug && (
                  <a
                    href={`${GUMROAD_BASE}${offer.gumroadSlug}`}
                    target="_blank"
                    rel="noopener"
                    className="text-[11.5px] text-grey underline-offset-4 hover:text-signal hover:underline"
                  >
                    Prefer to do it yourself? Get the guide →
                  </a>
                )}
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-[1000px] text-[11.5px] text-grey">
            Need something outside these scopes?{" "}
            <Link href="/start-a-build" className="text-signal underline-offset-4 hover:underline">
              Start a build →
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
