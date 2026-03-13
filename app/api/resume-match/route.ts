import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { analyzeResumeMatch } from "@/lib/openrouter";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const { filePath, jobDescription } = await req.json();
    
    if (!filePath || !jobDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient();
    
    // Download file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from("resumes")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return NextResponse.json({ error: "Failed to download resume" }, { status: 500 });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    const analysis = await analyzeResumeMatch(resumeText, jobDescription);
    
    return NextResponse.json(analysis);

  } catch (error) {
    console.error("Resume match error:", error);
    return NextResponse.json({ error: "Failed to process resume match" }, { status: 500 });
  }
}
