import { readdir } from "node:fs/promises";
import path from "node:path";

import { TextSizeControls } from "./components/TextSizeControls";
import { client } from "../sanity/lib/client";
import { ABOUT_QUERY } from "../sanity/lib/queries";

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

  return (
    <div className="home">
      <div className="home__meta">
        <TextSizeControls
          frames={frames}
          title={about?.title ?? "Bankfilm"}
          description={about?.description ?? ""}
        />
      </div>
    </div>
  );
}
