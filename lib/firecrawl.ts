const FIRECRAWL_URL = "https://api.firecrawl.dev/v2/scrape";

type ScrapedSource = {
  sourceUrl: string;
  markdown: string;
};

const SOURCE_TEMPLATES = [
  "https://weworkremotely.com/remote-jobs/search?term={query}",
  "https://www.indeed.com/jobs?q={query}",
  "https://www.linkedin.com/jobs/search/?keywords={query}",
  "https://wellfound.com/jobs?query={query}",
  "https://remoteok.com/remote-{slug}-jobs",
];

function buildSourceUrls(query: string): string[] {
  const encoded = encodeURIComponent(query);
  const slug = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return SOURCE_TEMPLATES.map((template) =>
    template.replace("{query}", encoded).replace("{slug}", slug || "developer")
  );
}

export async function scrapeUrl(url: string): Promise<string> {
  if (!process.env.FIRECRAWL_API_KEY) {
    return "";
  }

  try {
    const res = await fetch(FIRECRAWL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Firecrawl error:", text);
      return "";
    }

    const data = await res.json();
    return data?.data?.markdown || "";
  } catch (error) {
    console.error("Firecrawl crash:", error);
    return "";
  }
}

export async function scrapeJobSources(query: string): Promise<ScrapedSource[]> {
  const urls = buildSourceUrls(query);

  const results = await Promise.allSettled(
    urls.map(async (sourceUrl) => {
      const markdown = await scrapeUrl(sourceUrl);
      return { sourceUrl, markdown };
    })
  );

  return results
    .filter((result): result is PromiseFulfilledResult<ScrapedSource> => result.status === "fulfilled")
    .map((result) => result.value)
    .filter((result) => result.markdown.trim().length > 0);
}
