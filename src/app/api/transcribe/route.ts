import { NextRequest, NextResponse } from "next/server";
import { simulateTranscription } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // In a production app, this would use a real transcription service
    // For this demo, we're using a simulated function
    const transcription = await simulateTranscription(audioFile);

    return NextResponse.json({ transcription });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}