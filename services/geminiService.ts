import { GoogleGenAI } from "@google/genai";
import { UserStack, AnalysisResult, Quadrant } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeDigitalHabitus = async (stack: UserStack): Promise<AnalysisResult> => {
  const ai = getClient();
  
  // Fallback if no API key is present
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: "The Simulation Glitched",
          quadrant: "proletariat",
          roast: "We couldn't reach the oracle (API Key missing). However, based on the vibes, you probably use Chrome and feel slightly guilty about it. Configure the API key to get a real sociological teardown.",
          score: { cultural: 50, economic: 50 }
        });
      }, 1500);
    });
  }

  const prompt = `
    Analyze the following tech stack based on Pierre Bourdieu's Distinction adapted for the 2025 Digital Age.
    
    User Stack:
    - Design: ${stack.designTool}
    - Browser: ${stack.browser}
    - PM Tool: ${stack.projectManagement}
    - Knowledge: ${stack.knowledgeBase}
    - Communication: ${stack.communication}

    The axes are:
    Y-Axis: Economic Capital (Scale, Money, Utility)
    X-Axis: Cultural Capital (Craft, Authenticity, Purity)

    Quadrants:
    1. The Digital Aristocracy (High Cultural, Low/Med Economic) - Purists, Indie Web.
    2. The Technocrats (High Cultural, High Economic) - Founder Mode, Elite SaaS.
    3. The Merchants (Low Cultural, High Economic) - Growth Hackers, Corporate.
    4. The Proletariat (Low Cultural, Low Economic) - Default users, lurkers.

    Output a JSON object ONLY with this schema:
    {
      "title": "A witty title for this user archetype (e.g., 'The Optimizing Monk' or 'The Corporate Drone')",
      "quadrant": "aristocracy" | "technocrats" | "merchants" | "proletariat",
      "roast": "A 2-3 sentence biting sociological critique/roast of their choices. Be specific about why their tools signal their status.",
      "score": {
        "cultural": number (0-100),
        "economic": number (0-100)
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      title: "The Unclassifiable",
      quadrant: "proletariat",
      roast: "Your stack is so chaotic it broke our sociological models. Or the API failed.",
      score: { cultural: 10, economic: 10 }
    };
  }
};