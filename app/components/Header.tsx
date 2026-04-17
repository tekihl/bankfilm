import Link from "next/link";
import { NavLinks } from "./NavLinks";

type HeaderProps = {
  address?: string;
  title: string;
};

export function Header({ address, title }: HeaderProps) {
  return (
    <div className="header">
      <h1 className="header__title">
        <Link href="/" className="header__title-link">
          {title}
        </Link>
      </h1>
      {address ? <p className="header__address">{address}</p> : null}
      <NavLinks />
    </div>
  );
}
