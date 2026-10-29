// Row types for the portal's read-only Supabase tables
// (see supabase/migrations/20261028190000_portal_schema.sql).

export type Loaded<T> = { ok: true; data: T } | { ok: false; message: string };

export type SiteSettings = Record<string, string>;

export type PortalDocument = {
  id: string;
  title: string;
  category: string;
  description: string;
  language: string;
  storage_path: string | null;
  file_type: "pdf" | "docx" | null;
  portal_href: string | null;
  sort_order: number;
};

export type ContactKind = "phone" | "email";

export type DepartmentContact = {
  id: number;
  department_id: string;
  kind: ContactKind;
  value: string;
  label: string | null;
  sort_order: number;
};

export type Department = {
  id: string;
  name: string;
  summary: string | null;
  responsibilities: string[];
  working_hours: string | null;
  notes: string | null;
  sort_order: number;
  contacts: DepartmentContact[];
};

export type BusinessGroup = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type BusinessPhone = {
  id: number;
  business_id: string;
  phone: string;
  label: string | null;
  sort_order: number;
};

export type Business = {
  id: string;
  name: string;
  group_id: string;
  category: string;
  area: string | null;
  description: string | null;
  map_url: string | null;
  sort_order: number;
  phones: BusinessPhone[];
};

export type BankAccount = {
  id: string;
  bank_name: string;
  account_holder: string;
  currency: string;
  account_number: string;
  iban: string | null;
  swift_code: string | null;
  branch_address: string | null;
  sort_order: number;
};

export type ShuttleDirection = "makadi_to_hurghada" | "hurghada_to_makadi";

export type ShuttleStop = {
  id: string;
  direction: ShuttleDirection;
  name: string;
  detail: string | null;
  sort_order: number;
};

export type ShuttleTrip = {
  id: string;
  direction: ShuttleDirection;
  period: "AM" | "PM";
  sort_order: number;
  /** departure by stop id; a missing key means the trip does not serve that stop */
  times: Record<string, string>;
};

export type ShuttleRoute = {
  direction: ShuttleDirection;
  stops: ShuttleStop[];
  trips: ShuttleTrip[];
};

export type EmergencyContact = {
  id: string;
  service: string;
  phone: string | null;
  department_id: string | null;
  availability: string | null;
  is_emergency: boolean;
  sort_order: number;
};

export type ContentSection = {
  id: string;
  page: string;
  title: string;
  intro: string | null;
  items: string[];
  tone: "default" | "notice" | "warning";
  sort_order: number;
};

export type MembershipPrice = {
  id: number;
  package_id: string;
  duration_key: string;
  duration_label: string;
  base_price: number;
  additional_member_price: number | null;
  sort_order: number;
};

export type MembershipPackage = {
  id: string;
  name: string;
  access: "beach_and_clubhouse" | "clubhouse_only";
  people_included: number;
  allows_additional_members: boolean;
  description: string | null;
  source_document_id: string | null;
  sort_order: number;
  prices: MembershipPrice[];
};

export type DayTicket = {
  id: string;
  label: string;
  price: number;
  tax_included: boolean;
  note: string | null;
  sort_order: number;
};

export type MembershipSettings = {
  vat_rate: number;
  currency: string;
  reservations_phone: string | null;
};

export type MembershipCatalog = {
  packages: MembershipPackage[];
  dayTickets: DayTicket[];
  settings: MembershipSettings;
};

export type Penalty = {
  id: number;
  category: string;
  description: string;
  amount_egp: number;
  amount_suffix: string | null;
  qualifier: string | null;
  sort_order: number;
};
