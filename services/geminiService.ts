import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `You are the Symbion AI, a highly advanced code architect from the Multiverse Lab. 
Your task is to analyze software project structures and codebases. 
Provide concise, technical, and high-level summaries. 
Identify the technology stack and offer 3 key architectural suggestions for improvement or scalability.
Maintain a futuristic, professional, and precise tone.`;

export const analyzeProject = async (projectContext: string): Promise<GeminiAnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Use flash-preview for large context handling
  const modelId = "gemini-3-flash-preview";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Analyze the following project codebase context:\n\n${projectContext.substring(0, 500000)}... (truncated if too long)`, // Safety truncate though Flash handles ~1M
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A high-level executive summary of what the project does.",
            },
            techStack: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of identified technologies, languages, and frameworks.",
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three specific architectural or code quality suggestions.",
            },
          },
          required: ["summary", "techStack", "suggestions"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiAnalysisResult;
    }
    
    throw new Error("No response text received from Gemini.");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
