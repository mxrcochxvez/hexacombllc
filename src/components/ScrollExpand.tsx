'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import './ScrollExpand.css';

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

type DeviceKind = 'laptop' | 'phone';

type DeviceSpec = {
  kind: DeviceKind;
  aspect: number;
  maxW: number;
  maxH: number;
  cap: number;
  lid: { x: number; y: number; w: number; h: number };
  pad: number;
  radius: number;
};

const LAPTOP: DeviceSpec = {
  kind: 'laptop',
  aspect: 1.42,
  maxW: 0.84,
  maxH: 0.68,
  cap: 1120,
  lid: { x: 0.02, y: 0.02, w: 0.96, h: 0.78 },
  pad: 0.011,
  radius: 0.023,
};

const PHONE: DeviceSpec = {
  kind: 'phone',
  aspect: 0.482,
  maxW: 0.7,
  maxH: 0.7,
  cap: 380,
  lid: { x: 0, y: 0, w: 1, h: 1 },
  pad: 0.034,
  radius: 0.155,
};

const PHONE_QUERY = '(max-width: 760px)';

function deviceBox(spec: DeviceSpec, stageW: number, stageH: number) {
  let width = Math.min(stageW * spec.maxW, spec.cap);
  let height = width / spec.aspect;
  const maxHeight = stageH * spec.maxH;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * spec.aspect;
  }

  const pad = width * spec.pad;
  const lidX = width * spec.lid.x;
  const lidY = height * spec.lid.y;
  const lidW = width * spec.lid.w;
  const lidH = height * spec.lid.h;
  const screenW = lidW - pad * 2;
  const screenH = lidH - pad * 2;
  const screenX = lidX + pad;
  const screenY = lidY + pad;

  return {
    width,
    height,
    pad,
    lidX,
    lidY,
    lidW,
    lidH,
    screenW,
    screenH,
    offsetX: screenX + screenW / 2 - width / 2,
    offsetY: screenY + screenH / 2 - height / 2,
    radius: Math.max(4, width * spec.radius - pad),
    lidRadius: width * spec.radius,
  };
}

export interface ScrollExpandProps {
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  /* Device chassis: CSS laptop, or a CSS phone under 760px */
  macbook?: boolean;
  frameContent?: React.ReactNode;
}

const ScrollExpand: React.FC<ScrollExpandProps> = ({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  macbook = false,
  frameContent,
  ...rest
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const macbookRef = useRef<HTMLDivElement>(null);

  // Cached layout measurements for MacBook Pro alignment
  const macbookMetricsRef = useRef({
    stageW: 0,
    stageH: 0,
    laptopW: 0,
    laptopH: 0,
    screenW: 0,
    screenH: 0,
    offsetX: 0,
    offsetY: 0,
    radius: 10,
  });

  const propsRef = useRef({
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
    macbook,
  });

  useEffect(() => {
    propsRef.current = {
      startWidth,
      startHeight,
      startRadius,
      endRadius,
      mediaZoom,
      scrollDistance,
      holdDistance,
      smoothing,
      overlayScrim,
      useWindowScroll,
      enabled,
      macbook,
    };
  }, [
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
    macbook,
  ]);

  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const c = propsRef.current;
    const e = smoothstep(0, 1, p);

    if (c.macbook) {
      const m = macbookMetricsRef.current;
      if (m.stageW > 0 && m.stageH > 0) {
        // Expand from MacBook screen coordinates to 100% full screen
        const curW = m.screenW + (m.stageW - m.screenW) * e;
        const curH = m.screenH + (m.stageH - m.screenH) * e;
        const curOffsetX = m.offsetX * (1 - e);
        const curOffsetY = m.offsetY * (1 - e);
        const r = m.radius * (1 - e);

        frame.style.width = `${curW}px`;
        frame.style.height = `${curH}px`;
        frame.style.borderRadius = `${r}px`;
        frame.style.transform = `translate(calc(-50% + ${curOffsetX}px), calc(-50% + ${curOffsetY}px))`;
      }

      // Fade out and scale up the MacBook laptop chassis cleanly
      if (macbookRef.current) {
        const chassisFade = smoothstep(0.01, 0.26, p);
        const chassisScale = 1 + 0.12 * smoothstep(0, 0.35, p);
        macbookRef.current.style.opacity = `${1 - chassisFade}`;
        macbookRef.current.style.transform = `translate(-50%, -50%) scale(${chassisScale})`;
      }
    } else {
      // Standard clip-path mode
      const w = c.startWidth + (100 - c.startWidth) * e;
      const h = c.startHeight + (100 - c.startHeight) * e;
      const ix = Math.max(0, (100 - w) / 2);
      const iy = Math.max(0, (100 - h) / 2);
      const r = c.startRadius + (c.endRadius - c.startRadius) * e;
      frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;
    }

    if (mediaRef.current) {
      mediaRef.current.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;
    }

    if (scrimRef.current) {
      scrimRef.current.style.opacity = `${c.overlayScrim * e}`;
    }

    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.15, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${10 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
    }
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;
    let measureTries = 0;

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) {
        if (measureTries++ < 40) requestAnimationFrame(measure);
        return;
      }
      measureTries = 0;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const stageW = root.clientWidth || window.innerWidth;
      stage.style.setProperty('--se-title-size', `${clamp(stageW * 0.075, 20, 84)}px`);

      if (c.macbook) {
        const spec = window.matchMedia(PHONE_QUERY).matches ? PHONE : LAPTOP;
        const box = deviceBox(spec, stageW, stageH);
        macbookMetricsRef.current = {
          stageW,
          stageH,
          laptopW: box.width,
          laptopH: box.height,
          screenW: box.screenW,
          screenH: box.screenH,
          offsetX: box.offsetX,
          offsetY: box.offsetY,
          radius: box.radius,
        };

        const chassis = macbookRef.current;
        if (chassis) {
          chassis.dataset.device = spec.kind;
          chassis.style.width = `${box.width}px`;
          chassis.style.height = `${box.height}px`;
          chassis.style.setProperty('--lid-x', `${box.lidX}px`);
          chassis.style.setProperty('--lid-y', `${box.lidY}px`);
          chassis.style.setProperty('--lid-w', `${box.lidW}px`);
          chassis.style.setProperty('--lid-h', `${box.lidH}px`);
          chassis.style.setProperty('--lid-pad', `${box.pad}px`);
          chassis.style.setProperty('--lid-r', `${box.lidRadius}px`);
          chassis.style.setProperty('--hole-x', `${box.lidX + box.pad}px`);
          chassis.style.setProperty('--hole-y', `${box.lidY + box.pad}px`);
          chassis.style.setProperty('--hole-w', `${box.screenW}px`);
          chassis.style.setProperty('--hole-h', `${box.screenH}px`);
        }
        frameRef.current?.classList.toggle('scroll-expand__frame--phone', spec.kind === 'phone');
      }
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    const phoneQuery = window.matchMedia(PHONE_QUERY);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    phoneQuery.addEventListener('change', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      phoneQuery.removeEventListener('change', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  const media = src ? (
    mediaType === 'video' ? (
      <video
        ref={mediaRef as React.RefObject<HTMLVideoElement>}
        className="scroll-expand__media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img
        ref={mediaRef as React.RefObject<HTMLImageElement>}
        className="scroll-expand__media"
        src={src}
        alt={alt}
        draggable={false}
      />
    )
  ) : null;

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          {macbook ? (
            <div ref={macbookRef} className="scroll-expand__device" data-device="laptop" aria-hidden="true">
              <div className="scroll-expand__device-lid" />
              <div className="scroll-expand__device-neck" />
              <div className="scroll-expand__device-foot" />
              <div className="scroll-expand__device-camera" />
              <div className="scroll-expand__device-island" />
              <div className="scroll-expand__device-btn scroll-expand__device-btn--vol" />
              <div className="scroll-expand__device-btn scroll-expand__device-btn--power" />
            </div>
          ) : null}

          {/* Expanding Screen Frame */}
          <div
            ref={frameRef}
            className={`scroll-expand__frame ${macbook ? 'scroll-expand__frame--macbook' : ''}`}
          >
            {media}
            {frameContent}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>

          {/* Optional Title held over frame */}
          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}

          {/* Scroll Cue Hint */}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              <span>{scrollHint}</span>
              <span className="scroll-expand__hint-arrow" aria-hidden="true">
                ↓
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
