import { GoogleGenAI } from "@google/genai";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  const { url } = await req.json();
  if (!url) return new Response("Missing url", { status: 400 });

  // fetch page and extract
  const pageRes = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!pageRes.ok) return new Response("Failed to fetch", { status: 502 });
  const html = await pageRes.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  const articleText = (article?.textContent || "").slice(0, 30000);

  //   clear prompt for summarization
  //   const prompt = `
  // You are a helpful AI that reads blog posts and explains them in easy English.

  // Read the following article and respond ONLY in plain text.
  // No Markdown, no numbering, no asterisks (*), no bold text.

  // Format your answer exactly like this:

  // Summary:
  // <your short 2–3 line summary here>

  // Key Points:
  // - point 1
  // - point 2
  // - point 3
  // - etc.

  // Article:
  // ${articleText}
  // `;
  // const prompt = `
  // You are a helpful AI that reads blog posts and explains them in easy English.

  // Summarize the following article and return ONLY valid JSON in this exact format:

  // {
  //   "summary": "2–3 line summary in simple English",
  //   "key_points": ["point 1", "point 2", "point 3"]
  // }

  // Do not include any explanations or text outside the JSON.
  // Article:
  // ${articleText}
  // `;
  const prompt = `
You are a helpful AI that reads blog posts and explains them in easy English.

Format your output beautifully for a friendly app display.
Use emojis and clean bullets like this:

✨ Summary ✨
<your 2–3 line summary>

🌟 Key Points 🌟
• point 1
• point 2
• point 3

Keep words simple, short, and clear.

Article:
${articleText}
`;

  // calling gemini with streaming
  const aiStream = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  //   forward stream to client
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of aiStream) {
          //chunk.text contains generated text (sdk shape)
          const text = chunk.text ?? "";
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
