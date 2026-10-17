/**
 * Helpful copy rendered under each Workshop tool: a short how-to, notes on
 * privacy/limits, and FAQs (also emitted as FAQPage JSON-LD). Keep it honest
 * and specific; this is what search engines and visitors actually read.
 */

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolContent {
  steps: string[];
  body: string[];
  faqs: ToolFaq[];
  related: string[];
}

const PRIVACY_FAQ: ToolFaq = {
  q: "Are my files uploaded anywhere?",
  a: "No. The tool runs entirely in your browser using JavaScript on your own device. Your files are never sent to a server, so nothing is stored, logged or shared. You can even disconnect from the internet after the page loads and it still works.",
};

export const WORKSHOP_CONTENT: Record<string, ToolContent> = {
  "word-counter": {
    steps: [
      "Paste or type your text into the box.",
      "Read the live counts: words, characters (with and without spaces), sentences and paragraphs.",
      "Check the estimated reading time to see how long the piece takes to read aloud or silently.",
    ],
    body: [
      "Word limits are everywhere: university essays, cover letters, grant applications, meta descriptions, social posts and journal abstracts. This counter updates as you type, so you can trim or expand a draft until it fits without copying it into a word processor.",
      "Reading time is estimated at about 200 words per minute, a comfortable average reading pace. Character counts are handy for platforms with hard limits, like X posts or SMS messages.",
    ],
    faqs: [
      { q: "How are words counted?", a: "A word is any run of characters separated by spaces or line breaks, the same rule most word processors use. Hyphenated words like \"well-known\" count as one word." },
      { q: "Does it count characters with and without spaces?", a: "Yes. Both figures are shown, because some forms count spaces and others don't." },
      { q: "Is my text saved or sent anywhere?", a: "No. Counting happens in your browser. The text never leaves your device and disappears when you close the tab." },
      { q: "Does it work for languages other than English?", a: "It works for any language that separates words with spaces, including most European languages. Languages written without spaces, such as Chinese or Japanese, will show accurate character counts but not meaningful word counts." },
    ],
    related: ["case-converter", "diff-checker", "json-formatter"],
  },
  "json-formatter": {
    steps: [
      "Paste your JSON into the input box.",
      "Click Format to pretty-print it with two-space indentation, or Minify to strip all whitespace.",
      "If the JSON is invalid, read the error message to find the problem, fix it, and run it again.",
      "Copy the output with one click.",
    ],
    body: [
      "API responses, config files and log lines are often a single unreadable line of JSON. Formatting makes nested objects and arrays easy to scan, and validation catches the usual mistakes: trailing commas, single quotes, unquoted keys and missing brackets.",
      "Because everything runs in your browser, it's safe to paste responses that contain tokens, customer data or internal URLs. Nothing is sent to a server.",
    ],
    faqs: [
      { q: "What's the difference between formatting and minifying?", a: "Formatting adds line breaks and indentation so people can read it. Minifying removes all unnecessary whitespace so the file is as small as possible for sending over a network. The data is identical either way." },
      { q: "Why does it say my JSON is invalid?", a: "Strict JSON doesn't allow trailing commas, comments, single-quoted strings or unquoted keys, all of which are valid in JavaScript but not in JSON. The error message shows roughly where the parser stopped." },
      { q: "Is it safe to paste sensitive data?", a: "Yes. The JSON is parsed by your own browser and never leaves your device." },
      { q: "Can I convert JSON to CSV?", a: "Yes. Use the CSV ⇄ JSON Converter in the Workshop to turn an array of JSON objects into a spreadsheet-ready CSV." },
    ],
    related: ["csv-to-json", "base64", "diff-checker"],
  },
  "image-compressor": {
    steps: [
      "Drop a JPG, PNG or WebP image onto the box, or click to choose one.",
      "Adjust the quality slider. Around 70% usually cuts file size a lot with no visible difference.",
      "Compare the before and after sizes, then download the compressed image.",
    ],
    body: [
      "Big images slow websites down, bounce off email attachment limits and eat mobile data. Re-encoding at a sensible quality often cuts file size by 50–80% while looking the same on screen.",
      "The compressor outputs WebP where your browser supports it (it's smaller than JPG at the same quality) and falls back to JPG otherwise. If an image is already well optimised and would come out bigger, you get the original back unchanged, never a larger file.",
    ],
    faqs: [
      PRIVACY_FAQ,
      { q: "What quality should I choose?", a: "For photos on websites and social media, 65–80% is the sweet spot. Go higher for images you plan to print or edit further." },
      { q: "Why is the output a WebP file?", a: "WebP is typically 25–35% smaller than JPG at similar quality and is supported by all modern browsers. If you need a specific format, run the result through the Image Converter." },
      { q: "I need the image under an exact size like 100KB. Can this do it?", a: "Use Compress Image to KB instead. It searches automatically for the best quality that fits under your target size." },
    ],
    related: ["compress-image-to-kb", "resize-image", "image-converter"],
  },
  "image-to-pdf": {
    steps: [
      "Drop one or more images (JPG or PNG) onto the box.",
      "They're placed in the PDF in the order you added them, one image per page.",
      "Download the finished PDF.",
    ],
    body: [
      "Turning photos into a PDF is the quickest way to send scanned receipts, signed forms, ID copies or a set of whiteboard photos as one tidy document. Many portals only accept PDF uploads, and this gets you there without installing anything.",
      "Each image goes on its own A4 page, scaled to fit, and there's no watermark. Because the PDF is built in your browser, sensitive documents like IDs and bank statements never pass through anyone else's server.",
    ],
    faqs: [
      PRIVACY_FAQ,
      { q: "Can I combine several images into one PDF?", a: "Yes. Add as many images as you like and they become pages of a single PDF." },
      { q: "Will there be a watermark?", a: "No. The PDF contains only your images." },
      { q: "How do I combine existing PDFs instead?", a: "Use Merge PDF to join several PDF files into one." },
    ],
    related: ["merge-pdf", "compress-image-to-kb", "heic-to-jpg"],
  },
  "ux-analyzer": {
    steps: [
      "Enter the full address of any public website, for example https://example.com.",
      "Run the scan. It fetches the page's HTML and checks it for simplicity, navigation, performance, accessibility and trust signals.",
      "Read the score and the plain-English findings, starting with anything marked red.",
    ],
    body: [
      "The analyzer is a fast structural check, not a full audit. It reads the raw HTML for signals that commonly hurt usability: missing or competing H1 headings, page title length, missing navigation and footer landmarks, heavy HTML and render-blocking scripts, missing viewport and language tags, images without alt text, HTTPS and an easy way to make contact.",
      "Use it as a first pass before a redesign, or to compare your site with a competitor's. Unlike the other Workshop tools, this one does need a server, because browsers can't fetch other websites directly. Only the URL you enter is sent, and only to read that public page.",
    ],
    faqs: [
      { q: "Is this a full UX audit?", a: "No. It's an automated heuristic scan of the page's HTML. It can't judge visual design, copy quality or real user behaviour. Treat findings as \"worth a second look\", not final verdicts." },
      { q: "Why did it fail to scan my site?", a: "Some sites block automated requests, require a login, or render all their content with JavaScript after load. Private and local addresses are blocked for security." },
      { q: "What data is sent?", a: "Only the URL you enter. The server fetches that public page, analyses it and returns the score. Nothing else about you is collected by the scan." },
      { q: "Can I get a deeper review?", a: "Yes. Start a build or get in touch for a full UX and conversion review of your site." },
    ],
    related: ["word-counter", "json-formatter", "qr-code-generator"],
  },
  "merge-pdf": {
    steps: [
      "Drop two or more PDF files onto the box, or click to choose them. You can add more at any time.",
      "Use the arrows to put the files in the order you want. Remove any you added by mistake.",
      "Click Merge & Download to get a single PDF with every page, in that order.",
    ],
    body: [
      "Merging is handy for combining a CV with a cover letter, joining monthly statements, assembling a tender pack or putting scanned pages back together. Every page is copied exactly, so text stays selectable and links keep working. Nothing is re-rendered or flattened.",
      "Most online PDF mergers upload your documents to their servers. This one runs entirely in your browser, so contracts, medical records and financial documents never leave your device. There's no file limit, no watermark and no signup. Very large files are limited only by your device's memory.",
    ],
    faqs: [
      PRIVACY_FAQ,
      { q: "Is there a limit on how many PDFs I can merge?", a: "No fixed limit. Dozens of normal documents work fine. Very large files (hundreds of MB in total) depend on your device's available memory." },
      { q: "Will the merged PDF have a watermark?", a: "No. The output contains only your pages." },
      { q: "Can I merge password-protected PDFs?", a: "Files encrypted to prevent opening can't be merged until you remove the password with the software you used to set it. PDFs with only editing restrictions usually merge fine." },
      { q: "Can I reorder individual pages, not just files?", a: "Right now you reorder whole files. To rearrange pages, split the PDF first with Split PDF, then merge the parts in the order you want." },
    ],
    related: ["split-pdf", "pdf-to-jpg", "image-to-pdf"],
  },
  "split-pdf": {
    steps: [
      "Drop a PDF onto the box. The page count appears straight away.",
      "Choose a mode: extract specific pages into one new PDF, or split every page into its own PDF.",
      "For extraction, type pages and ranges such as 1-3, 5, 8- (\"8-\" means page 8 to the end).",
      "Download the new PDF, or a ZIP containing one PDF per page.",
    ],
    body: [
      "Splitting lets you send only the pages someone needs: one signed page from a contract, a single chapter from a textbook, or the summary from a long report. Typing ranges in a different order (for example 5, 1-4) also reorders the pages in the output.",
      "Pages are copied without re-rendering, so quality, text and links are preserved exactly. Everything happens in your browser. Your document isn't uploaded, which matters for anything confidential.",
    ],
    faqs: [
      PRIVACY_FAQ,
      { q: "How do I extract a single page?", a: "Choose \"Extract pages\", type the page number (for example 4), and download." },
      { q: "Can I split a PDF into individual pages?", a: "Yes. Choose \"Every page as its own PDF\" and you'll get a ZIP file with one PDF per page, numbered in order." },
      { q: "Does splitting reduce quality?", a: "No. Pages are copied as-is from the original file, not converted or compressed." },
    ],
    related: ["merge-pdf", "pdf-to-jpg", "image-to-pdf"],
  },
  "pdf-to-jpg": {
    steps: [
      "Drop a PDF onto the box.",
      "Pick JPG (smaller files) or PNG (sharper text and line art) and a resolution: 96 DPI for screens, 150 for general use, 300 for print.",
      "Choose which pages to convert, or leave the full range.",
      "Click Convert, then download single images or everything as a ZIP.",
    ],
    body: [
      "Converting PDF pages to images is useful for sharing a page on social media or WhatsApp, dropping a slide into a presentation, adding a document preview to a website, or uploading to forms that only accept images.",
      "Pages are rendered with pdf.js, Mozilla's PDF engine (the one inside Firefox), on a white background. Higher DPI gives sharper images but bigger files: a 300 DPI A4 page is about 2480×3508 pixels. Rendering happens on your device, so the PDF is never uploaded.",
    ],
    faqs: [
      PRIVACY_FAQ,
      { q: "Which resolution should I choose?", a: "150 DPI is a good default for sharing and viewing. Use 300 DPI if you'll print the images or need to zoom into small text. 96 DPI keeps files small for quick previews." },
      { q: "JPG or PNG?", a: "JPG makes much smaller files and suits pages with photos. PNG is lossless, so it keeps text and diagrams perfectly crisp but files are larger." },
      { q: "Can I convert only some pages?", a: "Yes. Enter pages and ranges like 1, 3-5 in the Pages box." },
      { q: "Why does a page look different from my PDF viewer?", a: "Rarely, PDFs use unusual fonts or effects that render slightly differently between engines. If that happens, try PNG at a higher DPI." },
    ],
    related: ["split-pdf", "compress-image-to-kb", "image-to-pdf"],
  },
  "heic-to-jpg": {
    steps: [
      "Choose JPG (smaller, works everywhere) or PNG (lossless).",
      "Drop one or many .HEIC or .HEIF photos onto the box.",
      "Wait for the conversion, then download each photo or all of them as a ZIP.",
    ],
    body: [
      "iPhones and many Android phones save photos as HEIC to save space, but plenty of Windows apps, websites and upload forms still can't open them. Converting to JPG makes your photos work everywhere.",
      "This converter decodes HEIC inside your browser, so personal photos never touch a server. That's a real difference from most online converters. The first conversion takes a moment while the decoder loads (about 1.3 MB, once). After that, each photo takes a second or two depending on your device.",
      "Tip: on an iPhone you can avoid HEIC entirely under Settings → Camera → Formats → Most Compatible, though files will be larger.",
    ],
    faqs: [
      PRIVACY_FAQ,
      { q: "Can I convert many HEIC files at once?", a: "Yes. Select or drop as many as you like and download them together as a ZIP." },
      { q: "Will I lose quality converting HEIC to JPG?", a: "At the default 90% quality the difference is not visible in normal viewing. Choose PNG if you need a lossless copy." },
      { q: "Is photo metadata (location, date) kept?", a: "No. The converted files don't carry over EXIF metadata such as GPS location, which is often a privacy plus when sharing." },
      { q: "Why did a file fail?", a: "A few HEIC variants (for example some burst or Live Photo sequences) aren't supported by the decoder. Exporting the photo from your Photos app as JPG is the fallback." },
    ],
    related: ["image-converter", "compress-image-to-kb", "resize-image"],
  },
  "image-converter": {
    steps: [
      "Pick the format you want: PNG, JPG or WebP.",
      "For JPG and WebP, set the quality. For JPG, choose a background colour for any transparent areas.",
      "Drop your images. You can convert many at once.",
      "Download each file, or all of them as a ZIP.",
    ],
    body: [
      "Each format has a job. JPG is best for photos and is accepted everywhere. PNG is lossless and supports transparency, ideal for logos, screenshots and graphics. WebP is a modern format that's usually much smaller than both, and every current browser supports it.",
      "Common conversions: WebP to PNG (when an app won't open WebP downloads), PNG to JPG (to shrink screenshots), and JPG to WebP (to speed up a website). Conversion uses your browser's own image engine, so files stay on your device.",
    ],
    faqs: [
      PRIVACY_FAQ,
      { q: "How do I convert WebP to PNG or JPG?", a: "Choose PNG or JPG as the output, drop the .webp files, and download. Transparency is kept in PNG. In JPG it's filled with the background colour you pick." },
      { q: "Why is my PNG bigger than the original JPG?", a: "PNG is lossless, so photos saved as PNG are often several times larger. For photos, JPG or WebP is usually the better choice." },
      { q: "Can it convert HEIC or SVG?", a: "For iPhone HEIC photos use the dedicated HEIC to JPG tool. SVG files can be rasterised here when your browser supports it." },
    ],
    related: ["heic-to-jpg", "resize-image", "image-compressor"],
  },
  "resize-image": {
    steps: [
      "Choose how to resize: by exact pixels, by percentage, or with a preset for social media and passport photos.",
      "For pixels, enter a width, a height, or both. With \"Keep aspect ratio\" on, the image fits inside those bounds without stretching.",
      "Pick an output format, then drop one or more images.",
      "Download the resized images individually or as a ZIP.",
    ],
    body: [
      "Exact dimensions matter: Instagram posts look best at 1080×1080, YouTube thumbnails must be 1280×720, LinkedIn banners are 1584×396, and many websites ask for profile pictures at specific sizes. Presets crop to fill the frame from the centre, or fit the whole image inside with white bars, whichever you choose.",
      "The passport preset gives 413×531 pixels, which is 35×45 mm at 300 DPI, the size used by the UK, EU, Australia and many other countries. Always check your government's current rules for background and framing. Images are processed in your browser and never uploaded.",
    ],
    faqs: [
      PRIVACY_FAQ,
      { q: "How do I resize without stretching or distorting?", a: "Keep \"Keep aspect ratio\" ticked and enter just a width or just a height, or both as maximum bounds. The other side is calculated automatically." },
      { q: "Can I resize many images at once?", a: "Yes. Drop multiple images and they're all resized with the same settings, then download them as a ZIP." },
      { q: "Does enlarging an image improve quality?", a: "No. Making an image bigger than the original can't add detail. It will look softer. Resize down whenever possible." },
      { q: "I need a specific file size, not dimensions.", a: "Use Compress Image to KB, which targets a size like 50 KB or 100 KB automatically." },
    ],
    related: ["compress-image-to-kb", "image-converter", "image-compressor"],
  },
  "compress-image-to-kb": {
    steps: [
      "Choose a target size: 20, 50, 100, 200 or 500 KB, or type a custom limit.",
      "Choose JPG (accepted by every form) or WebP (smaller, but some portals reject it).",
      "Drop your photo or scan. The tool finds the highest quality that fits under your limit.",
      "Download the result. It shows the final size, dimensions and quality used.",
    ],
    body: [
      "Government services, job applications, university admissions, visa and exam portals often insist on photos or signatures under a strict size, such as \"JPG under 50 KB\". Getting there by trial and error is tedious. This tool searches for the best quality that fits automatically.",
      "It first lowers JPEG quality step by step. Only if that isn't enough does it reduce the pixel dimensions, so your image stays as sharp as the limit allows. If a file is already under the target in the right format, it's returned unchanged. Everything runs on your device, which matters for ID photos and signatures.",
    ],
    faqs: [
      PRIVACY_FAQ,
      { q: "How do I compress a photo to under 50 KB?", a: "Select 50 KB, keep JPG as the output, drop the photo, and download. The result is guaranteed to be at or under 50 KB." },
      { q: "Why did my image get smaller in dimensions?", a: "Very small targets (like 20 KB) can't be reached with quality reduction alone on large photos, so the tool also scales the image down. The result notes when this happened." },
      { q: "Does the form count KB as 1000 or 1024 bytes?", a: "This tool uses 1 KB = 1024 bytes, which is slightly stricter than 1000. So if a file passes here, it will pass either way." },
      { q: "Can I also set exact pixel dimensions?", a: "Yes. Resize first with the Image Resizer, then compress the result here." },
    ],
    related: ["resize-image", "image-compressor", "heic-to-jpg"],
  },
  "qr-code-generator": {
    steps: [
      "Choose the type: URL/text, Wi-Fi, WhatsApp or email.",
      "Fill in the details. The preview updates as you type.",
      "Optionally change the colours and error correction (use High for print or outdoor signs).",
      "Download a PNG (up to 4096px) or an SVG for print, then test-scan it with your phone.",
    ],
    body: [
      "QR codes are a quick bridge from paper to phone: menus, flyers, business cards, product packaging, event check-ins and shop windows. A Wi-Fi QR lets guests join your network without typing a password. A WhatsApp QR opens a chat with your number, optionally with a pre-filled message.",
      "These are static QR codes. The data is encoded directly in the pattern, so they never expire, need no account, and keep working even if this website disappears. Some \"free\" generators make dynamic codes that point through their servers and stop working when a trial ends. These don't.",
      "For printing, use SVG: it scales to any size without blurring. Keep plenty of contrast, with a dark foreground on a light background, and leave the white border around the code.",
    ],
    faqs: [
      { q: "Do these QR codes expire?", a: "No. They're static codes with your content encoded directly, so they work forever and don't depend on this site." },
      { q: "Can I track how many people scan my QR code?", a: "Not with static codes, because scans don't pass through any server. Tracked (dynamic) QR codes are planned as a separate feature." },
      { q: "How do I make a Wi-Fi QR code?", a: "Choose Wi-Fi, enter the network name and password exactly as they appear on your router, and pick the security type (usually WPA). Phones scanning it will offer to join the network." },
      { q: "Can I change the colours?", a: "Yes, but keep the foreground dark and the background light with strong contrast. Inverted or low-contrast codes fail on many phones." },
      { q: "Is my data sent anywhere?", a: "No. The QR code is generated in your browser. Wi-Fi passwords and other details never leave your device." },
    ],
    related: ["password-generator", "resize-image", "case-converter"],
  },
  "password-generator": {
    steps: [
      "Choose a random password or a memorable passphrase.",
      "For passwords, set the length (16+ recommended) and character sets. For passphrases, choose the number of words.",
      "A new password is generated instantly. Click Generate New for another.",
      "Copy it straight into your password manager.",
    ],
    body: [
      "Strong passwords are long and random. This generator uses your browser's cryptographically secure random number generator (crypto.getRandomValues) with unbiased sampling, the same source password managers use. Passwords are created on your device and are never sent, logged or stored.",
      "The entropy figure estimates how hard a password is to guess. Around 75 bits is strong for most accounts, and 100+ bits is excellent. A 20-character password using all character sets is about 130 bits. Passphrases are built from the EFF's 7,776-word list: 6 random words give about 77 bits, and they're much easier to type and remember.",
      "Best practice: use a different password for every account, store them in a password manager, and turn on two-factor authentication wherever it's offered.",
    ],
    faqs: [
      { q: "Is this password generator safe?", a: "Yes. Passwords are generated locally with the Web Crypto API. Nothing is transmitted or saved, and the page works offline once loaded." },
      { q: "How long should my password be?", a: "At least 16 characters for random passwords, or 6+ words for passphrases. Longer is always better." },
      { q: "Password or passphrase: which is better?", a: "Both are secure at the recommended lengths. Passphrases are easier to remember and type (great for a master password). Random passwords are more compact for accounts saved in a password manager." },
      { q: "What does \"avoid look-alikes\" do?", a: "It removes characters that are easy to confuse, such as O and 0 or l and 1, which helps when a password has to be read or typed by hand." },
    ],
    related: ["qr-code-generator", "base64", "case-converter"],
  },
  "case-converter": {
    steps: [
      "Paste or type your text.",
      "Click a case: UPPERCASE, lowercase, Title Case, Sentence case, or a programming case like camelCase or snake_case.",
      "Copy the converted text.",
    ],
    body: [
      "Fix text typed with Caps Lock on, tidy headings into Title Case, or turn a shouty email into normal sentence case in one click. Title Case keeps short words like \"and\", \"of\" and \"the\" lowercase, as most style guides recommend.",
      "Developers can convert labels into variable names: camelCase for JavaScript, PascalCase for classes, snake_case for Python and databases, kebab-case for URLs and CSS, and CONSTANT_CASE for environment variables. Words are split on spaces, punctuation and existing capital letters, so \"user ID number\" and \"userIdNumber\" both convert cleanly. Everything runs locally in your browser.",
    ],
    faqs: [
      { q: "How do I convert uppercase text to normal text?", a: "Paste it and click Sentence case. The first letter of each sentence is capitalised and the rest is lowercase." },
      { q: "What's the difference between Title Case and Sentence case?", a: "Title Case capitalises the main words (\"The Lord of the Rings\"). Sentence case capitalises only the first word of each sentence (\"The lord of the rings\")." },
      { q: "Will it keep proper nouns capitalised?", a: "Not automatically. Converting to lowercase or sentence case lowercases names too, so check proper nouns afterwards." },
      { q: "Is my text stored?", a: "No. Conversion happens in your browser and nothing is sent anywhere." },
    ],
    related: ["word-counter", "diff-checker", "base64"],
  },
  "diff-checker": {
    steps: [
      "Paste the original text on the left and the changed text on the right.",
      "Choose line-by-line (best for code, lists and documents) or word-by-word (best for prose).",
      "Optionally ignore case or extra whitespace.",
      "Review the highlighted result: green is added, red is removed.",
    ],
    body: [
      "A diff checker shows exactly what changed between two versions: edits to a contract, revisions to an essay, changes in a config file, or differences between two exported lists. It saves rereading both versions side by side.",
      "The comparison uses a longest-common-subsequence algorithm, the same idea behind git diff. Common text at the start and end is skipped first, so comparisons stay fast even on long documents. Because it runs in your browser, you can safely compare confidential drafts or code.",
    ],
    faqs: [
      { q: "How do I compare two documents?", a: "Copy the text from each document into the two boxes. The differences are highlighted instantly." },
      { q: "Line or word comparison: which should I use?", a: "Use lines for code, data and lists. Use words for paragraphs of prose, where a single edited word would otherwise mark the whole line as changed." },
      { q: "Is there a size limit?", a: "Documents up to several thousand lines compare comfortably. Extremely long texts with changes throughout may be too large for the browser, and you'll be asked to compare them in parts." },
      { q: "Is my text uploaded?", a: "No. The comparison runs locally and nothing is sent to a server." },
    ],
    related: ["case-converter", "word-counter", "json-formatter"],
  },
  base64: {
    steps: [
      "To convert text: paste it, then click Encode (text → Base64) or Decode (Base64 → text).",
      "Tick URL-safe to use the Base64URL alphabet (- and _ instead of + and /, no padding), as used in JWTs and URLs.",
      "To encode a file: switch to File mode and drop any file to get its Base64 string or a ready-made data URI.",
      "Copy the output or download it.",
    ],
    body: [
      "Base64 represents binary data as plain text so it can travel through systems that only handle text: email attachments, JSON APIs, data URIs in HTML and CSS, Basic Auth headers and JWT tokens. It is an encoding, not encryption. Anyone can decode it.",
      "Text is handled as UTF-8, so accents, emoji and non-Latin scripts round-trip correctly. That's a common bug in simpler tools that use btoa directly. If decoded data isn't valid text (an image, for instance), you can download it as a file instead. Everything stays in your browser.",
    ],
    faqs: [
      { q: "Is Base64 encryption?", a: "No. It's a reversible encoding with no key. Never use it to hide passwords or secrets." },
      { q: "What's Base64URL?", a: "A variant that replaces + with - and / with _, and drops = padding, so the result is safe in URLs and filenames. JWTs use it. The decoder here accepts both variants automatically." },
      { q: "Why is the Base64 output bigger than my file?", a: "Base64 uses 4 characters for every 3 bytes, so encoded data is about 33% larger than the original." },
      { q: "How do I embed an image in HTML or CSS?", a: "Use File mode, drop the image, and click Copy as data URI. Paste the result into an img src or a CSS url()." },
    ],
    related: ["json-formatter", "csv-to-json", "password-generator"],
  },
  "csv-to-json": {
    steps: [
      "Choose the direction: CSV → JSON or JSON → CSV.",
      "Drop a file or paste your data.",
      "For CSV, the delimiter (comma, semicolon, tab or pipe) is detected automatically. Choose whether the first row holds headers and whether to detect numbers and true/false.",
      "Click Convert, then copy the result or download it as a file.",
    ],
    body: [
      "CSV is how spreadsheets and databases export data. JSON is what APIs and JavaScript apps expect. This converter moves data between them correctly: quoted fields, commas inside quotes, escaped quotes, line breaks inside cells and Excel's byte-order mark are all handled.",
      "Going the other way, nested JSON objects are flattened into dot-notation columns (address.city), and arrays become JSON text in a single cell. CSV downloads include a UTF-8 marker so Excel opens accented characters correctly. Values with leading zeros, like phone numbers and postcodes, stay as text. Your data is processed in the browser and never uploaded.",
    ],
    faqs: [
      { q: "How do I convert a CSV file to JSON?", a: "Choose CSV → JSON, drop the file, and click Convert. Each row becomes an object keyed by the header row." },
      { q: "My CSV uses semicolons. Will it work?", a: "Yes. Semicolons (common in European Excel exports), tabs and pipes are detected automatically, or you can pick one manually." },
      { q: "How are nested JSON objects handled?", a: "They're flattened into columns with dot-separated names, like user.name and user.email. Arrays are kept as JSON text in one cell." },
      PRIVACY_FAQ,
    ],
    related: ["json-formatter", "base64", "diff-checker"],
  },
};

export function getToolContent(slug: string): ToolContent | undefined {
  return WORKSHOP_CONTENT[slug];
}
