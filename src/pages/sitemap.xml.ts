import type { APIRoute } from "astro";
import { events } from "../data/events";

export const prerender = true;

const escapeXml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };

    return entities[character];
  });

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("Configura `site` en astro.config.mjs para generar el sitemap.");
  }

  const urls = [
    new URL("/", site),
    ...events.map((event) => new URL(`/eventos/${event.slug}/`, site)),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${escapeXml(url.href)}</loc>\n  </url>`).join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
