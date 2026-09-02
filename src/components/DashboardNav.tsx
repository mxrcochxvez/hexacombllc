"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/ui";

export function DashboardNav({
  title,
  subtitle,
  showSectionNav = true,
}: {
  title: string;
  subtitle: string;
  showSectionNav?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const onLeads = pathname === "/dashboard" || pathname.startsWith("/dashboard/leads");
  const onClients = pathname.startsWith("/dashboard/clients");
  const onBlog = pathname.startsWith("/dashboard/blog");

  async function logout() {
    await fetch("/api/dashboard/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="ui-toolbar">
      <div>
        {showSectionNav ? (
          <nav className="ui-nav" aria-label="Dashboard sections">
            <Link href="/dashboard" className="ui-nav-link" data-active={onLeads ? "true" : undefined}>
              Leads
            </Link>
            <Link href="/dashboard/clients" className="ui-nav-link" data-active={onClients ? "true" : undefined}>
              Clients
            </Link>
            <Link href="/dashboard/blog" className="ui-nav-link" data-active={onBlog ? "true" : undefined}>
              Blog
            </Link>
          </nav>
        ) : null}
        <h1 className="dash-title">{title}</h1>
        <p className="dash-muted">{subtitle}</p>
      </div>
      <Button type="button" intent="ghost" onClick={logout}>
        Log out
      </Button>
    </div>
  );
}
