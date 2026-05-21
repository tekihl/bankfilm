import Link from "next/link";

type Film = {
  description?: string;
  _id: string;
  filmType?: string;
  honorsOther?: string[];
  imageUrl?: string;
  status?: string;
  team?: Array<string | { name?: string; role?: string }>;
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
      honorsOther?: string[];
      imageUrl?: string;
      status?: string;
      team?: Array<string | { name?: string; role?: string }>;
      title: string;
    } =>
      Boolean(film.title),
  );

  if (visibleFilms.length === 0) {
    return null;
  }

  return (
    <div className="film-list-wrapper">
      <h2 className="films-title"> Filmer </h2>
      <ul className="films-list">
        {visibleFilms.map((film) => {
          const imageUrl = film.imageUrl;
          const href = `/films/${encodeURIComponent(film._id)}`;

          return (
            <li key={film._id} className="films-list__item">
              <Link className="films-list__link" href={href}>
                {imageUrl ? (
                  <div className="films-list__image-frame">
                    <img className="films-list__image" src={imageUrl} alt={film.title} />
                  </div>
                ) : null}
                <span className="films-list__title">{film.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
