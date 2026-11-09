import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
const compiled = ts.transpileModule(readFileSync('src/lib/deferred-media.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
function helpers(extra = {}) {
  const context = { exports: {}, ...extra };
  vm.runInNewContext(compiled, context);
  return context.exports;
}
function fakeWindow(readyState = 'loading', idleSupported = true) {
  const queue = new Map();
  const listeners = new Map();
  let id = 0;
  const schedule = (callback) => { queue.set(++id, callback); return id; };
  const win = {
    document: { readyState },
    addEventListener: (name, cb) => listeners.set(name, cb),
    removeEventListener: (name) => listeners.delete(name),
    requestAnimationFrame: schedule, cancelAnimationFrame: (id) => queue.delete(id),
    setTimeout: schedule, clearTimeout: (id) => queue.delete(id),
    ...(idleSupported ? { requestIdleCallback: schedule, cancelIdleCallback: (id) => queue.delete(id) } : {}),
  };
  return { win, queue, listeners, tick() {
    const [id, cb] = queue.entries().next().value;
    queue.delete(id); cb();
  }};
}
test('film waits for page load, two paints, then idle time', () => {
  const h = fakeWindow(); let calls = 0;
  helpers().afterPagePaint(h.win, () => calls++);
  assert.equal(h.queue.size, 0);
  h.listeners.get('load')();
  h.tick(); h.tick(); assert.equal(calls, 0);
  h.tick(); assert.equal(calls, 1);
});
for (const stage of [0, 1, 2, 3]) {
  test(`unmount cancels delayed film at stage ${stage}`, () => {
    const h = fakeWindow(); let calls = 0;
    const cancel = helpers().afterPagePaint(h.win, () => calls++);
    if (stage) h.listeners.get('load')();
    for (let i = 1; i < stage; i++) h.tick();
    cancel();
    assert.equal(h.listeners.size, 0); assert.equal(h.queue.size, 0); assert.equal(calls, 0);
  });
}
test('already-loaded pages and browsers without idle callback use fallback', () => {
  const h = fakeWindow('complete', false); let calls = 0;
  helpers().afterPagePaint(h.win, () => calls++);
  h.tick(); h.tick(); h.tick(); assert.equal(calls, 1);
});
test('below-fold security waits until form approaches and disconnects', () => {
  let callback, observed, options, disconnects = 0, calls = 0;
  class IntersectionObserver {
    constructor(cb, opts) { callback = cb; options = opts; }
    observe(el) { observed = el; }
    disconnect() { disconnects++; }
  }
  const element = {};
  const cleanup = helpers({ IntersectionObserver }).observeNearby(element, () => calls++);
  assert.equal(observed, element); assert.equal(options.rootMargin, '400px');
  callback([{ isIntersecting: false }]); assert.equal(calls, 0);
  callback([{ isIntersecting: true }]); assert.equal(calls, 1); assert.equal(disconnects, 1);
  cleanup(); assert.equal(disconnects, 2);
  callback([{ isIntersecting: true }]); assert.equal(calls, 1);
});
test('security starts immediately without IntersectionObserver', () => {
  let calls = 0; helpers().observeNearby({}, () => calls++)(); assert.equal(calls, 1);
});
test('critical image, deferred map, security gate and focus fallback remain wired', () => {
  const hero = readFileSync('src/components/PremiumHeroVideo.tsx', 'utf8');
  assert.match(hero, /loading="eager"/); assert.match(hero, /fetchPriority="high"/);
  assert.match(hero, /src=\{enabled \? src : undefined\}/);
  assert.match(hero, /motion\.matches/); assert.match(hero, /connection\?\.saveData/);
  const form = readFileSync('src/components/ContactForm.tsx', 'utf8');
  assert.match(form, /securityReady && <Turnstile/);
  assert.match(form, /onFocusCapture=\{\(\) => setSecurityReady\(true\)\}/);
  assert.match(form, /status === "sending" \|\| !turnstileToken/);
  assert.match(form, /onExpire=\{\(\) => setTurnstileToken\(null\)\}/);
  assert.match(readFileSync('src/components/CentralValleyMap.tsx', 'utf8'), /loading="lazy"/);
});
