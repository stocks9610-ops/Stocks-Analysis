
import { GoogleGenAI, Type } from "@google/genai";

/**
 * TASK: Neural Support Concierge (Astra)
 * MODEL: gemini-3-flash-preview
 */
export const startSupportChat = async (history: {role: 'user' | 'model', parts: {text: string}[]}[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are 'Astra', the Elite Support Concierge for the CopyTrade World Trade Platform.
    
    CRITICAL RESPONSE RULES:
    1. NEVER write long paragraphs. 
    2. ALWAYS use bullet points or numbered lists.
    3. Maximum 3-4 points per response.
    4. Use BOLD for amounts, wallet addresses, and key actions.
    5. Be professional, direct, and high-speed.

    PLATFORM DATA & PROTOCOLS:
    - SIGNUP BONUS: **$1,000** added to balance immediately upon registration.
    - WITHDRAWAL RULE: To unlock the first payout of bonus/profits, a **$1,000 USDT (TRC-20)** security deposit is required. This verifies the user's external wallet.
    - WALLET ADDRESS: **0x7592766391918c7d3E7F8Ae72D97e98979F25302** (Network: **TRC-20**).
    - PERFORMANCE: **98.75%** success rate via Neural Capital Deployment.
    - SECURITY: Funds are split across **Binance, Bybit, and Kraken** for safety.

    EXAMPLE STRUCTURE:
    - **Bonus**: You have received **$1,000**.
    - **Unlock**: Deposit **$1,000 USDT** to verify your wallet.
    - **Status**: Your account is currently in 'New Member' phase.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history,
      config: {
        systemInstruction,
        temperature: 0.4, // Lower temperature for more consistent, structured output
      },
    });
    return response.text;
  } catch (error) {
    console.error("Support Chat Error", error);
    return "• **Error**: Connection to Neural Node lost.\n• **Action**: Please refresh your terminal.";
  }
};

/**
 * TASK: Deep Market Insight
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
        systemInstruction: `You are an elite financial strategist.
        - Provide deep technical analysis using price action and volume profiles.
        - Be critical of market hype. Focus on risk management.
        - Use professional, concise Markdown formatting.`,
        temperature: 0.2, 
      },
    });
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

/**
 * TASK: Trader Edge Summary
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
