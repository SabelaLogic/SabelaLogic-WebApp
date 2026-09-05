import Image from "next/image";
import { FOOTER_COLUMNS } from "@/lib/data/site-content";

export function Footer() {
  return (
    <footer className="px-[clamp(16px,4vw,48px)] pt-[clamp(40px,5vw,64px)] pb-10">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start justify-between gap-7">
        <div className="flex flex-col gap-[18px]">
          <Image
            src="/brand/stacked.png"
            alt="Sabela Logic — systems, software, AI"
            width={117}
            height={140}
            className="block h-[140px] w-[117px] self-start"
          />
          <span className="max-w-[30ch] text-[11.5px] leading-[1.8] text-grey">
            Pretoria, Rustenburg, Bloemfontein, Cape Town, Port Elizabeth, South Africa.
            <br />
            Systems, software and AI — built by one person, end to end.
          </span>
        </div>
        <div className="flex flex-wrap gap-[clamp(24px,4vw,56px)]">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.head} className="flex flex-col gap-[11px]">
              <span className="text-[10px] tracking-[0.16em] text-grey-darker">{col.head}</span>
              {col.links.map((lk) => (
                <a key={lk.label} href={lk.href} className="text-[12px] text-bone-dim hover:text-signal">
                  {lk.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-9 flex max-w-[1180px] flex-wrap justify-between gap-3.5 border-t border-hairline pt-[22px] text-[11px] text-grey-dark">
        <span>© 2026 Sabela Logic. All builds owned outright by the client on final payment.</span>
        <span>Speak the code.</span>
      </div>
    </footer>
  );
}
