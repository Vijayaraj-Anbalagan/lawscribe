import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "AIzaSyDgAQKFIA-ghQl61okOF5zw2-sLLxAL6vM");

// Use the latest model: gemini-2.0-pro-exp-02-05
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-pro-exp-02-05",
});

// Generate legal section suggestions
export async function generateLegalSuggestions(input: string) {
  try {
    const prompt = `
    You are an expert legal assistant specialized in Indian law. Based on the following incident description, suggest the most appropriate Indian Penal Code (IPC) sections that should be included in the FIR (First Information Report).
    
    Provide your response in the following JSON format:
    {
      "suggestions": [
        {
          "section": "Section number",
          "title": "Section title",
          "description": "Brief description of the section",
          "relevance": "Explanation of why this section applies to the incident",
          "confidence": number between 0-100
        }
      ]
    }
    
    Please ensure your suggestions are tailored specifically to Indian law and provide accurate, relevant sections. Order them by confidence level (highest to lowest).
    
    Incident description: ${input}
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    try {
      // Find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { error: "Could not parse response from AI" };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return { error: "Could not parse response from AI" };
    }
  } catch (error) {
    console.error("Error generating legal suggestions:", error);
    return { error: "Failed to generate legal suggestions" };
  }
}

// Generate follow-up questions based on the incident
export async function generateFollowUpQuestions(incident: string) {
  try {
    const prompt = `
    You are an expert police officer taking a First Information Report (FIR) in India. Based on the following incident description, generate 5 important follow-up questions that would help clarify details and strengthen the case.
    
    For each question:
    1. Focus on gathering missing critical information
    2. Ask about specific details that would be relevant for legal proceedings
    3. Phrase questions clearly and directly
    
    Provide your response in the following JSON format:
    {
      "questions": [
        {
          "question": "The question text",
          "purpose": "Brief explanation of why this question is important",
          "priority": number between 1-5 (where 1 is highest priority)
        }
      ]
    }
    
    Incident description: ${incident}
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    try {
      // Find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { error: "Could not parse response from AI" };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return { error: "Could not parse response from AI" };
    }
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return { error: "Failed to generate follow-up questions" };
  }
}

// Transcribe voice input (simulated function - in a real app, you would use a browser API or separate service)
export async function simulateTranscription(/* blob: Blob */): Promise<string> {
  // This is a simulated function since real transcription would need a separate service
  // In a real implementation, you would use a service like Google Speech-to-Text
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is a simulated transcription of the audio input.");
    }, 1000);
  });
}