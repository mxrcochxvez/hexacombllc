# Hexacomb visual system (caller usage)

You compose pages from seven components. You never pass a pixel, rem, or Tailwind spacing number for padding, margin, or gap. The layout component you pick is the spacing decision.

Persuade pages (marketing) and operate pages (dashboard, contract, feedback, review) import the same components. `Page` sets density. CSS remaps the role tokens. There is not a second kit.

Looks come from shipped `brand.css` (Archivo Black, Public Sans, OKLCH canvas/ink/signal). Do not copy DESIGN.md.

## What you import

```ts
import { Page, Section, Stack, Cluster, Panel, Button, Field } from "@/ui";
```

That is the public list. Do not import `SPACE`, `pxFor`, or theme CSS from a page. Those stay inside `src/ui/`.

## Spacing rule you can feel

| You want | You use | You do not |
| --- | --- | --- |
| A full-width band with vertical rhythm | `Section` | `py-20`, `padding: 80px` |
| A column of fields or copy blocks | `Stack` | `gap-6`, `display: grid; gap: 24px` |
| A wrapping row of actions | `Cluster` | `flex gap-3` |
| A surfaced block | `Panel` (inset is built in) | `.dash-card`, `.card` |
| A control | `Button` / `Field` | `.btn`, `.growth-button`, `.form-group` |

`Section` cannot take a stack-sized pad. `Stack` cannot take a section-sized gap. Those combinations do not typecheck.

## Call site. Marketing hero (persuade)

`Page` wraps the route. `Section pad="hero"` replaces `.growth-hero` plus the global `section { padding: 80px 0 }` fight. `Button` with `href` replaces `.growth-button.growth-button-signal`.

```tsx
import { Page, Section, Stack, Cluster, Button } from "@/ui";
import WebsiteWorkStack from "@/components/WebsiteWorkStack";

export default function HomePage() {
  return (
    <Page density="persuade">
      <Section pad="hero" labeledBy="hero-heading">
        <div className="growth-hero-grid">
          <Stack>
            <h1 id="hero-heading">
              You run the business.<span> We run the website.</span>
            </h1>
            <p>
              Hexacomb manages your site, attacks SEO, reads the reports, and
              improves the copy, month after month.
            </p>
            <Cluster>
              <Button intent="signal" href="#contact">
                Take it off my plate
              </Button>
              <Button intent="quiet" href="/website-audit">
                Check my current site
              </Button>
            </Cluster>
            <p className="growth-hero-location">
              Founder-led in Fresno. No account-manager relay.
            </p>
          </Stack>
          <WebsiteWorkStack />
        </div>
      </Section>
    </Page>
  );
}
```

`growth-hero-grid` and display type can stay as chrome in `brand.css`. Their gaps and pads must use `var(--space-*)` so `npm run check:space` passes. New bands you add should be `Section` + `Stack` + `Cluster`, not a new CSS file.

## Call site. Dashboard login (operate)

Same `Field` and `Button`. Density is the only switch. No `.dash-card`, `.form-group`, or `.btn-primary`.

```tsx
import { Page, Section, Panel, Stack, Field, Button } from "@/ui";

export function DashboardLoginForm() {
  return (
    <Page density="operate">
      <Section>
        <Panel>
          <form onSubmit={onSubmit}>
            <Stack>
              <h1>Dashboard</h1>
              <p>Enter the admin password to manage leads and agreements.</p>
              <Field label="Password" error={error}>
                <input
                  id="admin-password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={pending}
                />
              </Field>
              <Button type="submit" intent="solid" pending={pending}>
                {pending ? "Signing in…" : "Sign in"}
              </Button>
            </Stack>
          </form>
        </Panel>
      </Section>
    </Page>
  );
}
```

`Field` wires `htmlFor` / `id` / `aria-describedby` from the label and error. You still render the native control as the child. The kit does not invent a second input API.

## Call site. Contract accept (operate, public)

Client-facing and task-first. Operate density. Same shell as dashboard, growth colors, no honey/amber from `globals.css`.

```tsx
import { Page, Section, Panel, Stack, Field, Button } from "@/ui";

export function ContractAcceptForm() {
  return (
    <Page density="operate">
      <Section>
        <Panel>
          <form onSubmit={onAccept}>
            <Stack>
              <h1>Website agreement</h1>
              <Field label="Your name" error={nameError}>
                <input name="signerName" value={name} onChange={onName} required />
              </Field>
              <Button type="submit" intent="solid" pending={pending}>
                Accept agreement
              </Button>
            </Stack>
          </form>
        </Panel>
      </Section>
    </Page>
  );
}
```

## Density

```tsx
<Page density="persuade">  {/* marketing */}
<Page density="operate">   {/* dashboard, contract, feedback, review */}
```

`Page` sets `data-density` on a wrapper. Role tokens change. Component names do not.

## What pages must not do

- `className="p-8"`, `gap-2.5`, `p-[13px]`, `mb-6` for layout
- `style={{ padding: 20 }}` or `padding: "2rem"`
- Import `.btn`, `.dash-*`, `.form-group`, `.container` from `globals.css` (that file is deleted in the same wave as the last caller)
- Add `PersuadeButton` / `DashButton`
- Pass `gap={16}` or `pad={80}`

Layout chrome that is not a new component (navbar inner, footer columns) uses `var(--space-gutter)` and `var(--space-cluster)` in CSS. The space check fails any other padding, margin, or gap in `src/`.

## Verify

```bash
npm run check:space
```

The command exits non-zero when `src/` has off-scale padding, margin, or gap. Run it after each page you migrate. Delete `src/app/globals.css` when it has no remaining selectors in use, then drop its import from `layout.tsx`.
