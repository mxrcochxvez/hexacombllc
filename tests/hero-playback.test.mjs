import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function setup({ reduce = false, saveData = false } = {}) {
  const slots = [], effects = [], cleanups = [];
  let cursor = 0, scheduled, cancelled = false, tree;
  const motion = { matches: reduce, addEventListener(_, cb) { this.change = cb; }, removeEventListener() {} };
  const connection = { saveData };
  const video = { paused: true, play() { this.paused = false; return Promise.resolve(); }, pause() { this.paused = true; } };
  const jsx = (type, props) => ({ type, props });
  const context = {
    exports: {}, window: {}, navigator: { connection }, matchMedia: () => motion,
    require(name) {
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name === 'next/image') return { default: 'image' };
      if (name.includes('deferred-media')) return { afterPagePaint: (_, cb) => {
        cancelled = false; scheduled = () => { if (!cancelled) cb(); }; return () => { cancelled = true; };
      }};
      return {
        useState(initial) {
          const index = cursor++;
          if (!(index in slots)) slots[index] = initial;
          return [slots[index], (value) => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
        },
        useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
        useEffect(effect, deps) {
          const index = cursor++;
          if (!slots[index] || deps.some((v, i) => v !== slots[index][i])) {
            slots[index] = deps; effects.push(() => { cleanups[index]?.(); cleanups[index] = effect(); });
          }
        },
      };
    },
  };
  vm.runInNewContext(ts.transpileModule(readFileSync('src/components/PremiumHeroVideo.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, context);
  function render() {
    cursor = 0; tree = context.exports.default({ src: '/film.mp4', poster: '/poster.jpg' });
    const v = tree.props.children.find(c => c?.type === 'video'); v.props.ref.current = video;
    while (effects.length) effects.shift()();
    return tree;
  }
  render(); render();
  return {
    render, motion, connection, video,
    finishDelay() { scheduled?.(); render(); },
    source() { return tree.props.children.find(c => c?.type === 'video').props.src; },
    async toggle() { await tree.props.children.find(c => c?.props?.className === 'premium-film-control').props.onClick(); render(); },
    unmount() { cleanups.forEach(c => c?.()); },
  };
}
test('film has no source before deferred callback, then plays', () => {
  const h = setup(); assert.equal(h.source(), undefined);
  h.finishDelay(); assert.equal(h.source(), '/film.mp4'); assert.equal(h.video.paused, false);
});
test('manual play then pause is not undone by delayed autoplay', async () => {
  const h = setup(); await h.toggle(); await h.toggle();
  assert.equal(h.video.paused, true); h.finishDelay(); assert.equal(h.video.paused, true);
});
test('save-data enabled during wait prevents automatic video download', () => {
  const h = setup(); h.connection.saveData = true; h.finishDelay(); assert.equal(h.source(), undefined);
});
test('reduced-motion change cancels pending start and stops active playback', () => {
  const h = setup(); h.finishDelay(); h.motion.matches = true; h.motion.change(); h.render();
  assert.equal(h.source(), undefined); assert.equal(h.video.paused, true);
});
test('reduced-motion permits explicit play without automatic download', async () => {
  const h = setup({ reduce: true }); assert.equal(h.source(), undefined);
  await h.toggle(); assert.equal(h.source(), '/film.mp4');
});
test('unmount cancels delayed source attachment', () => {
  const h = setup(); h.unmount(); h.finishDelay(); assert.equal(h.source(), undefined);
});
