import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.query;

    if (!query) {
      return NextResponse.json(
        { error: "Query required" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // save search history
    if (user) {
      await supabase.from("search_history").insert({
        user_id: user.id,
        query: query,
      });
    }

    const encoded = encodeURIComponent(query);
    const url = `https://remotive.com/api/remote-jobs?search=${encoded}`;

    const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
    if (!res.ok) {
      return NextResponse.json({ jobs: [] });
    }

    const data = await res.json();
    const jobs = (data.jobs || []).map((job: any) => ({
      company: job.company_name || "Unknown Company",
      role: job.title || "Unknown Role",
      location: job.candidate_required_location || "Remote",
      salary: job.salary || null,
      description: job.description || "",
      apply_link: job.url || ""
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ jobs: [] });
  }
}