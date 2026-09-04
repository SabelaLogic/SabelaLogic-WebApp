export function DepositIcon() {
  return (
    <>
      <span
        className="absolute inset-0 rounded-full border border-[var(--a-line)]"
        style={{ animation: "vz-pulse 2.8s cubic-bezier(.2,.7,.2,1) infinite" }}
      />
      <span
        className="absolute inset-0 rounded-full border border-[var(--a-line)]"
        style={{ animation: "vz-pulse 2.8s cubic-bezier(.2,.7,.2,1) infinite", animationDelay: "1.4s" }}
      />
      <svg width={26} height={26} viewBox="0 0 26 26" fill="none" className="relative">
        <path
          d="M5 13.6 L10.4 19 L21 7"
          stroke="var(--a)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 34, strokeDashoffset: 34, animation: "vz-draw .9s cubic-bezier(.2,.7,.2,1) .25s forwards" }}
        />
      </svg>
    </>
  );
}

export function OnboardingIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <rect x={5.5} y={3.5} width={17} height={21} rx={2} stroke="#3d4247" strokeWidth={1.2} />
      <path d="M9.5 9.5h9M9.5 13.5h9" stroke="#3d4247" strokeWidth={1.2} strokeLinecap="round" />
      <path
        d="M9 20c1.6-2.4 2.7 1.6 4.2-.4 1.1-1.5 2.2 1.4 4.8-1.2"
        stroke="var(--a)"
        strokeWidth={1.4}
        strokeLinecap="round"
        style={{ strokeDasharray: 22, strokeDashoffset: 22, animation: "vz-draw 1.6s cubic-bezier(.2,.7,.2,1) .4s infinite" }}
      />
    </svg>
  );
}

export function BuildIcon() {
  return (
    <>
      <span
        className="absolute top-0 bottom-0 w-2/5"
        style={{
          background: "linear-gradient(90deg, transparent, var(--a-dim), transparent)",
          animation: "vz-scan 2.6s linear infinite",
        }}
      />
      <span className="relative flex h-[22px] items-end gap-[3px]">
        {[16, 22, 11].map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-sm opacity-85"
            style={{ height: h, background: "var(--a)", animation: "vz-breathe 2.2s ease-in-out infinite", animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </span>
    </>
  );
}

export function GoLiveIcon() {
  return (
    <>
      <span
        className="absolute bottom-3 w-[2px] rounded-sm"
        style={{ height: 14, background: "linear-gradient(var(--a), transparent)", animation: "vz-lift 2.2s ease-out infinite" }}
      />
      <span
        className="absolute bottom-3 left-[38%] w-[2px] rounded-sm"
        style={{ height: 10, background: "linear-gradient(var(--a), transparent)", animation: "vz-lift 2.2s ease-out .7s infinite" }}
      />
      <svg width={22} height={22} viewBox="0 0 22 22" fill="none" className="relative">
        <path d="M11 18V5m0 0 5 5m-5-5-5 5" stroke="var(--a)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );
}

export function RetainerIcon() {
  return (
    <>
      <span
        className="absolute inset-[6px] rounded-full border border-transparent"
        style={{ borderTopColor: "var(--a)", animation: "vz-spin 3.4s linear infinite" }}
      />
      <span
        className="absolute inset-[13px] rounded-full border border-transparent"
        style={{ borderBottomColor: "var(--a-line)", animation: "vz-spin 5.2s linear infinite reverse" }}
      />
      <span
        className="relative h-[7px] w-[7px] rounded-full"
        style={{ background: "var(--a)", animation: "vz-breathe 2.6s ease-in-out infinite" }}
      />
    </>
  );
}
