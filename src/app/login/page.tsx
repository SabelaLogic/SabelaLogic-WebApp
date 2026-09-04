import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Sabela Logic Client Portal",
};

export default function LoginPage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-ink font-display text-bone"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        animation: "sl-drift-grid 24s linear infinite",
      }}
    >
      <div className="flex h-[58px] items-center justify-between gap-5 border-b border-hairline px-[clamp(16px,4vw,48px)]">
        <Link href="/" className="flex items-center gap-[11px] text-bone">
          <Image src="/brand/monogram.png" alt="Sabela Logic" width={18} height={28} className="block h-7 w-auto" />
          <span className="font-mono text-[13.5px] font-semibold tracking-[0.17em]">
            SABELA<span className="text-signal">.</span>LOGIC
          </span>
        </Link>
        <Link href="/" className="font-mono text-[11px] tracking-[0.12em] text-grey hover:text-bone">
          ← BACK TO SITE
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-[clamp(16px,4vw,48px)] py-[clamp(40px,8vw,96px)]">
        <LoginForm />
      </div>

      <div className="flex flex-wrap justify-between gap-5 border-t border-hairline px-[clamp(16px,4vw,48px)] py-5 font-mono text-[10px] tracking-[0.16em] text-grey">
        <span>SABELALOGIC · CLIENT PORTAL</span>
        <span>BLOEMFONTEIN, ZA</span>
      </div>
    </div>
  );
}
