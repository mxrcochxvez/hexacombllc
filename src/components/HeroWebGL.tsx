"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Group, Material, Mesh, Texture, WebGLRenderer } from "three";

type HeroWebGLProps = { progress: RefObject<number>; renderSceneRef: RefObject<() => void>; onUnavailable: () => void };

function paintScreen(mobile: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = mobile ? 600 : 1440;
  canvas.height = mobile ? 1200 : 900;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const w = canvas.width;
  ctx.fillStyle = "#f4f2e9";
  ctx.fillRect(0, 0, w, canvas.height);
  ctx.fillStyle = "#163e43";
  ctx.font = `600 ${mobile ? 27 : 30}px sans-serif`;
  ctx.fillText("FIELDWORK", 48, mobile ? 110 : 66);
  ctx.font = "22px sans-serif";
  if (!mobile) ctx.fillText("Services       Our story       Get in touch ↗", 940, 66);
  ctx.fillStyle = "#c6d7d0";
  ctx.fillRect(48, mobile ? 150 : 103, w - 96, 2);
  ctx.fillStyle = "#163e43";
  ctx.font = `400 ${mobile ? 75 : 104}px Georgia, serif`;
  ctx.fillText("Space to", 48, mobile ? 263 : 230);
  ctx.fillText("live well.", 48, mobile ? 337 : 328);

  ctx.font = `${mobile ? 25 : 27}px sans-serif`;
  ctx.fillStyle = "#526964";
  ctx.fillText("Considered spaces. Everyday living.", 48, mobile ? 476 : 490);
  ctx.fillStyle = "#e3b944";
  ctx.beginPath();
  ctx.roundRect(48, mobile ? 521 : 540, 259, 64, 6);
  ctx.fill();
  ctx.fillStyle = "#163e43";
  ctx.font = "600 23px sans-serif";
  ctx.fillText("Explore our work ↗", 77, mobile ? 562 : 581);
  const x = mobile ? 48 : 795;
  const y = mobile ? 646 : 151;
  const width = mobile ? 504 : 597;
  const height = mobile ? 336 : 500;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 3);
  ctx.clip();
  ctx.fillStyle = "#bad0c5";
  ctx.fillRect(x, y, width, height);
  const wall = ctx.createLinearGradient(x, y, x + width, y + height);
  wall.addColorStop(0, "#e7d8bd"); wall.addColorStop(1, "#b69b74");
  ctx.fillStyle = wall; ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#f0e5cf";
  ctx.fillRect(x + width * .1, y + height * .12, width * .44, height);
  ctx.fillStyle = "#817059";
  ctx.beginPath(); ctx.roundRect(x + width * .2, y + height * .27, width * .22, height * .8, [width * .11, width * .11, 0, 0]); ctx.fill();
  const doorway = ctx.createLinearGradient(x + width * .2, y, x + width * .42, y);
  doorway.addColorStop(0, "#5b6253"); doorway.addColorStop(1, "#a9ab8f");
  ctx.fillStyle = doorway; ctx.fillRect(x + width * .24, y + height * .5, width * .14, height * .5);
  ctx.fillStyle = "#74644733"; ctx.beginPath(); ctx.moveTo(x + width * .54, y + height * .12); ctx.lineTo(x + width, y + height * .7); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width * .54, y + height); ctx.fill();
  ctx.fillStyle = "#d6c5a8"; ctx.fillRect(x, y + height * .87, width, height * .13);
  ctx.fillStyle = "#eee4cf"; ctx.fillRect(x + width * .1, y + height * .81, width * .46, height * .06);
  ctx.restore();
  ctx.fillStyle = "#163e43";
  ctx.font = "600 25px sans-serif";
  const bottom = mobile ? 1060 : 770;
  ctx.fillText("Thoughtfully made. Naturally yours.", 48, bottom);
  ctx.fillStyle = "#526964";
  ctx.font = "22px sans-serif";
  ctx.fillText("Services  /  Our story  /  Contact", 48, bottom + 48);
  return canvas;
}

export default function HeroWebGL({ progress, renderSceneRef, onUnavailable }: HeroWebGLProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const shell = shellRef.current;
    const canvas = canvasRef.current;
    if (!shell || !canvas) return;
    let disposed = false;
    let renderer: WebGLRenderer | undefined;
    let observer: ResizeObserver | undefined;
    let visibilityObserver: IntersectionObserver | undefined;
    let cleanupScene = () => {};
    let draw = () => {};
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = (event: PointerEvent) => {
      if (reduced.matches) return;
      const rect = shell.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
      wake();
    };
    const resetPointer = () => { pointerX = 0; pointerY = 0; wake(); };
    const wake = () => {
      if (visible && !document.hidden && !disposed) draw();
    };
    renderSceneRef.current = wake;
    const lostContext = (event: Event) => { event.preventDefault(); onUnavailable(); };
    canvas.addEventListener("webglcontextlost", lostContext);

    void (async () => {
      const [THREE, { RoundedBoxGeometry }, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/addons/geometries/RoundedBoxGeometry.js"),
        import("three/addons/environments/RoomEnvironment.js"),
      ]);
      if (disposed) return;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, 0.04);
      scene.environment = environment.texture;
      room.dispose();
      pmrem.dispose();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
      camera.position.set(0, 1.8, 7.5);
      camera.lookAt(0, 0.55, 0);
      scene.add(new THREE.HemisphereLight(0xf7f4e9, 0x7b9993, 2));
      const light = new THREE.DirectionalLight(0xfff5e8, 3);
      light.position.set(-3, 6, 5);
      scene.add(light);
      const silver = new THREE.MeshStandardMaterial({ color: 0x9caaa9, metalness: 0.95, roughness: 0.28 });
      const edge = new THREE.MeshStandardMaterial({ color: 0x536565, metalness: 0.9, roughness: 0.22 });
      const graphite = new THREE.MeshStandardMaterial({ color: 0x141d20, metalness: 0.3, roughness: 0.35 });
      const keys = new THREE.MeshStandardMaterial({ color: 0x111919, metalness: 0.0, roughness: 0.75, envMapIntensity: 0.25 });
      const textures: Texture[] = [];
      const rounded = (group: Group, width: number, height: number, depth: number, radius: number, material: Material, x: number, y: number, z: number) => {
        const mesh = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 4, radius), material);
        mesh.position.set(x, y, z);
        group.add(mesh);
        return mesh;
      };
      const phoneShell = (width: number, height: number, depth: number, radius: number, material: Material) => {
        const shape = new THREE.Shape();
        const x = -width / 2, y = -height / 2;
        shape.moveTo(x + radius, y); shape.lineTo(x + width - radius, y);
        shape.quadraticCurveTo(x + width, y, x + width, y + radius);
        shape.lineTo(x + width, y + height - radius); shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        shape.lineTo(x + radius, y + height); shape.quadraticCurveTo(x, y + height, x, y + height - radius);
        shape.lineTo(x, y + radius); shape.quadraticCurveTo(x, y, x + radius, y);
        const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .008, bevelThickness: .008, curveSegments: 16 }), material);
        mesh.position.z = -depth / 2;
        return mesh;
      };
      const display = (group: Group, width: number, height: number, mobile: boolean, y: number, z: number) => {
        const texture = new THREE.CanvasTexture(paintScreen(mobile));
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 1;
        textures.push(texture);
        const shape = new THREE.Shape();
        const r = mobile ? 0.095 : 0.035;
        shape.moveTo(-width / 2 + r, -height / 2);
        shape.lineTo(width / 2 - r, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + r);
        shape.lineTo(width / 2, height / 2 - r);
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - r, height / 2);
        shape.lineTo(-width / 2 + r, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - r);
        shape.lineTo(-width / 2, -height / 2 + r);
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + r, -height / 2);
        const geometry = new THREE.ShapeGeometry(shape, 16);
        const positions = geometry.attributes.position;
        const uv = geometry.attributes.uv;
        for (let i = 0; i < positions.count; i++) uv.setXY(i, positions.getX(i) / width + 0.5, positions.getY(i) / height + 0.5);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
        mesh.position.set(0, y, z);
        group.add(mesh);
      };
      const laptop = new THREE.Group();
      scene.add(laptop);
      rounded(laptop, 3.35, 0.105, 2.22, 0.045, silver, 0, 0, 0);
      rounded(laptop, 3.30, 0.035, 2.17, 0.017, edge, 0, -0.055, 0);
      rounded(laptop, 2.91, 0.025, 1.08, 0.012, graphite, 0, 0.06, -0.34);
      const keyGeometry = new RoundedBoxGeometry(0.173, 0.022, 0.155, 2, 0.012);
      const keyboard = new THREE.InstancedMesh(keyGeometry, keys, 70);
      const matrix = new THREE.Matrix4();
      for (let row = 0; row < 5; row++) for (let col = 0; col < 14; col++) {
        matrix.makeTranslation(-1.30 + col * 0.20, 0.085, -0.72 + row * 0.19);
        keyboard.setMatrixAt(row * 14 + col, matrix);
      }
      laptop.add(keyboard);
      const legends = document.createElement("canvas"); legends.width = 1400; legends.height = 500;
      const legendContext = legends.getContext("2d");
      if (legendContext) {
        legendContext.fillStyle = "#b9c3c1"; legendContext.font = "24px sans-serif"; legendContext.textAlign = "center";
        ["1 2 3 4 5 6 7 8 9 0 − + ⌫", "Q W E R T Y U I O P [ ]", "A S D F G H J K L ; ‘ ↵", "Z X C V B N M , . / ↑", "fn ⌃ ⌥ ⌘ · · · · · ⌘ ⌥ ← ↓ →"].forEach((row, y) => row.split(" ").forEach((key, x) => legendContext.fillText(key, 50 + x * 100, 55 + y * 100)));
      }
      const legendTexture = new THREE.CanvasTexture(legends); textures.push(legendTexture);
      const legendPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.8, .95), new THREE.MeshBasicMaterial({ map: legendTexture, transparent: true, depthWrite: false }));
      legendPlane.rotation.x = -Math.PI / 2; legendPlane.position.set(0, .099, -.34); laptop.add(legendPlane);

      rounded(laptop, 1.12, 0.025, 0.13, 0.012, keys, 0, 0.085, 0.26);
      rounded(laptop, 1.15, 0.01, 0.55, 0.005, edge, 0, 0.058, 0.70);
      rounded(laptop, 1.12, 0.01, 0.52, 0.005, silver, 0, 0.065, 0.70);
      for (const x of [-1.22, 1.22]) rounded(laptop, 0.35, 0.12, 0.12, 0.05, edge, x, 0.06, -1.02);
      const lid = new THREE.Group();
      lid.position.set(0, 0.08, -1.02);
      lid.rotation.x = -0.18;
      laptop.add(lid);
      rounded(lid, 3.35, 2.18, 0.09, 0.044, silver, 0, 1.08, 0);
      rounded(lid, 3.25, 2.08, 0.027, 0.013, graphite, 0, 1.08, 0.053);
      display(lid, 3.08, 1.925, false, 1.08, 0.070);
      rounded(lid, 0.09, 0.027, 0.012, 0.006, graphite, 0, 2.078, 0.075);
      const phone = new THREE.Group();
      scene.add(phone);
      phone.add(phoneShell(1.10, 2.20, .13, .145, edge));
      phone.add(phoneShell(1.066, 2.166, .135, .13, graphite));
      display(phone, 1.00, 2.08, true, 0, 0.09);
      const island = phoneShell(.26, .068, .004, .034, new THREE.MeshBasicMaterial({ color: 0x080d0e }));
      island.position.set(0, .957, .10); phone.add(island);
      rounded(phone, 0.035, 0.25, 0.075, 0.016, silver, 0.552, 0.40, 0);
      rounded(phone, 0.035, 0.14, 0.075, 0.016, silver, -0.552, 0.45, 0);
      rounded(phone, 0.035, 0.14, 0.075, 0.016, silver, -0.552, 0.24, 0);
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = shadowCanvas.height = 128;
      const shadowCtx = shadowCanvas.getContext("2d");
      if (shadowCtx) {
        const gradient = shadowCtx.createRadialGradient(64, 64, 3, 64, 64, 64);
        gradient.addColorStop(0, "rgba(20,48,44,0.25)");
        gradient.addColorStop(1, "rgba(20,48,44,0)");
        shadowCtx.fillStyle = gradient;
        shadowCtx.fillRect(0, 0, 128, 128);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      textures.push(shadowTexture);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.7), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.35;
      scene.add(shadow);
      cleanupScene = () => {
        const materials = new Set<Material>();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const mesh: Mesh = object;
            for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) materials.add(material);
          }
        });
        materials.forEach((material) => material.dispose());
        textures.forEach((texture) => texture.dispose());
        environment.dispose();
      };
      const size = () => {
        if (!renderer) return;
        renderer.setSize(shell.clientWidth, shell.clientHeight, false);
        camera.aspect = shell.clientWidth / Math.max(1, shell.clientHeight);
        camera.position.z = camera.aspect < 1 ? 9.0 : 7.5;
        camera.updateProjectionMatrix();
        wake();
      };
      draw = () => {
        if (disposed || !renderer) return;
        const p = reduced.matches ? 0 : Math.max(0, Math.min(4, progress.current));
        const index = Math.min(3, Math.floor(p));
        const t = Math.max(0, Math.min(1, (p - index - .12) / .76));
        const blend = t * t * t * (t * (t * 6 - 15) + 10);
        const mobile = camera.aspect < 1;
        // One shared scroll clock; every pose has a quiet hold before its transition.
        const poses = mobile ? [
          { lx: 0, ly: -1.25, ls: .73, lr: -.1, px: 2.1, py: .6, ps: 0, pr: -.3 },
          { lx: -.8, ly: 1.15, ls: 0, lr: -.3, px: .3, py: 1.7, ps: .95, pr: -.15 },
          { lx: 0, ly: .6, ls: .70, lr: .1, px: 2.1, py: 1.7, ps: 0, pr: .1 },
          { lx: -1.2, ly: 1.15, ls: 0, lr: .2, px: 0, py: 1.7, ps: 1.0, pr: .06 },
          { lx: -.35, ly: .75, ls: .48, lr: -.15, px: 1, py: 1.35, ps: .5, pr: -.15 },
        ] : [
          { lx: 0, ly: -1.2, ls: 1.0, lr: -.06, px: 3.6, py: .5, ps: 0, pr: -.3 },
          { lx: .25, ly: -.3, ls: .35, lr: -.3, px: 1.9, py: .65, ps: 1.5, pr: -.16 },
          { lx: 1.75, ly: -.25, ls: 1.05, lr: -.07, px: 3.6, py: .5, ps: 0, pr: .1 },
          { lx: .3, ly: -.3, ls: 0, lr: .2, px: 1.7, py: .65, ps: 1.6, pr: .08 },
          { lx: 1.1, ly: -.3, ls: .9, lr: -.16, px: 3.3, py: .5, ps: .75, pr: -.16 },
        ];
        const start = poses[index]; const end = poses[index + 1];
        const mix = (key: keyof typeof start) => start[key] + (end[key] - start[key]) * blend;
        laptop.position.set(mix("lx"), mix("ly"), 0);
        laptop.rotation.set(0, mix("lr") + pointerX * .025, 0);
        laptop.scale.setScalar(Math.max(.001, mix("ls")));
        laptop.visible = mix("ls") > .01;
        lid.rotation.x = -.18;
        phone.position.set(mix("px"), mix("py"), .15);
        phone.rotation.set(-.025 + pointerY * .025, mix("pr") + pointerX * .025, -.025);
        phone.scale.setScalar(Math.max(.001, mix("ps")));
        phone.visible = mix("ps") > .01;
        shadow.position.set(mix("lx"), mix("ly") - .18, 0);
        shadow.scale.setScalar(mix("ls"));
        renderer.render(scene, camera);
      };
      size();
      observer = new ResizeObserver(size);
      observer.observe(shell);
      visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; wake(); });
      visibilityObserver.observe(shell);
      shell.addEventListener("pointermove", pointer);
      shell.addEventListener("pointerleave", resetPointer);
      document.addEventListener("visibilitychange", wake);
      reduced.addEventListener("change", wake);
      setReady(true);
    })().catch(() => { if (!disposed) onUnavailable(); });

    return () => {
      disposed = true;
      renderSceneRef.current = () => {};
      observer?.disconnect();
      visibilityObserver?.disconnect();
      shell.removeEventListener("pointermove", pointer);
      shell.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", wake);
      reduced.removeEventListener("change", wake);
      canvas.removeEventListener("webglcontextlost", lostContext);
      cleanupScene();
      renderer?.dispose();
    };
  }, [onUnavailable, progress, renderSceneRef]);

  return <div ref={shellRef} className="hero-3d-scene" data-ready={ready} aria-hidden><canvas ref={canvasRef} className="hero-3d-canvas" /></div>;
}
