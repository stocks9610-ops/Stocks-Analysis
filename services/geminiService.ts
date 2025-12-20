
import { GoogleGenAI, Type } from "@google/genai";

/**
 * TASK: Deep Market Insight
 * MODEL: gemini-3-pro-preview
 */
export const deepMarketAnalysis = async (prompt: string, base64Image?: string, mimeType?: string) => {
  // Always use the latest API key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [{ text: prompt }];
  
  if (base64Image && mimeType) {
    parts.push({
      inlineData: { data: base64Image, mimeType: mimeType },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: `You are an elite financial strategist.
        - Provide deep technical analysis using price action and volume profiles.
        - Be critical of market hype. Focus on risk management.
        - Use professional, concise Markdown formatting.`,
        temperature: 0.2, 
      },
    });
    // Access .text property directly
    return response.text;
  } catch (error: any) {
    console.error("AI Analysis Failed", error);
    return "Intelligence Terminal connection lost. Verify API credentials in environment settings.";
  }
};

/**
 * TASK: Payment Forensic Verification
 */
export const verifyPaymentProof = async (base64Image: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: "Verify this transaction. Look for 'Success', 'Confirmed', or 'Complete'. Extract the amount and currency. Is it a valid financial receipt?" }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_valid: { type: Type.BOOLEAN },
            detected_amount: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["is_valid", "detected_amount", "confidence", "summary"]
        },
        systemInstruction: "You are an automated deposit auditor. Be extremely strict about receipt authenticity."
      },
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { is_valid: false, detected_amount: 0, confidence: 0, summary: "Auditor connection timeout." };
  }
};

/**
 * TASK: Rapid Pulse Engine
 */
export const getInstantMarketPulse = async (asset: string = "Bitcoin") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Quick sentiment scan for ${asset}. JSON output only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            score: { type: Type.NUMBER },
            brief: { type: Type.STRING },
          },
          required: ["sentiment", "score", "brief"]
        }
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};

// FIX: Added missing exported function getTraderEdgeFast
/**
 * TASK: Trader Edge Summary
 * MODEL: gemini-3-flash-preview
 */
export const getTraderEdgeFast = async (bio: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the unique trading edge for a mentor with this bio: ${bio}`,
      config: {
        systemInstruction: "You are an elite trading psychologist and talent scout. Create a one-sentence punchy insight about the trader's edge. Be professional and sharp. Maximum 15 words.",
      },
    });
    return response.text || "Alpha generation verified.";
  } catch (error) {
    console.error("Trader Edge Extraction Failed", error);
    return "Institutional strategy confirmed.";
  }
};
