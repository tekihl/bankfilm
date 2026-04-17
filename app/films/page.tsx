import { FilmsList } from "../components/FilmsList";
import { Header } from "../components/Header";
import { client } from "../../sanity/lib/client";
import { ABOUT_QUERY, FILMS_QUERY } from "../../sanity/lib/queries";

export const dynamic = "force-dynamic";

export default async function FilmsPage() {
  const about = await client.fetch<{ title?: string; address?: string; description?: string } | null>(ABOUT_QUERY);
  const films = await client.fetch<
    Array<{
      _id: string;
      title?: string;
      filmType?: string;
      description?: string;
      status?: string;
      team?: string[];
      imageUrl?: string;
    }> | null
  >(FILMS_QUERY);

  return (
    <div className="page-shell">
      <div className="page-intro">
        <Header title={about?.title ?? "Bankfilm"} address={about?.address} />
      </div>
      <FilmsList films={films ?? []} />
    </div>
  );
}
