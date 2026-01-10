import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Book } from "@/types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Define the response schema so Gemini returns perfect JSON
const schema = {
  description: "List of book recommendations",
  type: SchemaType.OBJECT,
  properties: {
    books: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          author: { type: SchemaType.STRING },
          reason: { type: SchemaType.STRING },
          tags: { 
            type: SchemaType.ARRAY, 
            items: { type: SchemaType.STRING } 
          },
        },
        required: ["title", "author", "reason", "tags"],
      },
    },
  },
  required: ["books"],
};

export const fetchGeminiRecommendations = async (userBooks: string[]): Promise<Book[]> => {
  // Use Gemini 1.5 Flash for speed and cost-efficiency
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = `
    The user has these books in their collection: ${userBooks.join(", ")}.
    Based on their taste, recommend 3 real, published books they don't have.
    Provide a specific reason for each recommendation based on their library.
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  const parsed = JSON.parse(text);
  return parsed.books;
};
