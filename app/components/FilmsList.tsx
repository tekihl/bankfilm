type Film = {
  description?: string;
  _id: string;
  filmType?: string;
  imageUrl?: string;
  status?: string;
  team?: string[];
  title?: string;
};

type FilmsListProps = {
  films: Film[];
};

export function FilmsList({ films }: FilmsListProps) {
  const visibleFilms = films.filter(
    (
      film,
    ): film is {
      _id: string;
      description?: string;
      filmType?: string;
      imageUrl?: string;
      status?: string;
      team?: string[];
      title: string;
    } =>
      Boolean(film.title),
  );

  if (visibleFilms.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="films-title"> Filmer </h2>
      <ul className="films-list">
        {visibleFilms.map((film) => {
          const imageUrl = film.imageUrl;
          const infoParts = [film.description, film.team?.join(" / ")].filter(Boolean);

          return (
            <li key={film._id} className="films-list__item">
              {imageUrl ? (
                <div className="films-list__image-frame">
                  <img className="films-list__image" src={imageUrl} alt={film.title} />
                </div>
              ) : null}
              <div className="films-list__text">
                <div className="films-list__headline">
                  <span className="films-list__title">{film.title}</span>
                  {film.filmType ? <span className="films-list__type">{film.filmType}</span> : null}
                </div>
                {film.status ? <div className="films-list__status-badge">{film.status}</div> : null}
                {infoParts.length > 0 ? <p className="films-list__meta">{infoParts.join(" / ")}</p> : null}
                
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
