const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export interface GoogleBook {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  total_pages: number;
  description: string;
  categories: string[];
}

export const searchBooks = async (query: string): Promise<GoogleBook[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=10`
    );
    const data = await response.json();

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : "Unknown Author",
      // Clean up the thumbnail URL to use https
      cover_url: item.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || "",
      total_pages: item.volumeInfo.pageCount || 0,
      description: item.volumeInfo.description || "",
      categories: item.volumeInfo.categories || []
    }));
  } catch (error) {
    console.error("Error fetching from Google Books:", error);
    return [];
  }
};
