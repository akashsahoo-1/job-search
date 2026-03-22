import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    const prompt = `You are a helpful AI recruiting assistant. Extract a concise 3-bullet summary of the following job description, outlining the core responsibilities, and generate a brief list of the top required skills.
    
    Job Description:
    ${description.substring(0, 4000)} // max characters
    
    Output ONLY a valid JSON object matching exactly this format:
    {
       "summary": ["bullet 1", "bullet 2", "bullet 3"],
       "skills": ["skill 1", "skill 2", "skill 3"]
    }`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }),
    });

    if (!res.ok) throw new Error("OpenRouter API failed");

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("Empty response");

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI Summary API error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
