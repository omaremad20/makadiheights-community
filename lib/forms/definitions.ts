import delegationLayout from "./layouts/delegation.json";
import tenantLayout from "./layouts/tenant.json";

export type FieldType = "text" | "tel" | "email" | "date" | "select" | "textarea";

export type FormField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  autoComplete?: string;
  /** Prefill from another field when left empty (e.g. signature name). */
  defaultFrom?: string;
  /** Prefill with today's date. */
  defaultToday?: boolean;
  /** For date ranges: must be on or after this field. */
  notBefore?: string;
};

export type FormLayout = {
  template: string;
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
  fields: { name: string; page: number; x: number; y: number; width: number; rtl: boolean }[];
};

export type FormDefinition = {
  id: "delegation" | "tenant";
  title: string;
  subtitle: string;
  description: string;
  fileName: string;
  documentId: string;
  sections: { title: string; description?: string; fields: FormField[] }[];
  notes: string[];
  layout: FormLayout;
};

export const DELEGATION_FORM: FormDefinition = {
  id: "delegation",
  title: "Entrance Permission",
  subtitle: "Delegation form",
  description: "Authorise a person to enter your unit. The PDF reproduces the official bilingual form (English and Arabic pages).",
  fileName: "makadi-heights-entrance-permission.pdf",
  documentId: "delegation-form",
  sections: [
    {
      title: "Unit owner",
      fields: [
        { name: "ownerName", label: "Owner’s full name", type: "text", required: true, maxLength: 70, autoComplete: "name" },
        { name: "unitNumber", label: "Unit number", type: "text", required: true, maxLength: 20 },
      ],
    },
    {
      title: "Delegate",
      description: "A copy of the delegate’s ID or passport is needed, and the delegate’s phone number is mandatory.",
      fields: [
        { name: "delegateName", label: "Delegate’s full name (Mr./Ms.)", type: "text", required: true, maxLength: 70 },
        { name: "delegateId", label: "ID / passport number", type: "text", required: true, maxLength: 30 },
        { name: "delegatePhone", label: "Delegate’s phone number", type: "tel", required: true, maxLength: 20, autoComplete: "off" },
      ],
    },
    {
      title: "Permission",
      fields: [
        { name: "reason", label: "Reason for entering the unit", type: "text", required: true, maxLength: 80, placeholder: "e.g. maintenance, cleaning, guest stay" },
        { name: "startDate", label: "Starting from", type: "date", required: true },
        { name: "endDate", label: "Until", type: "date", notBefore: "startDate", help: "Leave empty for “until further notice”." },
      ],
    },
    {
      title: "Signature",
      description: "Print the PDF and sign it by hand. The signature line is left blank.",
      fields: [
        { name: "signName", label: "Name", type: "text", required: true, maxLength: 45, defaultFrom: "ownerName" },
        { name: "signDate", label: "Date", type: "date", required: true, defaultToday: true },
      ],
    },
  ],
  notes: [
    "Abiding by the community rules and regulations, the owner pledges any behaviour made by the delegate.",
    "Any breach of the community regulations will lead to the cancellation of the delegation.",
  ],
  layout: delegationLayout as FormLayout,
};

export const TENANT_FORM: FormDefinition = {
  id: "tenant",
  title: "Move-in Permit",
  subtitle: "Tenant form",
  description: "Register a tenant’s details for a rental. The PDF reproduces the official bilingual form.",
  fileName: "makadi-heights-move-in-permit.pdf",
  documentId: "tenant-form",
  sections: [
    {
      title: "Unit",
      fields: [{ name: "unitNumber", label: "Unit number", type: "text", required: true, maxLength: 20 }],
    },
    {
      title: "Tenant",
      description: "A copy of the tenant’s ID or passport is needed.",
      fields: [
        { name: "tenantName", label: "Tenant’s full name", type: "text", required: true, maxLength: 80 },
        { name: "tenantAddress", label: "Tenant’s address", type: "text", maxLength: 90 },
        { name: "tenantMobile", label: "Tenant’s mobile number", type: "tel", required: true, maxLength: 20 },
        { name: "tenantEmail", label: "Tenant’s email address", type: "email", maxLength: 80 },
        { name: "tenantId", label: "ID / passport number", type: "text", required: true, maxLength: 30 },
      ],
    },
    {
      title: "Rental",
      fields: [
        { name: "startDate", label: "Start renting date", type: "date", required: true },
        { name: "endDate", label: "End renting date", type: "date", required: true, notBefore: "startDate" },
        {
          name: "furnished",
          label: "Furnished",
          type: "select",
          required: true,
          options: [
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ],
        },
      ],
    },
  ],
  notes: [
    "The owner’s, tenant’s and Community Management representative’s signature lines are left blank — sign the printed form.",
    "Tenant IDs or passports must reach Community Management at least 48 hours before arrival.",
  ],
  layout: tenantLayout as FormLayout,
};

export const FORMS = { delegation: DELEGATION_FORM, tenant: TENANT_FORM } as const;
