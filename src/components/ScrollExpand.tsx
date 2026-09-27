'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useRef } from 'react';
import './ScrollExpand.css';

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

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

  /* Custom MacBook Pro expansion mode */
  macbook?: boolean;
  macbookImageSrc?: string;
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
  macbookImageSrc = '/images/macbook-frame-hires.png',
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
        const r = c.startRadius * (1 - e);

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

  useEffect(() => {
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

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const stageW = root.clientWidth || window.innerWidth;
      stage.style.setProperty('--se-title-size', `${clamp(stageW * 0.075, 20, 84)}px`);

      if (c.macbook) {
        // High-res MacBook Pro 686x444 frame geometry
        // Aspect ratio: 686 / 444 = 1.545
        // Screen hole in image:
        // left: 90/686 (13.12%), width: 488/686 (71.14%)
        // top: 16/444 (3.60%), height: 301/444 (67.79%)
        const maxLaptopW = Math.min(stageW * 0.88, 1060);
        const maxLaptopH = stageH * 0.72;
        let laptopW = maxLaptopW;
        let laptopH = laptopW / 1.545;

        if (laptopH > maxLaptopH) {
          laptopH = maxLaptopH;
          laptopW = laptopH * 1.545;
        }

        const screenW = laptopW * 0.730;
        const screenH = laptopH * 0.686;

        // Screen center offset relative to laptop center
        const screenCenterX = laptopW * 0.489;
        const screenCenterY = laptopH * 0.375;
        const offsetX = screenCenterX - laptopW * 0.5;
        const offsetY = screenCenterY - laptopH * 0.5;

        macbookMetricsRef.current = {
          stageW,
          stageH,
          laptopW,
          laptopH,
          screenW,
          screenH,
          offsetX,
          offsetY,
        };

        if (macbookRef.current) {
          macbookRef.current.style.width = `${laptopW}px`;
          macbookRef.current.style.height = `${laptopH}px`;
        }
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
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
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
          {/* MacBook Pro frame mockup */}
          {macbook ? (
            <div ref={macbookRef} className="scroll-expand__macbook" aria-hidden="true">
              <img
                src={macbookImageSrc}
                alt=""
                className="scroll-expand__macbook-img"
                draggable={false}
              />
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
