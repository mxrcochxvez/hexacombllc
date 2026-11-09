import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolveTitle } from "next/dist/lib/metadata/resolvers/resolve-title.js";
import { blogMetadataTitle } from "../src/lib/seo.ts";

const auditedTitles = [
  "If you warranty the work, say how long on the site",
  "Remind past customers when the next service is due",
  "Say how long your quote is good for on your website",
  "Say how long you've been doing this on your website",
  "Say if estimates are free before they fill out the form",
  "Say if you're insured on your small business website",
  "Say whether the quote includes parts, or only labor",
  "Say how you'll keep customers posted during the job",
];

for (const title of auditedTitles) {
  test(`audited blog title: ${title}`, () => {
    const resolved = resolveTitle(blogMetadataTitle(title), "%s | Hexacomb");
    assert.ok(resolved.absolute.length <= 60);
    assert.ok(resolved.absolute.startsWith(title));
    assert.ok(!resolved.absolute.includes("| Hexacomb | Hexacomb"));
  });
}

test("branding fits exactly at the title budget and drops above it", () => {
  assert.equal(blogMetadataTitle("a".repeat(49)).absolute.length, 60);
  assert.equal(blogMetadataTitle("a".repeat(50)).absolute, "a".repeat(50));
  // Do not silently truncate an editor's meaning, even for future long titles.
  assert.equal(blogMetadataTitle("a".repeat(70)).absolute, "a".repeat(70));
});

const source = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");

test("static audited descriptions and human-rights title fit their budgets", () => {
  const humanRights = source("app/(site)/human-rights/page.tsx");
  const websiteDesign = source("app/(site)/website-design/page.tsx");
  const title = humanRights.match(/const pageTitle = "([^"]+)"/)[1];
  assert.ok(resolveTitle(title, "%s | Hexacomb").absolute.length <= 60);
  for (const [text, variable] of [[humanRights, "pageDescription"], [websiteDesign, "description"]]) {
    const description = text.match(new RegExp(`const ${variable} =\\s*"([^"]+)"`))[1];
    assert.ok(description.length >= 70 && description.length <= 160);
  }
});

test("blog metadata uses absolute titles without changing the article heading", () => {
  const page = source("app/(site)/blog/[slug]/page.tsx");
  assert.match(page, /title: blogMetadataTitle\(title\)/);
  assert.match(page, /<h1>\{post\.title\}<\/h1>/);
});

test("intentional canonical and noindex settings remain intact", () => {
  assert.match(source("app/(site)/pricing/page.tsx"), /canonical: "https:\/\/hexacombllc\.com\/pricing"/);
  assert.match(source("app/(site)/intake/page.tsx"), /robots: privatePageRobots/);
});
