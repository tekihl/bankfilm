"use client";

import { useEffect, useRef } from "react";

type OpenFilmWindow = {
  imageUrl: string;
  title: string;
  x: number;
  y: number;
  zIndex: number;
};

type FilmImageWindowProps = {
  openWindow: OpenFilmWindow;
  onBringToFront: () => void;
  onClose: () => void;
  onMove: (x: number, y: number) => void;
};

export function FilmImageWindow({
  openWindow,
  onBringToFront,
  onClose,
  onMove,
}: FilmImageWindowProps) {
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

  return (
    <div
      ref={windowRef}
      className="film-image-window"
      style={{ left: `${openWindow.x}px`, top: `${openWindow.y}px`, zIndex: openWindow.zIndex }}
      onMouseDown={onBringToFront}
    >
      <div className="film-image-window__header" onPointerDown={handlePointerDown}>
        <span className="film-image-window__title">{openWindow.title}</span>
        <div className="film-image-window__spacer">
          <div className="spacer-line"></div><div className="spacer-line"></div><div className="spacer-line"></div><div className="spacer-line"></div>
        </div>
        <button type="button" className="film-image-window__close" onClick={onClose}>
          {/* <div className="close-l line1"></div><div className="close-l line2"></div> */}
          close
        </button>
      </div>
      <img className="film-image-window__image" src={openWindow.imageUrl} alt={openWindow.title} />
    </div>
  );
}
