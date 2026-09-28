"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./Waves.css";

class Grad {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  dot2(x: number, y: number) {
    return this.x * x + this.y * y;
  }
}

class Noise {
  private grad3: Grad[];
  private p: number[];
  private perm: number[];
  private gradP: Grad[];

  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1),
    ];
    this.p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
      21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
      237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
      111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216,
      80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
      3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
      17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
      129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193,
      238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128,
      195, 78, 66, 215, 61, 156, 180,
    ];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }

  seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    for (let i = 0; i < 256; i++) {
      const v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }

  fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  }

  perlin2(x: number, y: number) {
    const X = Math.floor(x);
    const Y = Math.floor(y);
    const xf = x - X;
    const yf = y - Y;
    const xi = X & 255;
    const yi = Y & 255;
    const n00 = this.gradP[xi + this.perm[yi]].dot2(xf, yf);
    const n01 = this.gradP[xi + this.perm[yi + 1]].dot2(xf, yf - 1);
    const n10 = this.gradP[xi + 1 + this.perm[yi]].dot2(xf - 1, yf);
    const n11 = this.gradP[xi + 1 + this.perm[yi + 1]].dot2(xf - 1, yf - 1);
    const u = this.fade(xf);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(yf));
  }
}

type WavePoint = {
  x: number;
  y: number;
  wave: { x: number; y: number };
  cursor: { x: number; y: number; vx: number; vy: number };
};

type WavesConfig = {
  lineColor: string;
  waveSpeedX: number;
  waveSpeedY: number;
  waveAmpX: number;
  waveAmpY: number;
  friction: number;
  tension: number;
  maxCursorMove: number;
  xGap: number;
  yGap: number;
};

export type WavesProps = {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  style?: CSSProperties;
  className?: string;
};

const Waves = ({
  lineColor = "black",
  backgroundColor = "transparent",
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 100,
  style,
  className = "",
}: WavesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boundingRef = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const linesRef = useRef<WavePoint[][]>([]);
  const mouseRef = useRef({
    x: -10,
    y: 0,
    lx: 0,
    ly: 0,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  });
  const configRef = useRef<WavesConfig>({
    lineColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap,
  });
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    configRef.current = {
      lineColor,
      waveSpeedX,
      waveSpeedY,
      waveAmpX,
      waveAmpY,
      friction,
      tension,
      maxCursorMove,
      xGap,
      yGap,
    };
  }, [lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const noise = new Noise(Math.random());

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      boundingRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const setLines = () => {
      const { width, height } = boundingRef.current;
      const next: WavePoint[][] = [];
      const oWidth = width + 200;
      const oHeight = height + 30;
      const gapX = Math.max(1, configRef.current.xGap);
      const gapY = Math.max(1, configRef.current.yGap);
      const totalLines = Math.ceil(oWidth / gapX);
      const totalPoints = Math.ceil(oHeight / gapY);
      const xStart = (width - gapX * totalLines) / 2;
      const yStart = (height - gapY * totalPoints) / 2;
      for (let i = 0; i <= totalLines; i++) {
        const pts: WavePoint[] = [];
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({
            x: xStart + gapX * i,
            y: yStart + gapY * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }
        next.push(pts);
      }
      linesRef.current = next;
    };

    const movePoints = (time: number) => {
      const lines = linesRef.current;
      const mouse = mouseRef.current;
      const { waveSpeedX: speedX, waveSpeedY: speedY, waveAmpX: ampX, waveAmpY: ampY, friction: drag, tension: spring, maxCursorMove: limit } =
        configRef.current;
      for (const pts of lines) {
        for (const p of pts) {
          const move = noise.perlin2((p.x + time * speedX) * 0.002, (p.y + time * speedY) * 0.0015) * 12;
          p.wave.x = Math.cos(move) * ampX;
          p.wave.y = Math.sin(move) * ampY;

          const dx = p.x - mouse.sx;
          const dy = p.y - mouse.sy;
          const dist = Math.hypot(dx, dy);
          const reach = Math.max(175, mouse.vs);
          if (dist < reach) {
            const s = 1 - dist / reach;
            const f = Math.cos(dist * 0.001) * s;
            p.cursor.vx += Math.cos(mouse.a) * f * reach * mouse.vs * 0.00065;
            p.cursor.vy += Math.sin(mouse.a) * f * reach * mouse.vs * 0.00065;
          }

          p.cursor.vx += (0 - p.cursor.x) * spring;
          p.cursor.vy += (0 - p.cursor.y) * spring;
          p.cursor.vx *= drag;
          p.cursor.vy *= drag;
          p.cursor.x += p.cursor.vx * 2;
          p.cursor.y += p.cursor.vy * 2;
          p.cursor.x = Math.min(limit, Math.max(-limit, p.cursor.x));
          p.cursor.y = Math.min(limit, Math.max(-limit, p.cursor.y));
        }
      }
    };

    const moved = (point: WavePoint, withCursor = true) => {
      const x = point.x + point.wave.x + (withCursor ? point.cursor.x : 0);
      const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0);
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    };

    const drawLines = () => {
      const { width, height } = boundingRef.current;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = configRef.current.lineColor;
      ctx.lineWidth = 1;
      for (const points of linesRef.current) {
        if (points.length === 0) continue;
        let p1 = moved(points[0], false);
        ctx.moveTo(p1.x, p1.y);
        for (let idx = 0; idx < points.length; idx++) {
          const isLast = idx === points.length - 1;
          p1 = moved(points[idx], !isLast);
          const nextPoint = points[idx + 1] ?? points[points.length - 1];
          const p2 = moved(nextPoint, !isLast);
          ctx.lineTo(p1.x, p1.y);
          if (isLast) ctx.moveTo(p2.x, p2.y);
        }
      }
      ctx.stroke();
    };

    let visible = false;
    let lastTime = 0;
    let elapsed = 0;

    const tick = (t: number) => {
      if (!visible) {
        frameIdRef.current = null;
        lastTime = 0;
        return;
      }

      const rect = container.getBoundingClientRect();
      boundingRef.current.left = rect.left;
      boundingRef.current.top = rect.top;

      const mouse = mouseRef.current;
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);
      container.style.setProperty("--x", `${mouse.sx}px`);
      container.style.setProperty("--y", `${mouse.sy}px`);

      if (lastTime === 0) lastTime = t;
      elapsed += Math.min(32, t - lastTime);
      lastTime = t;

      movePoints(elapsed);
      drawLines();
      frameIdRef.current = requestAnimationFrame(tick);
    };

    const onResize = () => {
      setSize();
      setLines();
    };

    const updateMouse = (x: number, y: number) => {
      const mouse = mouseRef.current;
      const b = boundingRef.current;
      mouse.x = x - b.left;
      mouse.y = y - b.top;
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      updateMouse(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updateMouse(touch.clientX, touch.clientY);
    };

    setSize();
    setLines();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible && frameIdRef.current == null) {
        frameIdRef.current = requestAnimationFrame(tick);
      }
    });
    observer.observe(container);

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      if (frameIdRef.current != null) cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`waves ${className}`.trim()}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor,
        ...style,
      }}
    >
      <canvas ref={canvasRef} className="waves-canvas" />
    </div>
  );
};

export default Waves;
