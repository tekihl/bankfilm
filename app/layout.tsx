import "./globals.css";
import "./styles/film-modal.css";
import "./styles/films.css";
import "./styles/layout.css";
import "./styles/logo-animation.css";
import "./styles/people-modal.css";

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
      <body className="app-body">{children}</body>
    </html>
  );
}
