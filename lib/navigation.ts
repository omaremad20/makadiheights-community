export type NavItem = { href: string; label: string; description: string };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Directory",
    items: [
      { href: "/departments", label: "Departments & Contacts", description: "Who handles what, and how to reach them" },
      { href: "/commercial", label: "Commercial Directory", description: "Shops, restaurants and services in town" },
      { href: "/security", label: "Security & Emergency", description: "Emergency numbers and safety guidance" },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/banking", label: "Banking & Payments", description: "CIB account details for transfers" },
      { href: "/shuttle", label: "Shuttle Bus", description: "Makadi Heights ⇄ Hurghada times" },
      { href: "/serenity", label: "Serenity Beach", description: "Beach access, discounts and the menu" },
      { href: "/membership", label: "Membership & Pricing", description: "2026 prices and calculator" },
    ],
  },
  {
    label: "Paperwork",
    items: [
      { href: "/forms", label: "Online Forms", description: "Delegation and move-in permits as PDF" },
      { href: "/rules", label: "Rules & Regulations", description: "Tenant rules and the penalties list" },
      { href: "/announcements/may-2025", label: "Announcements", description: "May 2025 community update" },
      { href: "/documents", label: "All Documents", description: "Every original document in one place" },
    ],
  },
];

/** Links shown inline in the header on large screens. */
export const PRIMARY_LINKS: NavItem[] = [
  NAV_GROUPS[0].items[0],
  NAV_GROUPS[0].items[1],
  NAV_GROUPS[1].items[2],
  NAV_GROUPS[2].items[0],
  NAV_GROUPS[2].items[3],
];
