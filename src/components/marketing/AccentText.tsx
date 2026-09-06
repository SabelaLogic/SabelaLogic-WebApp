// Picks one letter per heading to render red — chosen for white/red contrast alone, not
// meaning, so selection is a deterministic hash (never the first letter, and stable across
// server/client renders — no Math.random(), which would cause a hydration mismatch).
export function pickAccentIndex(text: string, minIndex = 1): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  const letterPositions = [...text]
    .map((c, i) => (/[a-zA-Z]/.test(c) ? i : -1))
    .filter((i) => i >= minIndex);
  if (letterPositions.length === 0) return -1;
  return letterPositions[hash % letterPositions.length];
}

export function AccentText({ text }: { text: string }) {
  const idx = pickAccentIndex(text);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="sl-accent-letter">{text[idx]}</span>
      {text.slice(idx + 1)}
    </>
  );
}
