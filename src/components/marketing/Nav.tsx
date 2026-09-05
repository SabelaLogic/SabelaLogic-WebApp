import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#work", label: "WORK" },
  { href: "#proof", label: "PROOF" },
  { href: "#process", label: "PROCESS" },
  { href: "#services", label: "SERVICES" },
  { href: "/blog", label: "BLOG" },
];

export function Nav() {
  return (
    <div className="sticky top-0 z-50 flex h-[58px] items-center justify-between gap-6 border-b border-hairline bg-ink/86 px-[clamp(16px,4vw,48px)] backdrop-blur-[14px]">
      <Link href="#top" className="flex items-center gap-[11px] text-bone">
        <Image
          src="/brand/monogram.png"
          alt="Sabela Logic"
          width={18}
          height={28}
          className="block h-7 w-auto"
        />
        <span className="text-[13.5px] font-semibold tracking-[0.17em]">
          SABELA<span className="text-signal">.</span>LOGIC
        </span>
      </Link>
      <div className="flex items-center gap-[clamp(12px,2.2vw,30px)] font-mono text-[11.5px] tracking-[0.1em]">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="sl-nav-link">
            {link.label}
          </a>
        ))}
        <Link
          href="/login"
          className="sl-signin flex items-center gap-2 rounded-[2px] px-3.5 py-1.5"
        >
          <span className="sl-signin-dot" />
          SIGN IN
        </Link>
        <a
          href="#contact"
          className="sl-btn-outline flex items-center gap-[7px] rounded-[2px] border border-signal px-3.5 py-1.5 text-signal"
        >
          START A BUILD
        </a>
      </div>
    </div>
  );
}
