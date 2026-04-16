"use client";

import { useEffect, useRef, useState } from "react";

type PersonWindow = {
  description?: string;
  email?: string;
  imageUrl?: string;
  links?: Array<{
    label?: string;
    url?: string;
  }>;
  name: string;
  x: number;
  y: number;
  zIndex: number;
};

type PersonInfoWindowProps = {
  openWindow: PersonWindow;
  onBringToFront: () => void;
  onClose: () => void;
  onMove: (x: number, y: number) => void;
};

export function PersonInfoWindow({
  openWindow,
  onBringToFront,
  onClose,
  onMove,
}: PersonInfoWindowProps) {
  const [showCopied, setShowCopied] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement | null>(null);

  const clampPosition = (x: number, y: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = windowRef.current?.offsetWidth ?? 0;
    const windowHeight = windowRef.current?.offsetHeight ?? 0;
    const maxX = Math.max(8, viewportWidth - windowWidth - 8);
    const maxY = Math.max(8, viewportHeight - windowHeight - 8);

    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(8, y), maxY),
    };
  };

  useEffect(() => {
    const keepWindowInView = () => {
      const nextPosition = clampPosition(openWindow.x, openWindow.y);

      if (nextPosition.x !== openWindow.x || nextPosition.y !== openWindow.y) {
        onMove(nextPosition.x, nextPosition.y);
      }
    };

    keepWindowInView();
    window.addEventListener("resize", keepWindowInView);

    return () => window.removeEventListener("resize", keepWindowInView);
  }, [onMove, openWindow.x, openWindow.y]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onBringToFront();
    dragOffsetRef.current = {
      x: event.clientX - openWindow.x,
      y: event.clientY - openWindow.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextPosition = clampPosition(
        moveEvent.clientX - dragOffsetRef.current.x,
        moveEvent.clientY - dragOffsetRef.current.y,
      );

      onMove(nextPosition.x, nextPosition.y);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleCopyEmail = async () => {
    if (!openWindow.email) {
      return;
    }

    await navigator.clipboard.writeText(openWindow.email);
    setShowCopied(true);
    window.setTimeout(() => setShowCopied(false), 1500);
  };

  return (
    <div
      ref={windowRef}
      className="person-info-window"
      style={{ left: `${openWindow.x}px`, top: `${openWindow.y}px`, zIndex: openWindow.zIndex }}
      onMouseDown={onBringToFront}
    >
      <div className="person-info-window__header" onPointerDown={handlePointerDown}>
        <span className="person-info-window__title">{openWindow.name}</span>
        <button type="button" className="person-info-window__close" onClick={onClose}>
          close
        </button>
      </div>
      <div className="person-info-window__body">
        <div className="person-info-window__top">
          {openWindow.imageUrl ? (
            <img className="person-info-window__image" src={openWindow.imageUrl} alt={openWindow.name} />
          ) : null}
          <div className="person-info-window__text">
            {openWindow.description ? (
              <p className="person-info-window__description">{openWindow.description}</p>
            ) : null}
            {openWindow.links && openWindow.links.length > 0 ? (
              <ul className="person-info-window__links">
                {openWindow.links
                  .filter((link): link is { label: string; url: string } => Boolean(link.label && link.url))
                  .map((link) => (
                    <li key={`${link.label}-${link.url}`} className="person-info-window__links-item">
                      <a
                        className="person-info-window__link"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        </div>
        {openWindow.email ? (
          <span className="person-info-window__email-row">
            <button type="button" className="person-info-window__email" onClick={handleCopyEmail}>
              {openWindow.email}
            </button>
            {showCopied ? <span className="person-info-window__copied">(copied to clipboard!)</span> : null}
          </span>
        ) : null}
      </div>
    </div>
  );
}
