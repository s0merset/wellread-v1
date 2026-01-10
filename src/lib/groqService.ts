import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export const fetchGroqRecommendations = async (userBooks: string[]) => {
  // Use a fallback to ensure we never send an empty prompt
  const bookList = userBooks.length > 0 ? userBooks.join(", ") : "Classic Literature";

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          // FIX 1: Explicitly mention "JSON" at the start to satisfy the JSON-mode validator
          content: "You are a helpful librarian. You must output your response in JSON format."
        },
        {
          role: "user",
          content: `Based on these books: ${bookList}, suggest exactly 6 real, published books. 
          Return a JSON object with this exact structure: {"books": [{"title": "", "author": "", "reason": "", "tags": ["", ""]}]}. 
          The connection in the "reason" field must be clear.`
        }
      ],
      // FIX 2: Using the most stable 2026 Production ID
      model: "llama-3.3-70b-versatile", 
      response_format: { type: "json_object" },
      // FIX 3: Explicitly capping tokens to prevent "Request Too Large" 400 errors
      max_tokens: 2000, 
      temperature: 0.7,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) return [];

    const data = JSON.parse(rawContent);
    return (data.books || []).slice(0, 6);

  } catch (error: any) {
    // If you see a 400 here, check the console log below for the specific reason
    console.error("Groq API Error Detail:", error?.response?.data || error.message);
    
    // FALLBACK: If the 70B model is failing due to capacity/400, 
    // try a smaller but faster model as a safety net
    if (error.status === 400) {
        console.warn("Retrying with smaller model...");
        return fetchFallbackRecommendations(bookList);
    }
    return [];
  }
};

// Safety Fallback Function
async function fetchFallbackRecommendations(bookList: string) {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: `Return a JSON list of 6 book recommendations based on: ${bookList}` }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });
    const data = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return data.books || [];
}
