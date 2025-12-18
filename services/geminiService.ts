
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  /**
   * Processes marketing image generation or transformation using Gemini.
   * Initializes a fresh GoogleGenAI instance per call to ensure latest API key usage.
   */
  async processMarketingImage(base64Image: string, prompt: string): Promise<string | null> {
    try {
      // Always use named parameter for apiKey and obtain it from process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1] || base64Image,
                mimeType: 'image/png',
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      // Iterate through candidates and parts to find the generated image
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const base64EncodeString: string = part.inlineData.data;
            return `data:image/png;base64,${base64EncodeString}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return null;
    }
  }

  /**
   * Edits an image based on user prompt.
   */
  async editImage(base64Image: string, editPrompt: string): Promise<string | null> {
    const fullPrompt = `Edit this image based on the following instruction: ${editPrompt}. Maintain the core product consistency but apply the requested changes.`;
    return this.processMarketingImage(base64Image, fullPrompt);
  }
}

export const geminiService = new GeminiService();
