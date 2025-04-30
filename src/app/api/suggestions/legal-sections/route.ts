import { NextRequest, NextResponse } from "next/server";
import { generateLegalSuggestions } from "@/lib/ai/gemini";

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

    const suggestions = await generateLegalSuggestions(incidentDescription);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error generating legal sections:", error);
    return NextResponse.json(
      { error: "Failed to generate legal section suggestions" },
      { status: 500 }
    );
  }
}