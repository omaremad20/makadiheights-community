# Data sources and maintenance

All structured content lives in Supabase (project `nhtbolcmxlvpsbudhlfr`, schema `public`).
Original files stay in the Storage bucket **`makadiheights-data`**; the database only stores
their object names (`documents.storage_path`). Edits made in the Supabase Dashboard
(Table Editor) appear on the site within about a minute — no code change or redeploy needed.

## Where each page gets its data

| Page | Tables | Source document(s) |
| --- | --- | --- |
| Departments & Contacts | `departments`, `department_contacts` | Contacts: `departments-index-2026.docx` (authoritative, 2026). Roles & hours: `mh-manual-final.pdf` |
| Commercial Directory | `business_groups`, `businesses`, `business_phones` | Names, categories, groups, area: `commercial-index.pdf`. Phones: `commercial-index-phone-numbers-2026.docx` (cross-checked with `commercial.json`). Map links: `commercial.json` |
| Banking & Payments | `bank_accounts` (+ Finance phones from `department_contacts`) | `cib-transfer-details-bank-account-info.docx` |
| Shuttle Bus | `shuttle_stops`, `shuttle_trips`, `shuttle_trip_times`, `content_sections` (page `shuttle`) | `shuttle-bus-schedule-mkh-winter-update.pdf` |
| Security & Emergency | `emergency_contacts` (department rows reuse department phones), `content_sections` (page `security`) | `security-awareness-.pdf` (English section) |
| Serenity Beach | `content_sections` (page `serenity`), `documents` (menu), membership tables | `serenity-beach-access.pdf` (OCR + visual check), `makadi-heights-menu-serenity-hotel-2026.pdf` (preview/download only) |
| Membership & Pricing | `membership_packages`, `membership_prices`, `day_tickets`, `membership_settings`, `content_sections` (page `membership`) | `beach-and-clubshouse-pack-for-one.pdf`, `clubhouse-only-pack-for-two-and-one-and-beach-access-pack-for-one.pdf` (visible layer only) |
| Rules — tenant rules | `content_sections` (page `tenant-rules`) | `mkh-tenant-rules-and-regulations.docx` — translated from the Arabic original |
| Rules — penalties | `penalties`, `content_sections` (page `penalties`) | `mkh-penalties-list.docx` — translated from the Arabic original |
| Announcement May 2025 | static: `lib/content/announcement-may-2025.ts` | `makadi-heights-community-announcement-may-2025.pdf` |
| Online forms | static templates: `public/forms/*-template.pdf`, `lib/forms/layouts/*.json` | `mkh-delegation-form.docx`, `mkh-tenant-form.docx` (re-typeset by `scripts/form-templates/`) |
| All Documents | `documents` | all 16 files |

Site-wide values (community email, hours, hotline, info email, website) are in `site_settings`.
The VAT rate (14%) is `membership_settings.vat_rate`.

## Common updates

- **Change a price** → `membership_prices.base_price` / `additional_member_price` (VAT excluded). The calculator and both price pages update automatically.
- **Change a phone or email** → `department_contacts` or `business_phones`. Emergency numbers for Security, Maintenance and Community Management come from `department_contacts`, so change them once.
- **Hide something without deleting it** → set `is_published = false` (documents, departments, businesses, bank accounts, packages, content sections).
- **Replace a document** → upload the new file to the bucket with the same name, or upload under a new name and update `documents.storage_path`.
- **Change form wording** → edit `scripts/form-templates/*.html`, run `npm run forms:build` (needs Playwright + Chromium), commit the regenerated PDF and JSON.

Columns named `notes` / `review_note` are for the owner only; the site does not display them.

## Deduplication decisions

- **Departments:** 10 departments from the 2026 index. The manual's *Landscape Department* shares the Maintenance contacts, so it is shown as a responsibility of *Facility & Maintenance* rather than a duplicate card.
- **Businesses:** merged across the three sources by name/phone evidence, not array position:
  `Hope and Grill` = "Grill House by Hope"; `On Call Clinic` = "Makadi Heights Clinic" (same two numbers); `Fabrik` = "Fabric Wear"; `Best Home` = "Best Home Laundry"; `Layalena` = "Layalina"; `Neiloo Seafood` = "Neilo Seafood"; `Kaldi by Jacobs` = "Kaldi"; `Hope Coffee` = "Hope café"; `Bazar Sakara` = "Sakara Bazar".
  `Drop Spot` (delivery panel in the PDF / "Internal Transportation" in the phone index) and `Rechote` (phone index only) are kept with only their verified fields.
- **Emergency contacts** for departments reference the department record instead of copying the number.
- **Bank accounts:** one card per currency (EGP, USD, EUR, GBP); SWIFT and branch are shared values shown on each card.

## Discontinued email

`customercare@makadiheights.com` (manual) and `CustomerCare.Makadi@MakadiHeights.com` (department index,
security sheet) are treated as the discontinued customer-care address and are **not** shown anywhere.
Community Management uses `community.management@makadiheights.com`. The original documents still
contain the old address; they are unchanged.

## Items for review

1. **Pharmacy number** `011142429857` has 12 digits in both phone sources (an Egyptian mobile has 11). Shown as-is; the `tel:` link may not work.
2. **Ignite and Nutri Vibe** share `01227556870` in both phone sources.
3. **Clinic numbers differ by context:** the security sheet lists *Makadi Heights Clinic* `01110047815` (24/7); the commercial phone index lists `01207690550` / `01222822820`. Both are kept in their own context.
4. **Finance phone:** the manual prints `+2012065333399` (one digit too many); the 2026 index `+201206533399` is used.
5. **Email domains:** Sales uses `@orascomdh.com`, Re-Sale uses `@orascomhd.com`. Both copied exactly; one may be a typo.
6. **Shuttle:** the Friday notice says the 12:45 PM trip "arrives in Makadi at 2:15 PM", but the timetable shows 2:00. Both are shown as published.
7. **Price list file names:** `beach-and-clubshouse-pack-for-one.pdf` actually shows the *Pack for 2* table. Both PDFs also contain hidden, out-of-date text layers (e.g. a Stryx courts note and different notes); only the visible content was used.
8. **Penalty #1** prints "1,000 +" — most likely 1,000 EGP plus damage cost. Shown as "EGP 1,000+".
9. **Penalties and tenant rules** were translated from the Arabic originals. Where the documents' own English column differs, the Arabic meaning was used (see `penalties.review_note`): #15 "contractor vehicles" vs "Trucks", #16 parking/wrong-direction wording, #24 "carried out by the owner" vs "with owner's knowledge"; the repeated-violation note says services are suspended "until the violation is removed" (English column: "until penalties are paid"). Tenant rules include the Arabic-only rule on private parking spaces.
10. **Delegation form** prints the year "2025" in the date line; the online form asks for full dates instead.
11. **May 2025 announcement:** the electricity paragraph is garbled in the source ("Services such as National IDs …etc.) as well as…") and is reproduced as published. It also refers to "Community Care".
12. **Boowie font** is not in the project or the data folder. Headings fall back to Times New Roman until the font file is added (see `app/globals.css`).
13. **Map links** are Google short links taken from `commercial.json`; they could not be opened from the build environment, so please spot-check a few.
