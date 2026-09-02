"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Page, Panel, Section, Stack } from "@/ui";

export function DashboardLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Page density="operate" width="narrow">
      <Section>
        <Panel>
          <Stack as="form" onSubmit={onSubmit}>
            <h1>Dashboard</h1>
            <p>Enter the admin password to manage leads and agreements.</p>
            <Field label="Password" error={error}>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={pending}
              />
            </Field>
            <Button type="submit" intent="solid" pending={pending} fill>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </Stack>
        </Panel>
      </Section>
    </Page>
  );
}
