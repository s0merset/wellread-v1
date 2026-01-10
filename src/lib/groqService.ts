import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export const fetchGroqRecommendations = async (userBooks: string[]) => {
  // Use a fallback to prevent the AI from getting confused by empty arrays
  const bookList = userBooks.length > 0 ? userBooks.join(", ") : "Classic Literature";

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a professional librarian. You must return only a JSON object containing exactly 6 book recommendations. No conversational text or markdown."
      },
      {
        role: "user",
        content: `Based on these books: ${bookList}, suggest exactly 6 real, published books. 
        Format your response as a JSON object with a "books" array. 
        Each book must have: "title", "author", "reason" (a 1-sentence specific connection to the user's list), and "tags" (array of 2 genres). 
        JSON structure: {"books": [{"title": "", "author": "", "reason": "", "tags": ["", ""]}]}`
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  const rawContent = completion.choices[0]?.message?.content;
  if (!rawContent) return [];

  try {
    const data = JSON.parse(rawContent);
    const books = data.books || [];
    
    // Explicitly return only 6 to maintain your UI grid layout
    return books.slice(0, 6);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return [];
  }
};
