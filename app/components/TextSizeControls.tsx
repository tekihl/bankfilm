"use client";

import { useEffect, useState } from "react";

import { LogoAnimation } from "./LogoAnimation";

const DEFAULT_FONT_SIZE_PT = 16;
const MIN_FONT_SIZE_PT = 12;
const MAX_FONT_SIZE_PT = 96;
const FONT_SIZE_STEP_PT = 1;
const LINE_HEIGHT_OFFSET_PT = 5;
const LOGO_WIDTH_PX = 150;
const PAGE_PADDING_PX = 48;
const LOGO_GAP_PX = 24;

type TextSizeControlsProps = {
  description: string;
  frames: string[];
  title: string;
};

export function TextSizeControls({ description, frames, title }: TextSizeControlsProps) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE_PT);
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const textWidth = Math.min(1200, Math.max(420, 420 + (fontSize - DEFAULT_FONT_SIZE_PT) * 10));
  const shouldWrapLogo =
    viewportWidth !== null &&
    viewportWidth < textWidth + LOGO_WIDTH_PX + LOGO_GAP_PX + PAGE_PADDING_PX;

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  return (
    <div className="text-size-controls">
      <div
        className={`text-size-controls__content${shouldWrapLogo ? " text-size-controls__content--wrapped" : ""}`}
      >
        <div
          className={`text-wrapper${shouldWrapLogo ? " text-wrapper--wrapped" : ""}`}
          style={{
            fontSize: `${fontSize}pt`,
            lineHeight: `${fontSize + LINE_HEIGHT_OFFSET_PT}pt`,
            width: `${textWidth}px`,
          }}
        >
          {shouldWrapLogo ? (
            <div className="text-wrapper__logo text-wrapper__logo--wrapped">
              <LogoAnimation frames={frames} />
            </div>
          ) : null}
          <h1 className="title">{title}</h1>
          <p>{description}</p>
        </div>
        {!shouldWrapLogo ? (
          <div className="text-size-controls__logo">
            <LogoAnimation frames={frames} />
          </div>
        ) : null}
      </div>
      <label className="text-size-controls__slider" htmlFor="font-size-slider">
        <span className="text-size-controls__label"> {fontSize}pt</span>
        <input
          id="font-size-slider"
          className="text-size-controls__range"
          type="range"
          min={MIN_FONT_SIZE_PT}
          max={MAX_FONT_SIZE_PT}
          step={FONT_SIZE_STEP_PT}
          value={fontSize}
          onChange={(event) => setFontSize(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
