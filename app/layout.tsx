import type { Metadata } from "next";

import "./globals.css";
import "./styles/films.css";
import "./styles/layout.css";
import "./styles/logo-animation.css";

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: "/bankfilm-asterix.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/bankfilm-asterix.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="app-html"
    >
      <body className="app-body">
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
