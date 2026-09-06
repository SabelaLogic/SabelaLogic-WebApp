export interface WorkshopTool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tag: string;
}

export const WORKSHOP_TOOLS: WorkshopTool[] = [
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Words, characters, reading time",
    description: "Paste text, get an instant word, character, sentence and reading-time count.",
    tag: "TEXT",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, validate, minify",
    description: "Paste JSON, get it pretty-printed, validated and minified — with a clear error if it's broken.",
    tag: "CODE",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Shrink images in your browser",
    description: "Drag in a JPG, PNG or WebP and compress it on your own device — nothing is ever uploaded.",
    tag: "IMAGE",
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    tagline: "Combine images into one PDF",
    description: "Turn one or more images into a single downloadable PDF, entirely in your browser.",
    tag: "IMAGE",
  },
  {
    slug: "ux-analyzer",
    name: "Website UX Analyzer",
    tagline: "A free structural scan of any site",
    description:
      "Get an instant score across simplicity, navigation, performance and accessibility — the same framework used to audit this site.",
    tag: "SCAN",
  },
];

export function getWorkshopTool(slug: string): WorkshopTool | undefined {
  return WORKSHOP_TOOLS.find((t) => t.slug === slug);
}
