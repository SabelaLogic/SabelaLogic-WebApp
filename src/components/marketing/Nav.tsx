"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/#work", label: "WORK" },
  { href: "/#proof", label: "PROOF" },
  { href: "/#process", label: "PROCESS" },
  { href: "/#services", label: "SERVICES" },
  { href: "/#contact", label: "CONTACT" },
  { href: "/blog", label: "BLOG" },
  { href: "/workshop", label: "WORKSHOP" },
  { href: "/team", label: "TEAM" },
  { href: "/portal", label: "TRACK YOUR PROJECT" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink/86 backdrop-blur-[14px]">
      <div className="flex h-[58px] items-center justify-between gap-6 border-b border-hairline px-[clamp(16px,4vw,48px)]">
        <Link href="/" className="flex items-center gap-[11px] text-bone" onClick={() => setOpen(false)}>
          <Image
            src="/brand/monogram.png"
            alt="Sabela Logic"
            width={18}
            height={28}
            className="sl-logo-swivel block h-7 w-auto"
          />
          <span className="text-[13.5px] font-semibold tracking-[0.17em]">
            SABELA<span className="text-signal">.</span>LOGIC
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-[clamp(12px,2.2vw,30px)] font-mono text-[11.5px] tracking-[0.1em] md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="sl-nav-link">
              {link.label}
            </a>
          ))}
          <Link href="/login" className="sl-signin flex items-center gap-2 rounded-[2px] px-3.5 py-1.5">
            <span className="sl-signin-dot" />
            SIGN IN
          </Link>
          <a
            href="/start-a-build"
            className="sl-btn-outline flex items-center gap-[7px] rounded-[2px] border border-signal px-3.5 py-1.5 text-signal"
          >
            START A BUILD
          </a>
          <a href="/sabelalogicai.html" className="sl-ai-btn">
            <span className="sl-ai-dot" />
            SABELALOGICAI
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-[2px] border border-hairline md:hidden"
        >
          <span
            className="h-px w-[18px] bg-bone transition-transform duration-200"
            style={open ? { transform: "translateY(3px) rotate(45deg)" } : undefined}
          />
          <span
            className="h-px w-[18px] bg-bone transition-opacity duration-200"
            style={open ? { opacity: 0 } : undefined}
          />
          <span
            className="h-px w-[18px] bg-bone transition-transform duration-200"
            style={open ? { transform: "translateY(-3px) rotate(-45deg)" } : undefined}
          />
        </button>
      </div>

      <nav
        id="mobile-nav-panel"
        aria-label="Mobile"
        inert={!open}
        className="sl-drawer grid border-b border-hairline bg-ink md:hidden"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 px-[clamp(16px,4vw,48px)] py-4 font-mono text-[13px] tracking-[0.08em]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-hairline-soft py-3 text-bone-dim"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border-b border-hairline-soft py-3 text-bone-dim"
            >
              <span className="sl-signin-dot" />
              SIGN IN
            </Link>
            <a
              href="/start-a-build"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-[7px] rounded-[2px] border border-signal bg-signal px-3.5 py-3 font-bold text-ink"
            >
              START A BUILD
            </a>
            <a
              href="/sabelalogicai.html"
              onClick={() => setOpen(false)}
              className="sl-ai-btn mt-3 justify-center py-3"
            >
              <span className="sl-ai-dot" />
              SABELALOGICAI
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
