import type { Metadata } from "next";
import { FormPage } from "@/components/forms/form-page";

export const metadata: Metadata = {
  title: "Entrance Permission (Delegation Form)",
  description: "Authorise a person to enter your unit. Fill in the form online and download it as a PDF.",
};

export default function DelegationFormPage() {
  return <FormPage formId="delegation" />;
}
