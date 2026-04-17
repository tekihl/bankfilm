import { Header } from "../components/Header";
import { client } from "../../sanity/lib/client";
import { ABOUT_QUERY, PEOPLE_QUERY } from "../../sanity/lib/queries";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await client.fetch<{ title?: string; address?: string; description?: string; email?: string } | null>(
    ABOUT_QUERY,
  );
  const people = await client.fetch<Array<{ _id: string; name?: string }> | null>(PEOPLE_QUERY);
  const peopleNames = people
    ?.map((person) => person.name)
    .filter((name): name is string => Boolean(name))
    .join(", ");
  const descriptionText = about?.description?.trimEnd() ?? "";

  return (
    <div className="page-shell page-shell--meta">
      <div className="home__meta">
        <Header title={about?.title ?? "Bankfilm"} address={about?.address} />
      </div>
      {descriptionText ? (
        <div className="about-page__content">
          <div className="about-page__textbox">
            <p className="about-page__paragraph">
              {descriptionText}
              {peopleNames ? ` ${peopleNames}` : ""}
            </p>
            {about?.email ? (
              <p className="about-page__paragraph">inquiries: {about.email}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
