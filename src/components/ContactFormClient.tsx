"use client";

import { ContactForm } from "@/components/ContactForm";

export function ContactFormClient({ initialMessage }: { initialMessage?: string }) {
  return <ContactForm initialMessage={initialMessage} />;
}
