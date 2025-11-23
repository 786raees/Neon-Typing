import { GoogleGenAI } from "@google/genai";
import { Topic } from "../types";
import { FALLBACK_TEXTS } from "../constants";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateText = async (topic: Topic, length: 'short' | 'medium' | 'long'): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API key missing, using fallback text.");
    return FALLBACK_TEXTS[topic];
  }

  const lengthDesc = length === 'short' ? "approximately 20 words" : length === 'medium' ? "approximately 50 words" : "approximately 100 words";
  
  // Clarify "General" topic to avoid ambiguity
  const topicDesc = topic === Topic.GENERAL ? "general knowledge or interesting facts" : topic;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a creative, engaging paragraph about ${topicDesc}. The text should be ${lengthDesc}.`,
      config: {
        systemInstruction: "You are a typing test content generator. Output only plain text. Do not use markdown formatting (no bold, italics, or code blocks). Ensure standard punctuation and capitalization. Do not include a title or header.",
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    let text = response.text?.trim();
    
    if (!text) {
       console.error("Gemini response missing text. Full response:", JSON.stringify(response, null, 2));
       throw new Error("Empty response from Gemini");
    }

    // Cleanup in case model adds quotes or markdown
    text = text.replace(/^["']|["']$/g, '').replace(/`/g, '');
    
    return text;
  } catch (error) {
    console.error("Failed to generate text with Gemini:", error);
    return FALLBACK_TEXTS[topic];
  }
};