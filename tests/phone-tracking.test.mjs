import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Execute the real component with isolated DOM/React/analytics dependencies.
function setup() {
  const events = [];
  const listeners = new Map();
  let cleanup;
  class Element {
    constructor(phone = null, tracked = null) {
      this.phone = phone;
      this.tracked = tracked;
    }
    closest(selector) {
      return selector === "[data-track]" ? this.tracked : this.phone;
    }
  }
  const source = readFileSync("src/components/TrackClicks.tsx", "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const context = {
    exports: {}, Element,
    document: {
      addEventListener: (name, handler) => listeners.set(name, handler),
      removeEventListener: (name, handler) => {
        if (listeners.get(name) === handler) listeners.delete(name);
      },
    },
    require: (name) => name === "react"
      ? { useEffect: (effect) => { cleanup = effect(); } }
      : {
          track: (...args) => events.push(["first-party", ...args]),
          trackGA4: (...args) => events.push(["ga4", ...args]),
        },
  };
  vm.runInNewContext(compiled, context);
  context.exports.default();
  return {
    events, listeners, Element,
    click: (target) => listeners.get("click")({ target }),
    cleanup: () => cleanup(),
  };
}

for (const location of ["contact", "footer"]) {
  test(`${location} phone click emits intent once with placement only`, () => {
    const h = setup();
    const link = { getAttribute: () => location };
    h.click(new h.Element(link)); // Also models a nested element inside the link.
    assert.equal(h.events.length, 1);
    assert.equal(h.events[0][1], "phone_click");
    assert.equal(JSON.stringify(h.events[0][2]), JSON.stringify({ link_location: location }));
    assert.ok(!JSON.stringify(h.events).includes("generate_lead"));
  });
}

test("unrelated links and non-element targets do not emit events", () => {
  const h = setup();
  h.click(new h.Element());
  h.click(null);
  h.click({});
  assert.equal(h.events.length, 0);
});

test("existing data-track events are preserved", () => {
  const h = setup();
  h.click(new h.Element(null, {
    getAttribute: () => "nav_about",
    closest: () => ({ getAttribute: () => "/about" }),
    textContent: "About", tagName: "A",
  }));
  assert.equal(h.events.length, 1);
  assert.equal(h.events[0][0], "first-party");
  assert.equal(h.events[0][1], "nav_about");
});

test("unmount removes the delegated listener", () => {
  const h = setup();
  h.cleanup();
  assert.equal(h.listeners.size, 0);
});

test("both published phone links opt in with distinct placements", () => {
  for (const [file, location] of [["AgencyContact", "contact"], ["Footer", "footer"]]) {
    const source = readFileSync(`src/components/${file}.tsx`, "utf8");
    assert.match(source, new RegExp(`href="tel:[^"]+" data-phone-location="${location}"`));
  }
});
