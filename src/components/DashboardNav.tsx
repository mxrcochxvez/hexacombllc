"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function DashboardNav({ title, subtitle }: { title: string; subtitle: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const onLeads =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/leads");
  const onClients = pathname.startsWith("/dashboard/clients");

  async function logout() {
    await fetch("/api/dashboard/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="dash-toolbar">
      <div>
        <nav className="dash-nav" aria-label="Dashboard sections">
          <Link
            href="/dashboard"
            className={onLeads ? "dash-nav__link is-active" : "dash-nav__link"}
          >
            Leads
          </Link>
          <Link
            href="/dashboard/clients"
            className={
              onClients ? "dash-nav__link is-active" : "dash-nav__link"
            }
          >
            Clients
          </Link>
        </nav>
        <h1 className="dash-title">{title}</h1>
        <p className="dash-muted">{subtitle}</p>
      </div>
      <button type="button" className="btn btn-secondary" onClick={logout}>
        Log out
      </button>
    </div>
  );
}
