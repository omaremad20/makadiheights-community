import type { Metadata } from "next";
import { FormPage } from "@/components/forms/form-page";

export const metadata: Metadata = {
  title: "Move-in Permit (Tenant Form)",
  description: "Register a tenant's details. Fill in the form online and download it as a PDF.",
};

export default function TenantFormPage() {
  return <FormPage formId="tenant" />;
}
