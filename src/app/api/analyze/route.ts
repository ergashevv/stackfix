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
    let fallbackToGPT = false;

    try {
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

        if ((geminiRes.status === 503 || geminiRes.status === 429) && attempt < maxRetries) {
          attempt++;
          console.warn(`Gemini ${geminiRes.status}. Retrying attempt ${attempt}...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        break;
      }

      if (!geminiRes || !geminiRes.ok) {
        console.error("Gemini API failed. Switching to Azure OpenAI Fallback.");
        fallbackToGPT = true;
      }
    } catch (error) {
      console.error("Gemini connection error. Switching to Azure OpenAI Fallback.");
      fallbackToGPT = true;
    }

    let analysis;

    if (fallbackToGPT) {
      // Automatic Fallback to Azure OpenAI (GPT-4o-mini)
      const gptResponse = await callAzureOpenAI(prompt);
      if (!gptResponse) {
        return NextResponse.json({ 
          error: true, 
          message: "All AI models are temporarily unavailable. Please try again later." 
        }, { status: 503 });
      }
      analysis = gptResponse;
    } else {
      // Process Gemini Response
      const data = await geminiRes!.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        // One more try with GPT if Gemini returns empty
        const gptResponse = await callAzureOpenAI(prompt);
        if (!gptResponse) {
          return NextResponse.json({ 
            error: true, 
            message: "AI is temporarily unavailable. Please try again." 
          }, { status: 500 });
        }
        analysis = gptResponse;
      } else {
        // Extract JSON from the Gemini response text
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
              // Fallback to GPT if Gemini output is corrupted
              analysis = await callAzureOpenAI(prompt);
            }
          }
        }
      }
    }

    if (!analysis) {
        return NextResponse.json({ 
          error: true, 
          message: "AI analysis failed. Please try again." 
        }, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Critical Analysis Error:", error.message || error);
    
    return NextResponse.json({ 
      error: true, 
      message: "AI service encountered an error. Please try again." 
    }, { status: 500 });
  }
}

/**
 * Azure OpenAI Fallback Handler
 */
async function callAzureOpenAI(prompt: string) {
  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    if (!endpoint || !apiKey || !deployment) {
      console.warn("Azure OpenAI credentials missing. Fallback ignored.");
      return null;
    }

    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a senior software engineer. Respond ONLY with structured JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Azure OpenAI Fallback Error:", error);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) return null;

    try {
      return JSON.parse(content);
    } catch {
      // In case formatting wasn't perfect JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }
  } catch (err) {
    console.error("Failed to fetch Azure OpenAI:", err);
    return null;
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
