import { NextResponse } from "next/server";

/**
 * StackFix AI Error Analysis API
 * Uses Google Gemini 2.5 Flash (latest as of 2026) to analyze stack traces.
 */
export async function POST(req: Request) {
  try {
    const { error: userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: "No error input provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback for demo if no API key is provided
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using mock response for demo.");
      return NextResponse.json(getMockResponse(userInput));
    }

    const prompt = `You are a high-level senior software engineer and debugging expert. 
Analyze the provided error message or stack trace.
Explain the error clearly, identify the probable root cause, and provide actionable fix steps.

In addition to explanation, return a structured JSON response EXACTLY with these fields:
{
  "language": "e.g. JavaScript, Python, etc.",
  "framework": "e.g. React, Next.js, Django, or 'Vanilla' if none",
  "error_type": "e.g. TypeError, ReferenceError, etc.",
  "error_category": "e.g. Runtime, Security, Syntax, etc.",
  "explanation": "A simple, clear explanation of what the error means.",
  "root_cause": "The technical reason why this error occurred.",
  "fix_steps": ["Step 1", "Step 2"],
  "fix_summary": "1 line summary of the fix",
  "before_code": "The original problematic code snippet (if identifiable) or a representation of the issue",
  "after_code": "The fixed version of the code",
  "confidence": 0.0-1.0, (number representing your certainty)
  "search_query": "Optimized search query for Stack Overflow (3-5 words)"
}

Error to analyze:
${userInput}`;

    // Using Gemini 2.5 Flash (Latest stable in 2026)
    // Using raw fetch to ensure maximum compatibility across Next.js versions
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const maxRetries = 2;
    let attempt = 0;
    let geminiRes;

    while (attempt <= maxRetries) {
      geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40,
          }
        })
      });

      if (geminiRes.status === 503 && attempt < maxRetries) {
        attempt++;
        console.warn(`Gemini 503 (High Demand). Retrying attempt ${attempt}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      break;
    }

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json().catch(() => ({}));
      console.error("Gemini API Error Response:", errorData);
      
      // If we've exhausted retries or hit a non-retryable error
      return NextResponse.json({ 
        error: true, 
        message: "AI is temporarily unavailable. Please try again." 
      }, { status: 503 });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return NextResponse.json({ 
        error: true, 
        message: "AI is temporarily unavailable. Please try again." 
      }, { status: 500 });
    }

    // Extract JSON from the response text
    let analysis;
    try {
      // First try to parse the whole response as JSON
      analysis = JSON.parse(text);
    } catch {
      // If that fails (e.g. if wrapped in markdown), try to extract the JSON block
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysis = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json({ 
            error: true, 
            message: "AI provided an invalid response format. Please try again." 
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          error: true, 
          message: "AI response did not contain a valid analysis. Please try again." 
        }, { status: 500 });
      }
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error.message || error);
    
    return NextResponse.json({ 
      error: true, 
      message: "AI is temporarily unavailable. Please try again." 
    }, { status: 500 });
  }
}

function getMockResponse(input: string) {
  return {
    language: "JavaScript",
    framework: "React",
    error_type: "TypeError",
    error_category: "Runtime",
    explanation: "This appears to be a standard development error related to accessing undefined properties.",
    root_cause: "A variable or object property was accessed before it was initialized or after it was set to null.",
    fix_steps: [
      "Verify the data source is correctly initialized.",
      "Use optional chaining (?.) for deep property access.",
      "Provide default values using the nullish coalescing operator (??)."
    ],
    fix_summary: "Use optional chaining to safely access property",
    before_code: "const value = data.property;",
    after_code: "const value = data?.property ?? 'default';",
    confidence: 0.95,
    search_query: "javascript cannot read property of undefined"
  };
}
