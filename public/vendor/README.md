# Vendored client-side libraries

These files are third-party libraries, committed **unmodified** (source-map
comments stripped) so the Workshop tools can load them lazily from this site's
own domain. They are only fetched when a visitor actually uses a tool, and all
processing happens in the visitor's browser, so files are never uploaded.

They live here rather than in `package.json` because they are loaded at runtime
by URL (see `src/lib/workshop/vendor.ts`), not bundled.

| Path | Library | Version | Licence | Source file in npm package |
|---|---|---|---|---|
| `pdf-lib/pdf-lib.esm.min.js` | [pdf-lib](https://github.com/Hopding/pdf-lib) | 1.17.1 | MIT | `dist/pdf-lib.esm.min.js` |
| `pdfjs/pdf.min.mjs`, `pdfjs/pdf.worker.min.mjs` | [pdf.js](https://github.com/mozilla/pdf.js) (`pdfjs-dist`) | 4.10.38 | Apache-2.0 | `build/pdf.min.mjs`, `build/pdf.worker.min.mjs` |
| `heic2any/heic2any.min.js` | [heic2any](https://github.com/alexcorvi/heic2any) | 0.0.4 | MIT | `dist/heic2any.min.js` |
| `qrcode/qrcode.mjs` | [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) | 2.0.4 | MIT | `dist/qrcode.mjs` |
| `eff/eff_large_wordlist.txt` | [EFF large wordlist](https://www.eff.org/dice) | 2016 | CC BY 3.0 US (Electronic Frontier Foundation) | words column of `eff_large_wordlist.txt` |

## Updating

```bash
npm pack pdf-lib@<ver> pdfjs-dist@<ver> heic2any@<ver> qrcode-generator@<ver>
# extract each tarball and copy the files listed above over the old ones,
# then smoke-test every tool that uses them before shipping.
```

pdf.js is pinned to 4.x for wider browser support (5.x+ needs very recent
browsers). Keep the main and worker files on the same version.
