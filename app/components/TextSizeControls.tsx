"use client";

import { useEffect, useState } from "react";

import { LogoAnimation } from "./LogoAnimation";
import { PersonInfoWindow } from "./PersonInfoWindow";

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
  people: Array<{
    _id: string;
    description?: string;
    email?: string;
    imageUrl?: string;
    links?: Array<{
      label?: string;
      url?: string;
    }>;
    name: string;
  }>;
  title: string;
};

type OpenPersonWindow = {
  description?: string;
  email?: string;
  id: number;
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

const WINDOW_OFFSET_X = 28;
const WINDOW_OFFSET_Y = 24;
const WINDOW_START_X = 24;
const WINDOW_START_Y = 120;

export function TextSizeControls({ description, frames, people, title }: TextSizeControlsProps) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE_PT);
  const [openPeopleWindows, setOpenPeopleWindows] = useState<OpenPersonWindow[]>([]);
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

  const openPersonWindow = (person: {
    description?: string;
    email?: string;
    imageUrl?: string;
    links?: Array<{
      label?: string;
      url?: string;
    }>;
    name: string;
  }) => {
    setOpenPeopleWindows((currentWindows) => {
      const highestZIndex = currentWindows.reduce(
        (maxZIndex, openWindow) => Math.max(maxZIndex, openWindow.zIndex),
        0,
      );

      return [
        ...currentWindows,
        {
          description: person.description,
          email: person.email,
          id: Date.now() + currentWindows.length,
          imageUrl: person.imageUrl,
          links: person.links,
          name: person.name,
          x: WINDOW_START_X + currentWindows.length * WINDOW_OFFSET_X,
          y: WINDOW_START_Y + currentWindows.length * WINDOW_OFFSET_Y,
          zIndex: highestZIndex + 1,
        },
      ];
    });
  };

  const closePersonWindow = (id: number) => {
    setOpenPeopleWindows((currentWindows) => currentWindows.filter((openWindow) => openWindow.id !== id));
  };

  const bringPersonWindowToFront = (id: number) => {
    setOpenPeopleWindows((currentWindows) => {
      const highestZIndex = currentWindows.reduce(
        (maxZIndex, openWindow) => Math.max(maxZIndex, openWindow.zIndex),
        0,
      );

      return currentWindows.map((openWindow) =>
        openWindow.id === id ? { ...openWindow, zIndex: highestZIndex + 1 } : openWindow,
      );
    });
  };

  const movePersonWindow = (id: number, x: number, y: number) => {
    setOpenPeopleWindows((currentWindows) =>
      currentWindows.map((openWindow) => (openWindow.id === id ? { ...openWindow, x, y } : openWindow)),
    );
  };

  return (
    <>
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
            <p>
              {description}{" "}
              {people.length > 0 ? (
                <span className="people-inline">
                  {people.map((person, index) => (
                    <span key={person._id}>
                      <button
                        type="button"
                        className="people-inline__link"
                        onClick={() => openPersonWindow(person)}
                      >
                        {person.name}
                      </button>
                      {index < people.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              ) : null}
            </p>
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
      {openPeopleWindows.map((openWindow) => (
        <PersonInfoWindow
          key={openWindow.id}
          openWindow={openWindow}
          onBringToFront={() => bringPersonWindowToFront(openWindow.id)}
          onClose={() => closePersonWindow(openWindow.id)}
          onMove={(x, y) => movePersonWindow(openWindow.id, x, y)}
        />
      ))}
    </>
  );
}
