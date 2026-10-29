import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  Loaded,
  BankAccount,
  Business,
  BusinessGroup,
  BusinessPhone,
  ContentSection,
  DayTicket,
  Department,
  DepartmentContact,
  EmergencyContact,
  MembershipCatalog,
  MembershipPackage,
  MembershipPrice,
  MembershipSettings,
  Penalty,
  PortalDocument,
  ShuttleDirection,
  ShuttleRoute,
  ShuttleStop,
  ShuttleTrip,
  SiteSettings,
} from "./types";

/*
 * All portal data is public and read-only. Each reader is cached with the
 * `minutes` profile, so edits made in the Supabase Dashboard appear on the
 * site within a few minutes without a redeploy.
 *
 * Readers never throw: they return `{ ok: false }` on failure. A failed read
 * is cached with the `seconds` profile, which is too short to be baked into a
 * prerendered page, so a build without network access (or a transient outage)
 * renders that part at request time and recovers on its own.
 */

async function selectAll<T>(table: string, orderBy: string | null = "sort_order"): Promise<T[]> {
  const supabase = createPublicClient();
  let query = supabase.from(table).select("*");
  if (orderBy) query = query.order(orderBy, { ascending: true });
  const { data, error } = await query;
  if (error) throw new Error(`Could not load ${table}: ${error.message}`);
  return (data ?? []) as T[];
}

async function attempt<T>(reader: () => Promise<T>): Promise<Loaded<T>> {
  try {
    return { ok: true, data: await reader() };
  } catch (error) {
    console.error("[portal] data load failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "This information could not be loaded right now. Please try again shortly." };
  }
}

const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));

export async function getSiteSettings(): Promise<Loaded<SiteSettings>> {
  "use cache";
  cacheTag("site_settings");
  const result = await attempt(async () => {
    const rows = await selectAll<{ key: string; value: string }>("site_settings", "key");
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getDocuments(): Promise<Loaded<PortalDocument[]>> {
  "use cache";
  cacheTag("documents");
  const result = await attempt(async () => {
    return selectAll<PortalDocument>("documents");
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getDepartments(): Promise<Loaded<Department[]>> {
  "use cache";
  cacheTag("departments");
  const result = await attempt(async () => {
    const [departments, contacts] = await Promise.all([
      selectAll<Omit<Department, "contacts">>("departments"),
      selectAll<DepartmentContact>("department_contacts"),
    ]);
    return departments.map((d) => ({
      ...d,
      contacts: contacts.filter((c) => c.department_id === d.id),
    }));
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getBusinessDirectory(): Promise<Loaded<{ groups: BusinessGroup[]; businesses: Business[] }>> {
  "use cache";
  cacheTag("businesses");
  const result = await attempt(async () => {
    const [groups, businesses, phones] = await Promise.all([
      selectAll<BusinessGroup>("business_groups"),
      selectAll<Omit<Business, "phones">>("businesses"),
      selectAll<BusinessPhone>("business_phones"),
    ]);
    const groupOrder = new Map(groups.map((g) => [g.id, g.sort_order]));
    return {
      groups,
      businesses: businesses
        .map((b) => ({ ...b, phones: phones.filter((p) => p.business_id === b.id) }))
        .sort(
          (a, b) =>
            (groupOrder.get(a.group_id) ?? 0) - (groupOrder.get(b.group_id) ?? 0) || a.sort_order - b.sort_order,
        ),
    };
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getBankAccounts(): Promise<Loaded<BankAccount[]>> {
  "use cache";
  cacheTag("bank_accounts");
  const result = await attempt(async () => {
    return selectAll<BankAccount>("bank_accounts");
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getShuttleRoutes(): Promise<Loaded<ShuttleRoute[]>> {
  "use cache";
  cacheTag("shuttle");
  const result = await attempt(async () => {
    const [stops, trips, times] = await Promise.all([
      selectAll<ShuttleStop>("shuttle_stops"),
      selectAll<Omit<ShuttleTrip, "times">>("shuttle_trips"),
      selectAll<{ trip_id: string; stop_id: string; departure: string }>("shuttle_trip_times", null),
    ]);
    const directions: ShuttleDirection[] = ["makadi_to_hurghada", "hurghada_to_makadi"];
    return directions.map((direction) => ({
      direction,
      stops: stops.filter((s) => s.direction === direction),
      trips: trips
        .filter((t) => t.direction === direction)
        .map((t) => ({
          ...t,
          times: Object.fromEntries(times.filter((x) => x.trip_id === t.id).map((x) => [x.stop_id, x.departure])),
        })),
    }));
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getEmergencyContacts(): Promise<Loaded<EmergencyContact[]>> {
  "use cache";
  cacheTag("emergency_contacts");
  const result = await attempt(async () => {
    return selectAll<EmergencyContact>("emergency_contacts");
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getContentSections(page: string): Promise<Loaded<ContentSection[]>> {
  "use cache";
  cacheTag("content_sections");
  const result = await attempt(async () => {
    const rows = await selectAll<ContentSection>("content_sections");
    return rows.filter((r) => r.page === page);
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getMembershipCatalog(): Promise<Loaded<MembershipCatalog>> {
  "use cache";
  cacheTag("membership");
  const result = await attempt(async () => {
    const [packages, prices, tickets, settings] = await Promise.all([
      selectAll<Omit<MembershipPackage, "prices">>("membership_packages"),
      selectAll<MembershipPrice>("membership_prices"),
      selectAll<DayTicket>("day_tickets"),
      selectAll<MembershipSettings>("membership_settings", null),
    ]);
    const s = settings[0];
    return {
      packages: packages.map((p) => ({
        ...p,
        prices: prices
          .filter((x) => x.package_id === p.id)
          .map((x) => ({
            ...x,
            base_price: Number(x.base_price),
            additional_member_price: num(x.additional_member_price),
          })),
      })),
      dayTickets: tickets.map((t) => ({ ...t, price: Number(t.price) })),
      settings: {
        vat_rate: s ? Number(s.vat_rate) : 0.14,
        currency: s?.currency ?? "EGP",
        reservations_phone: s?.reservations_phone ?? null,
      },
    };
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getPenalties(): Promise<Loaded<Penalty[]>> {
  "use cache";
  cacheTag("penalties");
  const result = await attempt(async () => {
    const rows = await selectAll<Penalty>("penalties");
    return rows.map((r) => ({ ...r, amount_egp: Number(r.amount_egp) }));
  });
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}
