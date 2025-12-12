import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shizukani-cp.github.io"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [
      "https://shizukani-cp.github.io/blog/shizukani_title.png",
    ],
  },
  alternates: {
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  other: {
    "charset": "UTF-8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <header className="flex w-full items-center justify-between px-4 py-3 border-b">
          <a href="/blog/">
            <img
              src="/blog/shizukani_title.png"
              alt="タイトル画像"
              className="title-image"
            />
          </a>
          <div className="flex items-center gap-6">
            <nav>
              <ul>
                <li>
                  <a href="/blog/">ホーム</a>
                </li>
                <li>
                  <a href="/blog/articles/20240803">自己紹介</a>
                </li>
                <li>
                  <a href="https://shizukani-cp.github.io/basestyle.css/">
                    basestyle.css
                  </a>
                </li>
                <li>
                  <a href="https://shizukani-cp.github.io/htmlapps/">
                    色々ボックス
                  </a>
                </li>
              </ul>
            </nav>
            <span className="hidden text-xs text-gray-400 md:block">&copy; 2024 shizukani-cp</span>
          </div>
        </header>
        <main>
          {children}
        </main>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RHCWBF26WV"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RHCWBF26WV');
          `}
        </Script>
      </body>
    </html>
  );
}
