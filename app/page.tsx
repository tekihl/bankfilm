import { readdir } from "node:fs/promises";
import path from "node:path";

import { Header } from "./components/Header";
import { LogoAnimation } from "./components/LogoAnimation";
import { client } from "../sanity/lib/client";
import { ABOUT_QUERY } from "../sanity/lib/queries";

export const dynamic = "force-dynamic";

async function getLogoFrames() {
  const publicDirectory = path.join(process.cwd(), "public");
  const publicEntries = await readdir(publicDirectory, { withFileTypes: true });
  const framesFolder = publicEntries.find(
    (entry) => entry.isDirectory() && entry.name.normalize("NFC").toLowerCase() === "sköldar",
  )?.name;

  if (!framesFolder) {
    return [];
  }

  const framesDirectory = path.join(publicDirectory, framesFolder);
  const entries = await readdir(framesDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }))
    .map((fileName) => `/${encodeURIComponent(framesFolder)}/${encodeURIComponent(fileName)}`);
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
