export interface WebSearchResult {
  answer?: string;
  related?: any[];
  error?: string;
}

export async function webSearchTool(query: string): Promise<WebSearchResult> {
  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
    );

    const data = await response.json();

    return {
      answer: data.Abstract || "No direct answer found.",
      related: data.RelatedTopics?.slice(0, 5) || []
    };
  } catch (error: any) {
    return { error: "Web search failed." };
  }
}
