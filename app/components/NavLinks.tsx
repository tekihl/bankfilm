import Link from "next/link";

export function NavLinks() {
  return (
    <nav aria-label="Primary">
      <ul className="site-nav">
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/films">Films</Link>
        </li>
      </ul>
    </nav>
  );
}
