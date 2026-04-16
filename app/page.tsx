import { readdir } from "node:fs/promises";
import path from "node:path";

import { FilmsList } from "./components/FilmsList";
import { TextSizeControls } from "./components/TextSizeControls";
import { client } from "../sanity/lib/client";
import { ABOUT_QUERY, FILMS_QUERY, PEOPLE_QUERY } from "../sanity/lib/queries";

async function getLogoFrames() {
  const framesDirectory = path.join(process.cwd(), "public", "megaoptimised");
  const entries = await readdir(framesDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && /^BANK\d{3}-2x\.jpg$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }))
    .map((fileName) => `/megaoptimised/${fileName}`);
}

export default async function Home() {
  const frames = await getLogoFrames();
  const about = await client.fetch<{ title?: string; description?: string } | null>(ABOUT_QUERY);
  const people = await client.fetch<
    Array<{
      _id: string;
      description?: string;
      email?: string;
      imageUrl?: string;
      links?: Array<{ label?: string; url?: string }>;
      name?: string;
    }> | null
  >(PEOPLE_QUERY);
  const films = await client.fetch<
    Array<{ _id: string; title?: string; filmType?: string; team?: string[]; imageUrl?: string }> | null
  >(FILMS_QUERY);

  return (
    <div className="home">
      <div className="home__meta">
        <TextSizeControls
          people={
            people?.filter(
              (
                person,
              ): person is {
                _id: string;
                description?: string;
                email?: string;
                imageUrl?: string;
                links?: Array<{ label?: string; url?: string }>;
                name: string;
              } =>
                Boolean(person.name),
            ) ?? []
          }
          frames={frames}
          title={about?.title ?? "Bankfilm"}
          description={about?.description ?? ""}
        />
        <FilmsList films={films ?? []} />
      </div>
    </div>
  );
}
