// Placeholder until the real narrated intro video is uploaded.
// To wire it in: drop the file at public/media/workshop-intro.mp4 (or .webm) and replace
// the placeholder block below with:
//
//   <video controls preload="metadata" poster="/media/workshop-intro-poster.jpg" className="h-full w-full object-contain">
//     <source src="/media/workshop-intro.mp4" type="video/mp4" />
//   </video>
//
export function WorkshopIntroVideo() {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3.5 border border-hairline bg-ink-raised">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-signal">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="ml-0.5 text-signal">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div className="px-6 text-center">
        <div className="mb-1 text-[12px] font-bold text-bone">Video coming soon</div>
        <p className="m-0 max-w-[32ch] text-[11.5px] leading-[1.6] text-grey">
          Lunga walks through every tool here — and where the free version ends and a real build begins.
        </p>
      </div>
    </div>
  );
}
