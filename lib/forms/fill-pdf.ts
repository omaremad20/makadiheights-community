import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FormDefinition } from "./definitions";
import { allFields, formatFormDate, type FormValues } from "./validation";

const FONT_SIZE = 11;
const MIN_FONT_SIZE = 7;
const INK = rgb(0.05, 0.16, 0.32);

/**
 * Builds the completed PDF entirely in the browser: loads the blank template
 * that ships with the site and writes the visitor's answers onto it.
 * Nothing is uploaded or stored.
 */
export async function buildFilledPdf(def: FormDefinition, values: FormValues): Promise<Uint8Array> {
  const response = await fetch(def.layout.template, { cache: "force-cache" });
  if (!response.ok) throw new Error("The form template could not be loaded.");
  const pdf = await PDFDocument.load(await response.arrayBuffer());
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  const fieldsByName = new Map(allFields(def).map((f) => [f.name, f]));

  for (const slot of def.layout.fields) {
    const field = fieldsByName.get(slot.name);
    let text = (values[slot.name] ?? "").trim();
    if (!text) continue;
    if (field?.type === "date") text = formatFormDate(text);
    text = text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

    const page = pages[slot.page];
    if (!page) continue;

    const maxWidth = slot.width - 4;
    let size = FONT_SIZE;
    while (size > MIN_FONT_SIZE && font.widthOfTextAtSize(text, size) > maxWidth) size -= 0.5;
    while (text.length > 1 && font.widthOfTextAtSize(text, size) > maxWidth) text = `${text.slice(0, -2)}…`;

    const width = font.widthOfTextAtSize(text, size);
    // On the Arabic (RTL) page the value is placed at the reading start of the blank: the right edge.
    const x = slot.rtl ? slot.x + slot.width - width - 2 : slot.x + 2;
    page.drawText(text, { x, y: slot.y, size, font, color: INK });
  }

  pdf.setTitle(`${def.title} — Makadi Heights`);
  pdf.setProducer("Makadi Heights Community Portal (generated in your browser)");
  pdf.setCreator("Makadi Heights Community Portal");
  return pdf.save();
}
