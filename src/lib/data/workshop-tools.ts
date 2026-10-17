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
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    tagline: "Combine PDFs into one",
    description: "Drop in several PDFs, put them in order, and download a single merged file. Nothing is uploaded.",
    tag: "PDF",
    heading: "Merge PDF Files",
    seoTitle: "Merge PDF Online Free – Combine PDFs, No Upload",
    seoDescription:
      "Combine multiple PDF files into one in your browser. Reorder files, then download. Free, no signup, no watermark — PDFs never leave your device.",
    category: "UtilitiesApplication",
    features: ["Merge unlimited PDFs", "Reorder files before merging", "No watermark", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    tagline: "Extract pages or split every page",
    description: "Pull out the pages you need into a new PDF, or split every page into its own file, on your own device.",
    tag: "PDF",
    heading: "Split PDF & Extract Pages",
    seoTitle: "Split PDF Online Free – Extract Pages, No Upload",
    seoDescription:
      "Extract page ranges from a PDF or split every page into separate files (ZIP). Free, no signup, and your PDF never leaves your browser.",
    category: "UtilitiesApplication",
    features: ["Extract page ranges", "Split every page into its own PDF", "ZIP download", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    tagline: "Turn PDF pages into images",
    description: "Convert each page of a PDF into a JPG or PNG image at screen or print resolution, right in your browser.",
    tag: "PDF",
    heading: "PDF to JPG Converter",
    seoTitle: "PDF to JPG – Convert PDF Pages to Images Free",
    seoDescription:
      "Convert PDF pages to high-quality JPG or PNG images at up to 300 DPI. Pick pages, download as ZIP. Free, private — nothing is uploaded.",
    category: "MultimediaApplication",
    features: ["JPG or PNG output", "96, 150 or 300 DPI", "Choose specific pages", "ZIP download", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    tagline: "Convert iPhone photos",
    description: "Turn iPhone HEIC/HEIF photos into JPG or PNG files that open everywhere — in batches, on your own device.",
    tag: "IMAGE",
    heading: "HEIC to JPG Converter",
    seoTitle: "HEIC to JPG Converter – Free, Batch, No Upload",
    seoDescription:
      "Convert iPhone HEIC photos to JPG or PNG in your browser, many at once. Free, no signup — your photos are never uploaded to a server.",
    category: "MultimediaApplication",
    features: ["HEIC and HEIF input", "JPG or PNG output", "Batch conversion with ZIP download", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    tagline: "JPG ⇄ PNG ⇄ WebP",
    description: "Convert images between JPG, PNG and WebP (plus GIF, BMP and AVIF input) in batches, without uploading anything.",
    tag: "IMAGE",
    heading: "Image Converter — JPG, PNG & WebP",
    seoTitle: "Image Converter – WebP to PNG, PNG to JPG & More",
    seoDescription:
      "Convert images between JPG, PNG and WebP in your browser: WebP to PNG, PNG to JPG, JPG to WebP and more. Free, batch, nothing uploaded.",
    category: "MultimediaApplication",
    features: ["JPG, PNG and WebP output", "GIF, BMP and AVIF input", "Batch conversion", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "resize-image",
    name: "Image Resizer",
    tagline: "Pixels, percent or social presets",
    description: "Resize images to exact pixels, a percentage, or ready-made sizes for Instagram, YouTube, LinkedIn and passport photos.",
    tag: "IMAGE",
    heading: "Resize Image Online",
    seoTitle: "Resize Image Online Free – Pixels, % & Social Sizes",
    seoDescription:
      "Resize images to exact pixel dimensions, by percentage, or to Instagram, YouTube and passport presets. Free, batch — never uploaded.",
    category: "MultimediaApplication",
    features: ["Resize by pixels or percentage", "Social media and passport presets", "Keep aspect ratio", "Batch resize", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "compress-image-to-kb",
    name: "Compress Image to KB",
    tagline: "Hit an exact file-size limit",
    description: "Shrink a photo to under 20, 50, 100 or 200 KB (or any size) for upload forms and job or visa portals.",
    tag: "IMAGE",
    heading: "Compress Image to 20KB, 50KB, 100KB or Any Size",
    seoTitle: "Compress Image to 50KB, 100KB or Any Size – Free",
    seoDescription:
      "Reduce a JPG or photo to an exact target size like 20KB, 50KB or 100KB for online forms. Keeps the best quality possible. Free, no upload.",
    category: "MultimediaApplication",
    features: ["Target 20, 50, 100, 200, 500 KB or custom", "Best quality under the limit", "Batch processing", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    tagline: "URL, Wi-Fi, WhatsApp, email",
    description: "Make QR codes for links, Wi-Fi logins, WhatsApp chats and email, with your own colours. Download PNG or SVG.",
    tag: "UTILITY",
    heading: "Free QR Code Generator",
    seoTitle: "QR Code Generator – Free, No Expiry, PNG & SVG",
    seoDescription:
      "Create QR codes for URLs, Wi-Fi, WhatsApp and email with custom colours. Download high-res PNG or vector SVG. Free, no signup, never expires.",
    category: "UtilitiesApplication",
    features: ["URL, text, Wi-Fi, WhatsApp and email QR codes", "Custom colours", "PNG up to 4096px and SVG", "Static codes that never expire"],
    runsInBrowser: true,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Strong passwords & passphrases",
    description: "Generate strong random passwords or memorable passphrases using your browser's cryptographic random generator.",
    tag: "SECURITY",
    heading: "Strong Password Generator",
    seoTitle: "Password Generator – Strong, Random & Private",
    seoDescription:
      "Generate strong random passwords or memorable passphrases with your browser's secure random generator. Nothing is sent or stored. Free.",
    category: "UtilitiesApplication",
    features: ["Random passwords 8–64 characters", "Memorable passphrases", "Entropy estimate", "Generated locally with crypto.getRandomValues"],
    runsInBrowser: true,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    tagline: "UPPER, lower, Title, camelCase",
    description: "Switch text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case and more in one click.",
    tag: "TEXT",
    heading: "Case Converter",
    seoTitle: "Case Converter – Uppercase, Lowercase, Title Case",
    seoDescription:
      "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case or kebab-case instantly. Free, runs in your browser.",
    category: "UtilitiesApplication",
    features: ["Upper, lower, title and sentence case", "camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE", "One-click copy"],
    runsInBrowser: true,
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    tagline: "Compare two texts",
    description: "Paste two versions of a text and see exactly what was added and removed, line by line or word by word.",
    tag: "TEXT",
    heading: "Text Diff Checker",
    seoTitle: "Diff Checker – Compare Two Texts Online Free",
    seoDescription:
      "Compare two texts and highlight every difference, line by line or word by word. Ignore case or whitespace. Free and private — runs in your browser.",
    category: "DeveloperApplication",
    features: ["Line and word comparison", "Ignore case and whitespace", "Added/removed counts", "No upload"],
    runsInBrowser: true,
  },
  {
    slug: "base64",
    name: "Base64 Encode / Decode",
    tagline: "Text and files ⇄ Base64",
    description: "Encode text or files to Base64 (or a data URI) and decode Base64 back to text or a file, with URL-safe support.",
    tag: "CODE",
    heading: "Base64 Encode & Decode",
    seoTitle: "Base64 Decode & Encode Online – Text and Files",
    seoDescription:
      "Encode or decode Base64 instantly, including UTF-8 text, Base64URL and files to data URIs. Free, no signup — your data stays in your browser.",
    category: "DeveloperApplication",
    features: ["UTF-8 text encode/decode", "URL-safe Base64URL", "File to Base64 and data URI", "Decode to downloadable file"],
    runsInBrowser: true,
  },
  {
    slug: "csv-to-json",
    name: "CSV ⇄ JSON Converter",
    tagline: "Convert both ways",
    description: "Turn CSV into clean JSON or flatten JSON into a spreadsheet-ready CSV, with delimiter detection and Excel-friendly output.",
    tag: "CODE",
    heading: "CSV to JSON & JSON to CSV Converter",
    seoTitle: "CSV to JSON Converter (and JSON to CSV) – Free",
    seoDescription:
      "Convert CSV to JSON or JSON to CSV in your browser. Auto-detects delimiters, handles quotes, flattens nested JSON. Free — data never uploaded.",
    category: "DeveloperApplication",
    features: ["CSV to JSON and JSON to CSV", "Comma, semicolon, tab and pipe delimiters", "Nested JSON flattening", "Excel-friendly UTF-8 CSV"],
    runsInBrowser: true,
  },
];

export function getWorkshopTool(slug: string): WorkshopTool | undefined {
  return WORKSHOP_TOOLS.find((t) => t.slug === slug);
}
