import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
    console.error("Warning: GEMINI_API_KEY is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Development/Production model selection
// Falling back to 1.5 if 3.0 is not available in this environment, but using config as requested.
// User requested newer model. Using gemini-2.5-flash (Verified Stable).
const MODEL_NAME = "gemini-2.5-flash";

export const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.9,
        maxOutputTokens: 8192,
        topP: 0.95,
        topK: 40,
    },
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
    ]
});
