import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { keywords } = await req.json();

    if (!keywords) {
      return NextResponse.json({ links: [] });
    }

    const apiKey = process.env.STACKOVERFLOW_API_KEY;
    
    // Clean keywords: remove special characters and limit to a reasonable number of words
    const cleanedKeywords = keywords
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 6)
      .join(' ');
    
    console.log("Searching Stack Overflow for:", cleanedKeywords);

    const url = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(
      cleanedKeywords
    )}&site=stackoverflow${apiKey ? `&key=${apiKey}` : ""}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      return NextResponse.json({ links: [] });
    }

    const decodeEntities = (text: string) => {
      return text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
                 .replace(/&quot;/g, '"')
                 .replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .replace(/&#39;/g, "'");
    };

    const filteredItems = data.items
      .filter((item: any) => item.score >= 0)
      .sort((a: any, b: any) => {
        // First priority: Accepted answer
        const aHasAccepted = a.accepted_answer_id !== undefined;
        const bHasAccepted = b.accepted_answer_id !== undefined;
        if (aHasAccepted && !bHasAccepted) return -1;
        if (!aHasAccepted && bHasAccepted) return 1;
        
        // Second priority: Score (votes)
        return b.score - a.score;
      });

    const links = filteredItems.slice(0, 5).map((item: any) => ({
      title: decodeEntities(item.title),
      link: item.link,
      score: item.score,
      is_answered: item.is_answered,
      has_accepted: item.accepted_answer_id !== undefined,
      tags: item.tags || [],
    }));

    return NextResponse.json({ links });
  } catch (error) {
    console.error("Stack Overflow API Error:", error);
    return NextResponse.json({ links: [] });
  }
}
