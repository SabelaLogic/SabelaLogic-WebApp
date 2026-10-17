export interface WorkshopTool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tag: string;
  /** Keyword-first H1 shown on the tool page. Cards keep the short `name`. */
  heading: string;
  /** <title> without the brand suffix — keep it keyword-first, ~45 chars. */
  seoTitle: string;
  /** Meta description, ≤155 chars. Lead with the job, then the privacy angle. */
  seoDescription: string;
  /** Schema.org applicationCategory for the WebApplication JSON-LD. */
  category: "UtilitiesApplication" | "DeveloperApplication" | "MultimediaApplication" | "DesignApplication";
  /** One-line feature list for structured data. */
  features: string[];
  /** False when the tool needs a server round-trip (e.g. fetching a URL). */
  runsInBrowser: boolean;
}

export const WORKSHOP_TOOLS: WorkshopTool[] = [
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Words, characters, reading time",
    description: "Paste text, get an instant word, character, sentence and reading-time count.",
    tag: "TEXT",
    heading: "Word Counter & Character Counter",
    seoTitle: "Word Counter & Character Counter – Free Online",
    seoDescription:
      "Count words, characters, sentences and reading time instantly. Free, no signup — your text never leaves your browser.",
    category: "UtilitiesApplication",
    features: ["Word count", "Character count", "Sentence count", "Reading time estimate"],
    runsInBrowser: true,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, validate, minify",
    description: "Paste JSON, get it pretty-printed, validated and minified — with a clear error if it's broken.",
    tag: "CODE",
    heading: "JSON Formatter & Validator",
    seoTitle: "JSON Formatter & Validator – Free, Private",
    seoDescription:
      "Format, validate and minify JSON online with clear error messages. Free, no signup, and your data never leaves your browser.",
    category: "DeveloperApplication",
    features: ["Pretty-print JSON", "Validate JSON with error location", "Minify JSON"],
    runsInBrowser: true,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Shrink images in your browser",
    description: "Drag in a JPG, PNG or WebP and compress it on your own device — nothing is ever uploaded.",
    tag: "IMAGE",
    heading: "Image Compressor — JPG, PNG & WebP",
    seoTitle: "Image Compressor – Compress JPG, PNG & WebP Free",
    seoDescription:
      "Reduce image file size in seconds with an adjustable quality slider. Free, no signup — images are compressed on your device, never uploaded.",
    category: "MultimediaApplication",
    features: ["Compress JPG, PNG and WebP", "Adjustable quality", "Before/after size comparison", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    tagline: "Combine images into one PDF",
    description: "Turn one or more images into a single downloadable PDF, entirely in your browser.",
    tag: "IMAGE",
    heading: "Image to PDF Converter",
    seoTitle: "Image to PDF – Convert JPG & PNG to PDF Free",
    seoDescription:
      "Combine one or more JPG or PNG images into a single PDF. Free, no signup, no watermark — files never leave your device.",
    category: "UtilitiesApplication",
    features: ["Convert JPG and PNG to PDF", "Combine multiple images into one PDF", "No watermark", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "ux-analyzer",
    name: "Website UX Analyzer",
    tagline: "A free structural scan of any site",
    description:
      "Get an instant score across simplicity, navigation, performance and accessibility — the same framework used to audit this site.",
    tag: "SCAN",
    heading: "Website UX Analyzer",
    seoTitle: "Website UX Analyzer – Free UX & Accessibility Check",
    seoDescription:
      "Paste any URL for an instant score across simplicity, navigation, performance and accessibility, with plain-English findings. Free, no signup.",
    category: "DeveloperApplication",
    features: ["UX score out of 100", "Navigation and hierarchy checks", "Performance signals", "Accessibility checks"],
    runsInBrowser: false,
  },
];

export function getWorkshopTool(slug: string): WorkshopTool | undefined {
  return WORKSHOP_TOOLS.find((t) => t.slug === slug);
}
