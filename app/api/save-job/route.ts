import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    
    // Use standard service role/anon key client to insert based on provided JWT
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let user_id;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user) {
         user_id = user.id;
      }
    }

    if (!user_id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await req.json();

    const { data, error } = await supabase.from("saved_jobs").insert({
      user_id: user_id,
      company: job.company,
      role: job.role,
      location: job.location,
      salary: job.salary,
      description: job.description,
      apply_link: job.apply_link
    }).select().single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Save job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
