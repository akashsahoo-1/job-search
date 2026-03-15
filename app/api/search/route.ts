import { NextRequest, NextResponse } from "next/server";
import { scrapeJobSources } from "@/lib/firecrawl";

type Job = {
  company: string;
  role: string;
  location: string;
  salary: string | null;
  description: string;
  apply_link: string;
};

const JOB_HINTS = [
  "job",
  "jobs",
  "career",
  "careers",
  "hiring",
  "position",
  "opening",
  "vacancy",
  "apply",
];

async function verifyFirebaseToken(idToken: string): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey || !idToken) {
    return false;
  }

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    return Array.isArray(data?.users) && data.users.length > 0;
  } catch {
    return false;
  }
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function titleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function hostToCompany(urlString: string): string {
  try {
    const hostname = new URL(urlString).hostname.replace(/^www\./, "");
    const [name] = hostname.split(".");
    return titleCase(name.replace(/[-_]+/g, " ")) || "Unknown Company";
  } catch {
    return "Unknown Company";
  }
}

function looksLikeJobLink(text: string, url: string, query: string): boolean {
  const combined = `${text} ${url}`.toLowerCase();

  if (JOB_HINTS.some((hint) => combined.includes(hint))) {
    return true;
  }

  const queryParts = query
    .toLowerCase()
    .split(/\s+/)
    .filter((part) => part.length > 2);

  return queryParts.some((part) => combined.includes(part));
}

function extractJobsFromMarkdown(
  markdown: string,
  sourceUrl: string,
  query: string
): Job[] {
  const jobs: Job[] = [];
  const regex = /\[([^\]]{4,140})\]\((https?:\/\/[^\s)]+)\)/g;
  let match: RegExpExecArray | null = regex.exec(markdown);

  while (match) {
    const role = cleanText(match[1].replace(/[|\u2022]+/g, " "));
    const applyLink = match[2];

    if (!role || !applyLink) {
      match = regex.exec(markdown);
      continue;
    }

    if (!looksLikeJobLink(role, applyLink, query)) {
      match = regex.exec(markdown);
      continue;
    }

    jobs.push({
      company: hostToCompany(applyLink),
      role,
      location: /remote/i.test(role) ? "Remote" : "Location not listed",
      salary: null,
      description: `Discovered from ${sourceUrl}`,
      apply_link: applyLink,
    });

    match = regex.exec(markdown);
  }

  return jobs;
}

function dedupeJobs(jobs: Job[]): Job[] {
  const seen = new Set<string>();
  const unique: Job[] = [];

  for (const job of jobs) {
    const key = `${job.apply_link}|${job.role.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(job);
  }

  return unique;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: login required", jobs: [] },
        { status: 401 }
      );
    }

    const idToken = authHeader.replace("Bearer ", "").trim();
    const isValidUser = await verifyFirebaseToken(idToken);

    if (!isValidUser) {
      return NextResponse.json(
        { error: "Unauthorized: invalid login token", jobs: [] },
        { status: 401 }
      );
    }

    const body = await req.json();
    const query = cleanText(String(body?.query || ""));

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    if (!process.env.FIRECRAWL_API_KEY) {
      return NextResponse.json(
        { error: "FIRECRAWL_API_KEY is missing", jobs: [] },
        { status: 500 }
      );
    }

    const sources = await scrapeJobSources(query);
    const extractedJobs = sources.flatMap((source) =>
      extractJobsFromMarkdown(source.markdown, source.sourceUrl, query)
    );
    const jobs = dedupeJobs(extractedJobs).slice(0, 40);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}
