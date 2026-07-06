"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type TouchEvent,
} from "react";
import Image from "next/image";
import type { ApiProductImage } from "@/lib/types/product";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const SLIDE_COMMIT = 0.12;
const DRAG_CLICK_THRESHOLD = 8;

function ChevronIcon({
  direction,
  size = "md",
}: {
  direction: "left" | "right";
  size?: "sm" | "md";
}) {
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <svg
      aria-hidden
      className={cls}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {direction === "left" ? (
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" strokeLinecap="round" />
    </svg>
  );
}

function touchDistance(touches: { clientX: number; clientY: number }[]) {
  if (touches.length < 2) return 0;
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
}

function resistSlideOffset(offset: number, index: number, count: number) {
  if (index === 0 && offset > 0) return offset * 0.28;
  if (index === count - 1 && offset < 0) return offset * 0.28;
  return offset;
}

function commitSlide(delta: number, width: number) {
  return Math.abs(delta) > width * SLIDE_COMMIT;
}

interface ProductGalleryProps {
  images: ApiProductImage[];
  productName: string;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export function ProductGallery({
  images,
  productName,
  selectedIndex,
  onSelectIndex,
}: ProductGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ startX: number } | null>(null);
  const didDragRef = useRef(false);
  const multi = images.length > 1;

  const go = useCallback(
    (delta: number) => {
      onSelectIndex((selectedIndex + delta + images.length) % images.length);
      setDragX(0);
    },
    [images.length, onSelectIndex, selectedIndex]
  );

  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    didDragRef.current = false;
    pointerRef.current = { startX: e.clientX };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current) return;
    const raw = e.clientX - pointerRef.current.startX;
    if (Math.abs(raw) > DRAG_CLICK_THRESHOLD) didDragRef.current = true;
    if (multi) setDragX(resistSlideOffset(raw, selectedIndex, images.length));
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current) return;
    const width = viewportRef.current?.clientWidth ?? 320;
    const delta = e.clientX - pointerRef.current.startX;
    const dragged = didDragRef.current;
    pointerRef.current = null;
    setDragging(false);
    didDragRef.current = false;

    if (multi && commitSlide(delta, width)) {
      if (delta > 0 && selectedIndex > 0) go(-1);
      else if (delta < 0 && selectedIndex < images.length - 1) go(1);
      else setDragX(0);
      return;
    }

    if (multi) setDragX(0);

    if (!dragged) openLightbox();
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/5] bg-white">
        <div className="flex h-full items-center justify-center text-neutral-300">
          No image
        </div>
      </div>
    );
  }

  const trackTransform = `translateX(calc(-${selectedIndex * 100}% + ${dragX}px))`;

  return (
    <>
      <div>
        <div
          ref={viewportRef}
          className="group/gallery relative aspect-[4/5] overflow-hidden bg-white select-none"
        >
          <div
            className={`flex h-full ${
              dragging ? "cursor-grabbing" : "cursor-default"
            } ${
              dragging
                ? ""
                : "motion-reduce:transition-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            }`}
            style={{ transform: trackTransform }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {images.map((img, i) => (
              <div
                key={img.id}
                className="relative min-h-full min-w-full shrink-0"
                aria-hidden={i !== selectedIndex}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `${productName} ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="pointer-events-none object-contain p-8 md:p-12"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox();
            }}
            className="absolute top-4 right-4 z-10 cursor-pointer p-1.5 text-neutral-400 opacity-70 transition-opacity hover:text-neutral-900 hover:opacity-100"
            aria-label="View full screen"
          >
            <ExpandIcon />
          </button>

          {multi ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => selectedIndex > 0 && go(-1)}
                disabled={selectedIndex === 0}
                className="absolute top-1/2 left-3 z-10 -translate-y-1/2 cursor-pointer p-1 text-neutral-400 opacity-70 transition-opacity hover:text-neutral-900 hover:opacity-100 disabled:cursor-default disabled:opacity-20"
              >
                <ChevronIcon direction="left" size="sm" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() =>
                  selectedIndex < images.length - 1 && go(1)
                }
                disabled={selectedIndex === images.length - 1}
                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer p-1 text-neutral-400 opacity-70 transition-opacity hover:text-neutral-900 hover:opacity-100 disabled:cursor-default disabled:opacity-20"
              >
                <ChevronIcon direction="right" size="sm" />
              </button>
            </>
          ) : null}
        </div>

        {multi ? (
          <div className="mt-6 flex justify-center gap-2">
            {images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => onSelectIndex(index)}
                className={`relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 ${
                  selectedIndex === index ? "bg-neutral-100" : "bg-white"
                }`}
                aria-label={`Show image ${index + 1}`}
                aria-current={selectedIndex === index ? "true" : undefined}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `${productName} ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightboxOpen ? (
        <ProductImageLightbox
          images={images}
          productName={productName}
          index={selectedIndex}
          onIndexChange={onSelectIndex}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  );
}

function ProductImageLightbox({
  images,
  productName,
  index,
  onIndexChange,
  onClose,
}: {
  images: ApiProductImage[];
  productName: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);
  const pointerRef = useRef<{
    mode: "slide" | "pan";
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);

  const multi = images.length > 1;

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setDragX(0);
  }, []);

  const go = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + images.length) % images.length);
      resetView();
    },
    [images.length, index, onIndexChange, resetView]
  );

  useEffect(() => {
    resetView();
  }, [index, resetView]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && multi && zoom === 1) go(-1);
      if (e.key === "ArrowRight" && multi && zoom === 1) go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, multi, onClose, zoom]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) =>
        Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.0015))
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    pointerRef.current = {
      mode: zoom > 1 ? "pan" : "slide",
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const ptr = pointerRef.current;
    if (!ptr) return;

    if (ptr.mode === "slide" && zoom === 1) {
      const raw = e.clientX - ptr.startX;
      setDragX(resistSlideOffset(raw, index, images.length));
      return;
    }

    if (ptr.mode === "pan" && zoom > 1) {
      setPan({
        x: ptr.panX + (e.clientX - ptr.startX),
        y: ptr.panY + (e.clientY - ptr.startY),
      });
    }
  };

  const finishSlide = (delta: number) => {
    const width = viewportRef.current?.clientWidth ?? 320;
    setDragging(false);
    pointerRef.current = null;

    if (commitSlide(delta, width)) {
      if (delta > 0 && index > 0) go(-1);
      else if (delta < 0 && index < images.length - 1) go(1);
      else setDragX(0);
    } else {
      setDragX(0);
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const ptr = pointerRef.current;
    if (!ptr) return;

    if (ptr.mode === "slide" && zoom === 1 && multi) {
      finishSlide(e.clientX - ptr.startX);
      return;
    }

    pointerRef.current = null;
    setDragging(false);
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      pinchRef.current = {
        distance: touchDistance([e.touches[0], e.touches[1]]),
        zoom,
      };
      pointerRef.current = null;
      return;
    }
    if (e.touches.length === 1 && zoom === 1 && multi) {
      setDragging(true);
      pointerRef.current = {
        mode: "slide",
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const distance = touchDistance([e.touches[0], e.touches[1]]);
      if (distance <= 0) return;
      const next =
        pinchRef.current.zoom * (distance / pinchRef.current.distance);
      setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next)));
      return;
    }
    const ptr = pointerRef.current;
    if (ptr?.mode === "slide" && e.touches.length === 1 && zoom === 1) {
      const raw = e.touches[0].clientX - ptr.startX;
      setDragX(resistSlideOffset(raw, index, images.length));
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (pinchRef.current) {
      pinchRef.current = null;
      return;
    }
    const ptr = pointerRef.current;
    if (ptr?.mode === "slide" && zoom === 1 && multi) {
      const endX = e.changedTouches[0]?.clientX ?? ptr.startX;
      finishSlide(endX - ptr.startX);
    }
  };

  const trackTransform = `translateX(calc(-${index * 100}% + ${dragX}px))`;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} image viewer`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2 text-neutral-900 hover:opacity-60"
        aria-label="Close"
      >
        <CloseIcon />
      </button>

      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 select-none overflow-hidden"
      >
        {multi ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => index > 0 && go(-1)}
              disabled={index === 0}
              className="absolute top-1/2 left-3 z-20 -translate-y-1/2 p-1 text-neutral-400 opacity-70 hover:text-neutral-900 hover:opacity-100 disabled:opacity-20"
            >
              <ChevronIcon direction="left" size="sm" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => index < images.length - 1 && go(1)}
              disabled={index === images.length - 1}
              className="absolute top-1/2 right-3 z-20 -translate-y-1/2 p-1 text-neutral-400 opacity-70 hover:text-neutral-900 hover:opacity-100 disabled:opacity-20"
            >
              <ChevronIcon direction="right" size="sm" />
            </button>
          </>
        ) : null}

        <div
          className={`flex h-full touch-pan-y ${
            dragging
              ? ""
              : "motion-reduce:transition-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          } ${zoom === 1 && multi ? "cursor-grab active:cursor-grabbing" : zoom > 1 ? "cursor-move" : ""}`}
          style={{ transform: trackTransform }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {images.map((img, i) => (
            <div
              key={img.id}
              className="relative flex h-full min-w-full shrink-0 items-center justify-center"
            >
              <div
                className="relative h-full w-full motion-reduce:transition-none transition-transform duration-100 ease-out"
                style={
                  i === index
                    ? {
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      }
                    : undefined
                }
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? productName}
                  fill
                  sizes="100vw"
                  className="object-contain p-8 md:p-16"
                  priority={i === index}
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {multi ? (
        <div className="flex shrink-0 justify-center gap-2 px-6 py-8">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                onIndexChange(i);
                resetView();
              }}
              className={`relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 ${
                i === index ? "bg-neutral-100" : "bg-white"
              }`}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1.5"
                aria-hidden
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
