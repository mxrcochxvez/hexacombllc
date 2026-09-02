import type { ReactNode } from "react";
import { Page } from "./Page";
import { Section } from "./Section";

export function OperatePage({ children }: { children: ReactNode }) {
  return (
    <Page density="operate" width="content">
      <Section>{children}</Section>
    </Page>
  );
}
