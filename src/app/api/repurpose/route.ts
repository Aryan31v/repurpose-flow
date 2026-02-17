import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { content, type, currentContent } = await req.json();
    const userKey = req.headers.get("x-user-key");
    const userProvider = req.headers.get("x-user-provider") || "groq";
    const userBaseUrl = req.headers.get("x-user-base-url");
    const userModel = req.headers.get("x-user-model");
    
    const apiKey = userKey || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "No API Key provided. Please set one in Settings." }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const systemPrompt = `You are a world-class content repurposing expert and technical strategist. 
    Your goal is to extract EXACT technical details, specific hardware specs, unique insights, and "aha!" moments from the source content. 
    NEVER use generic placeholder text. If the user mentions a specific problem (like a model size or hardware limitation), that MUST be the focal point of the repurposed content.
    For Tweet Threads: Use double newlines between tweets (1/n, 2/n, etc.).
    You MUST return ONLY valid JSON. No conversational text.`;

    const userPrompt = type 
      ? `Original Source Content: "${content}"
         Current Draft of ${type}: "${currentContent}"
         Task: Regenerate this ${type} to be more engaging, high-impact, and professional. 
         Focus on deep insights and a "high cognition" approach.
         Return ONLY a JSON object: {"content": "...", "hashtags": ["tag1", "tag2"]}`
      : `Analyze this long-form content: "${content}"
         Create 4 distinct repurposing ideas:
         1. Tweet Thread (5-7 tweets)
         2. LinkedIn Post (Professional)
         3. Short-form Video Script (Hook, Body, CTA)
         4. Blog Post Outline (Detailed headings)
         Return ONLY a JSON object: {
           "original_title": "...",
           "repurposing_ideas": [
             {"id": "1", "type": "Tweet Thread", "title": "...", "content": "...", "hashtags": [...]},
             {"id": "2", "type": "LinkedIn Post", "title": "...", "content": "...", "hashtags": [...]},
             {"id": "3", "type": "Short-form Video Script", "title": "...", "content": "...", "hashtags": [...]},
             {"id": "4", "type": "Blog Post Outline", "title": "...", "content": "...", "hashtags": [...]},
           ]
         }`;

    let responseText = "";

    if (userProvider === "groq") {
      const groq = new Groq({ apiKey });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });
      responseText = completion.choices[0]?.message?.content || "{}";
    } else if (userProvider === "gemini") {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([systemPrompt, userPrompt]);
      responseText = result.response.text();
    } else if (userProvider === "anthropic") {
      const anthropic = new Anthropic({ apiKey });
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });
      responseText = typeof message.content[0] === 'object' && 'text' in message.content[0] 
        ? message.content[0].text 
        : "";
    } else if (userProvider === "custom") {
      const openai = new OpenAI({ 
        apiKey, 
        baseURL: userBaseUrl || "https://api.openai.com/v1" 
      });
      const completion = await openai.chat.completions.create({
        model: userModel || "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        response_format: { type: "json_object" },
      });
      responseText = completion.choices[0]?.message?.content || "{}";
    }

    // Clean JSON response (remove markdown code blocks if present)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response");
    
    const parsedData = JSON.parse(jsonMatch[0]);

    // Ensure content is always a string (prevents [object Object] in UI)
    if (parsedData.repurposing_ideas) {
      parsedData.repurposing_ideas = parsedData.repurposing_ideas.map((idea: any) => {
        if (typeof idea.content === 'object' && idea.content !== null) {
          idea.content = JSON.stringify(idea.content, null, 2);
        }
        return idea;
      });
    }

    if (parsedData.content && typeof parsedData.content === 'object') {
      parsedData.content = JSON.stringify(parsedData.content, null, 2);
    }
    
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content." }, { status: 500 });
  }
}
