import { readdir } from "node:fs/promises";
import path from "node:path";

import { Header } from "./components/Header";
import { LogoAnimation } from "./components/LogoAnimation";
import { client } from "../sanity/lib/client";
import { ABOUT_QUERY } from "../sanity/lib/queries";

export const dynamic = "force-dynamic";

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
  const about = await client.fetch<{ title?: string; address?: string; description?: string } | null>(ABOUT_QUERY);

  return (
    <div className="home">
      <div className="home__meta">
        <Header title={about?.title ?? "Bankfilm"} address={about?.address} />
      </div>
      <div className="home__logo-stack">
        <LogoAnimation frames={frames} />
      </div>
    </div>
  );
}
