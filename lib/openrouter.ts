const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODEL = "mistralai/mistral-7b-instruct:free";

async function callOpenRouter(messages: any[]) {
  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "AI Job Search",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: "json_object" },
      messages
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter Error: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    return { jobs: [] };
  }

  try {
    return JSON.parse(content);
  } catch {
    return { jobs: [] };
  }
}

export async function filterJobsWithAI(markdown: string) {
  return callOpenRouter([
    {
      role: "system",
      content: `You are an expert job recruiter.

Extract job postings from the provided markdown.

Return ONLY JSON in this format:

{
  "jobs": [
    {
      "company": "string",
      "role": "string",
      "location": "string",
      "salary": "string|null",
      "description": "string",
      "apply_link": "string"
    }
  ]
}`
    },
    {
      role: "user",
      content: `Extract jobs from this markdown:\n\n${markdown}`
    }
  ]);
}