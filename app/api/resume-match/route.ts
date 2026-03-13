import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    matchScore: 0,
    missingSkills: [],
    strongMatches: [],
    summary: "Resume match feature coming soon."
  });
}
