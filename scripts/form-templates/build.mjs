// Builds the blank PDF templates used by the online forms and records where
// each answer is written. Output:
//   public/forms/<name>-template.pdf
//   lib/forms/layouts/<name>.json
//
// Requires Playwright with Chromium (dev-only, not a runtime dependency):
//   npx -y playwright@1 install chromium   (only if not already installed)
//   node scripts/form-templates/build.mjs
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const TEMPLATES = [
  { name: "delegation", file: "delegation.html", format: "A4" },
  { name: "tenant", file: "tenant.html", format: "Letter" },
];

const PX_TO_PT = 72 / 96;

const browser = await chromium.launch();
try {
  for (const t of TEMPLATES) {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(join(here, t.file)).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const layout = await page.evaluate(() => {
      const pages = Array.from(document.querySelectorAll(".page"));
      const fields = [];
      pages.forEach((p, pageIndex) => {
        const pr = p.getBoundingClientRect();
        p.querySelectorAll("[data-field]").forEach((el) => {
          const r = el.getBoundingClientRect();
          fields.push({
            name: el.getAttribute("data-field"),
            page: pageIndex,
            x: r.left - pr.left,
            top: r.top - pr.top,
            width: r.width,
            height: r.height,
            rtl: getComputedStyle(el).direction === "rtl",
          });
        });
      });
      const first = pages[0].getBoundingClientRect();
      return { pageWidth: first.width, pageHeight: first.height, pageCount: pages.length, fields };
    });

    const pdf = await page.pdf({ format: t.format, printBackground: true, preferCSSPageSize: true });
    await mkdir(join(root, "public/forms"), { recursive: true });
    await writeFile(join(root, `public/forms/${t.name}-template.pdf`), pdf);

    // Convert CSS px (top-left origin) to PDF points (bottom-left origin).
    const pageHeightPt = layout.pageHeight * PX_TO_PT;
    const json = {
      template: `/forms/${t.name}-template.pdf`,
      pageCount: layout.pageCount,
      pageWidth: +(layout.pageWidth * PX_TO_PT).toFixed(2),
      pageHeight: +pageHeightPt.toFixed(2),
      fields: layout.fields.map((f) => ({
        name: f.name,
        page: f.page,
        x: +(f.x * PX_TO_PT).toFixed(2),
        // baseline sits slightly above the dotted line
        y: +(pageHeightPt - (f.top + f.height) * PX_TO_PT + 3).toFixed(2),
        width: +(f.width * PX_TO_PT).toFixed(2),
        rtl: f.rtl,
      })),
    };
    await mkdir(join(root, "lib/forms/layouts"), { recursive: true });
    await writeFile(join(root, `lib/forms/layouts/${t.name}.json`), JSON.stringify(json, null, 2) + "\n");
    console.log(`✓ ${t.name}: ${json.pageCount} page(s), ${json.fields.length} field slots`);
    await page.close();
  }
} finally {
  await browser.close();
}
