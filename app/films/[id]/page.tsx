import { notFound } from "next/navigation";
import { Header } from "../../components/Header";
import { client } from "../../../sanity/lib/client";
import { ABOUT_QUERY, FILM_QUERY } from "../../../sanity/lib/queries";

export const dynamic = "force-dynamic";

type Film = {
  _id: string;
  description?: string;
  filmType?: string;
  honorsOther?: string[];
  imageUrl?: string;
  linkTitle?: string;
  linkUrl?: string;
  productionText?: PortableTextBlock[];
  status?: string;
  team?: Array<string | { name?: string; role?: string }>;
  title?: string;
};

type PortableTextSpan = {
  _key?: string;
  _type: "span";
  marks?: string[];
  text?: string;
};

type PortableTextBlock = {
  _key?: string;
  _type: "block";
  children?: PortableTextSpan[];
};

type TeamLine =
  | {
      kind: "legacy";
      text: string;
    }
  | {
      kind: "group";
      role?: string;
      names: string[];
    };

function renderProductionText(blocks: PortableTextBlock[]) {
  return blocks.map((block, blockIndex) => (
    <p key={block._key ?? blockIndex} className="film-detail__line">
      {block.children?.map((child, childIndex) => {
        const text = child.text ?? "";
        const key = child._key ?? `${block._key ?? blockIndex}-${childIndex}`;

        if (child.marks?.includes("strong")) {
          return <strong key={key}>{text}</strong>;
        }

        return <span key={key}>{text}</span>;
      })}
    </p>
  ));
}

export default async function FilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [about, film] = await Promise.all([
    client.fetch<{ title?: string; address?: string } | null>(ABOUT_QUERY),
    client.fetch<Film | null>(FILM_QUERY, { id: decodeURIComponent(id) }),
  ]);

  if (!film?.title) {
    notFound();
  }

  const honorsOther = film.honorsOther?.filter(Boolean);
  const typeLine = [film.filmType, film.status ? `(${film.status})` : undefined].filter(Boolean).join(" ");
  const details = [
    typeLine,
    film.description,
  ].filter(Boolean);
  const team = film.team?.filter((member) => {
    if (typeof member === "string") {
      return Boolean(member);
    }

    return Boolean(member.name || member.role);
  });
  const teamLines =
    team?.reduce<TeamLine[]>((lines, member) => {
      if (typeof member === "string") {
        lines.push({ kind: "legacy", text: member });
        return lines;
      }

      const role = member.role?.trim();
      const name = member.name?.trim();
      const existingLine = lines.find(
        (line) => line.kind === "group" && (line.role ?? "") === (role ?? ""),
      );

      if (existingLine?.kind === "group") {
        if (name) {
          existingLine.names.push(name);
        }

        return lines;
      }

      lines.push({
        kind: "group",
        role,
        names: name ? [name] : [],
      });

      return lines;
    }, []) ?? [];

  return (
    <div className="page-shell">
      <div className="page-intro">
        <Header title={about?.title ?? "Bankfilm"} address={about?.address} />
      </div>

      <main className="film-detail">
        {film.imageUrl ? (
          <img className="film-detail__image" src={film.imageUrl} alt={film.title} />
        ) : null}

        <div className="film-detail__text">
          <h2 className="film-detail__title">{film.title}</h2>
          {details.map((detail) => (
            <p key={detail} className="film-detail__line">
              {detail}
            </p>
          ))}
          {teamLines.length ? (
            <ul className="film-detail__team">
              {teamLines.map((line, index) => {
                if (line.kind === "legacy") {
                  return (
                    <li key={`${line.text}-${index}`} className="film-detail__line">
                      {line.text}
                    </li>
                  );
                }

                return (
                  <li key={`${line.role ?? ""}-${index}`} className="film-detail__line">
                    {line.role}
                    {line.role && line.names.length ? " " : null}
                    {line.names.map((name, nameIndex) => {
                      const separator =
                        nameIndex === 0
                          ? ""
                          : nameIndex === line.names.length - 1
                            ? " and "
                            : ", ";

                      return (
                        <span key={`${name}-${nameIndex}`}>
                          {separator}
                          <strong>{name}</strong>
                        </span>
                      );
                    })}
                  </li>
                );
              })}
            </ul>
          ) : null}
          {film.productionText?.length ? renderProductionText(film.productionText) : null}
          {honorsOther?.length ? (
            <ul className="film-detail__honors">
              {honorsOther.map((honor, index) => (
                <li key={`${honor}-${index}`} className="film-detail__line">
                  {honor}
                </li>
              ))}
            </ul>
          ) : null}
          {film.linkUrl ? (
            <a className="film-detail__link" href={film.linkUrl}>
              {film.linkTitle ?? film.linkUrl}
            </a>
          ) : null}
        </div>
      </main>
    </div>
  );
}
