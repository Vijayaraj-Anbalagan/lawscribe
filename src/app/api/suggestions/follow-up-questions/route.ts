import { NextRequest, NextResponse } from "next/server";
import { generateFollowUpQuestions } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { incidentDescription } = body;

    if (!incidentDescription) {
      return NextResponse.json(
        { error: "Incident description is required" },
        { status: 400 }
      );
    }

    const followUpQuestions = await generateFollowUpQuestions(incidentDescription);

    return NextResponse.json(followUpQuestions);
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return NextResponse.json(
      { error: "Failed to generate follow-up questions" },
      { status: 500 }
    );
  }
}