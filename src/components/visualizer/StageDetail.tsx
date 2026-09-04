import type { JourneyStage } from "@/lib/types";

export function StageDetail({ stage }: { stage: JourneyStage }) {
  return (
    <div className="mt-7 flex flex-col gap-[26px] border-l border-[var(--a-line)] pl-[26px]">
      <div>
        <div className="mb-3 font-mono text-[10px] tracking-[0.16em] text-[#565b60]">WHAT&rsquo;S INCLUDED</div>
        <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
          {stage.includes.map((i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-[1.5] text-[#b9bec3]">
              <span className="font-mono text-[12px] text-[var(--a)]">—</span>
              {i}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mb-3 font-mono text-[10px] tracking-[0.16em] text-[#565b60]">TIMING</div>
        <div className="text-[15px] text-[#b9bec3]">{stage.timing}</div>
      </div>
      <div className="flex flex-col gap-[18px]">
        {stage.faq.map((f) => (
          <div key={f.q}>
            <div className="mb-[7px] text-[15px] text-[#e8eaed]">{f.q}</div>
            <div className="max-w-[520px] text-[14px] leading-[1.6] text-[#8d9298]" style={{ textWrap: "pretty" }}>
              {f.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
