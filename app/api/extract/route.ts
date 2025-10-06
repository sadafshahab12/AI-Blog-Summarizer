import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export async function POST(request: Request) {
  const { url } = await request.json();
  if (!url) return new Response("Missing url", { status: 400 });

  //fetch html server side
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) return new Response("Failed to fetch URL", { status: 502 });
  const html = await res.text();
  // parse and extract with Readability

  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article)
    return new Response("Could not extract article", { status: 422 });
  return new Response(
    JSON.stringify({
      title: article.title,
      excerpt: article.excerpt,
      text: article.textContent?.slice(0, 10000),
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
