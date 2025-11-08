import Script from "next/script";

export default function ArticleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>{children}</div>
      <aside id="sidebar">
        <div id="index"></div>
        <Script
          src="https://utteranc.es/client.js"
          repo="shizukani-cp/blog"
          issue-term="title"
          theme="github-dark"
          crossorigin="anonymous"
          async
        >
        </Script>
      </aside>
    </>
  );
}
