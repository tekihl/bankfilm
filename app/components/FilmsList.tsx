"use client";

import { useState } from "react";

import { FilmImageWindow } from "./FilmImageWindow";

type Film = {
  _id: string;
  filmType?: string;
  imageUrl?: string;
  team?: string[];
  title?: string;
};

type FilmsListProps = {
  films: Film[];
};

type OpenFilmWindow = {
  id: number;
  imageUrl: string;
  title: string;
  x: number;
  y: number;
  zIndex: number;
};

const WINDOW_OFFSET_X = 28;
const WINDOW_OFFSET_Y = 24;
const WINDOW_START_X = 24;
const WINDOW_START_Y = 120;

export function FilmsList({ films }: FilmsListProps) {
  const [openWindows, setOpenWindows] = useState<OpenFilmWindow[]>([]);

  const visibleFilms = films.filter(
    (film): film is { _id: string; filmType?: string; imageUrl?: string; team?: string[]; title: string } =>
      Boolean(film.title),
  );

  const openFilmWindow = (film: { imageUrl: string; title: string }) => {
    setOpenWindows((currentWindows) => {
      const highestZIndex = currentWindows.reduce(
        (maxZIndex, openWindow) => Math.max(maxZIndex, openWindow.zIndex),
        0,
      );

      return [
        ...currentWindows,
        {
          id: Date.now() + currentWindows.length,
          imageUrl: film.imageUrl,
          title: film.title,
          x: WINDOW_START_X + currentWindows.length * WINDOW_OFFSET_X,
          y: WINDOW_START_Y + currentWindows.length * WINDOW_OFFSET_Y,
          zIndex: highestZIndex + 1,
        },
      ];
    });
  };

  const closeFilmWindow = (id: number) => {
    setOpenWindows((currentWindows) => currentWindows.filter((openWindow) => openWindow.id !== id));
  };

  const bringFilmWindowToFront = (id: number) => {
    setOpenWindows((currentWindows) => {
      const highestZIndex = currentWindows.reduce(
        (maxZIndex, openWindow) => Math.max(maxZIndex, openWindow.zIndex),
        0,
      );

      return currentWindows.map((openWindow) =>
        openWindow.id === id ? { ...openWindow, zIndex: highestZIndex + 1 } : openWindow,
      );
    });
  };

  const moveFilmWindow = (id: number, x: number, y: number) => {
    setOpenWindows((currentWindows) =>
      currentWindows.map((openWindow) => (openWindow.id === id ? { ...openWindow, x, y } : openWindow)),
    );
  };

  if (visibleFilms.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="films-title"> Filmer </h2>
      <ul className="films-list">
        {visibleFilms.map((film) => (
          <li key={film._id} className="films-list__item">
            <span className="films-list__title">{film.title}</span>
            {film.filmType ? <span className="films-list__type"> {film.filmType}</span> : null}
            {film.team && film.team.length > 0 ? (
              <span className="films-list__team"> {film.team.join(" / ")}</span>
            ) : null}
            {film.imageUrl ? (
              <button
                type="button"
                className="films-list__image-link"
                onClick={() => openFilmWindow({ imageUrl: film.imageUrl, title: film.title })}
              >
                {" "}
                [se bild]
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      {openWindows.map((openWindow) => (
        <FilmImageWindow
          key={openWindow.id}
          openWindow={openWindow}
          onBringToFront={() => bringFilmWindowToFront(openWindow.id)}
          onClose={() => closeFilmWindow(openWindow.id)}
          onMove={(x, y) => moveFilmWindow(openWindow.id, x, y)}
        />
      ))}
    </>
  );
}
