// src/lib/
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

console.log('Gemini key present?', !!process.env.REACT_APP_GEMINI_API_KEY);


export const gen = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function generateRecipe(ingredientsText) {
  if (!gen) {
    throw new Error("Missing REACT_APP_GEMINI_API_KEY. Set it in your .env and restart the dev server.");
  }
  const model = gen.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are a culinary assistant. Given a list of ingredients, propose ONE appetizing recipe.
Return a clear Markdown format with:
- A short title
- Ingredients with quantities
- Numbered step-by-step instructions
Ingredients: ${ingredientsText}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
}
