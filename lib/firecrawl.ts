const FIRECRAWL_URL = "https://api.firecrawl.dev/v2/scrape";

export async function scrapeUrl(url: string): Promise<string> {
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
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Firecrawl error:", text);
      return "";
    }

    const data = await res.json();

    if (!data?.data?.markdown) {
      return "";
    }

    return data.data.markdown;
  } catch (error) {
    console.error("Firecrawl crash:", error);
    return "";
  }
}