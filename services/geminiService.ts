
import { GoogleGenAI, Type } from "@google/genai";

/**
 * TASK: Visual Strategist & Portfolio Architect
 * MODEL: gemini-3-pro-preview (Best for deep reasoning and image understanding)
 */
export const deepMarketAnalysis = async (prompt: string, base64Image?: string, mimeType?: string) => {
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
        systemInstruction: `You are an elite World Trade Platform Analyst. 
        Your goal is to provide deep, skeptical, and risk-adjusted market insights.
        - If an image is provided: Perform technical analysis, identify patterns (SR levels, RSI divergences), and assess structure.
        - If text only: Provide macro-strategic advice or explain complex trading concepts.
        - Always use professional financial terminology and Markdown formatting.`,
        temperature: 0.3, 
      },
    });
    return response.text;
  } catch (error: any) {
    if (error?.message?.includes("not found") && (window as any).aistudio) {
      (window as any).aistudio.openSelectKey();
    }
    return "Intelligence Terminal connection lost. Check API credentials.";
  }
};

/**
 * TASK: Payment Verification Engine (Upgraded to Pro)
 * MODEL: gemini-3-pro-preview
 */
export const verifyPaymentProof = async (base64Image: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: "World Trade Platform Audit Request: Analyze this financial receipt. Verify if it is a legitimate success screen for a USDT or Bank transfer. Look for 'Success', 'Transaction Hash', 'Amount', and 'Date'. Does the amount match or exceed $1,000?" }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_valid: { type: Type.BOOLEAN, description: "True if image is a valid transaction receipt" },
            detected_amount: { type: Type.NUMBER, description: "Numeric value of the detected transfer" },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
            summary: { type: Type.STRING, description: "A one-sentence audit summary" }
          },
          required: ["is_valid", "detected_amount", "confidence", "summary"]
        },
        systemInstruction: "You are an AI Forensic Auditor for a World Trade Platform. Your objective is to ensure no fraudulent receipts pass through. Be precise and strict. Only return valid JSON."
      },
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Forensic Audit failed", error);
    return { is_valid: false, detected_amount: 0, confidence: 0, summary: "Forensic connection timeout." };
  }
};

/**
 * TASK: Rapid Sentiment Pulse
 */
export const getInstantMarketPulse = async (asset: string = "Bitcoin") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: `Quick sentiment scan for ${asset}. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, description: "Bullish, Bearish, or Neutral" },
            score: { type: Type.NUMBER, description: "Confidence 1-100" },
            brief: { type: Type.STRING, description: "Max 8 words justification" },
          },
          required: ["sentiment", "score", "brief"]
        },
        systemInstruction: "You are a high-speed HFT sentiment engine. Be extremely concise and accurate."
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};

/**
 * TASK: Edge Detector
 */
export const getTraderEdgeFast = async (bio: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: `Summarize this trader's unique competitive edge in one punchy, 6-word sentence: "${bio}"`,
      config: {
        systemInstruction: "You are a talent scout for a multi-strategy hedge fund."
      }
    });
    return response.text;
  } catch (error) {
    return "Analyzing edge...";
  }
};
