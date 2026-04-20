// src/utils/groq.js
const MODEL_NAME = "grok-4";

const SYSTEM_PROMPT = `You are a social media expert for Cuemath. 
Return ONLY a valid JSON object. No markdown, no backticks.
For CAROUSEL:
{
  "format": "carousel",
  "slides": [
    { "slide_number": 1, "headline": "...", "subtext": "...", "emoji": "...", "bg_style": "gradient_purple" },
    { "slide_number": 2, "headline": "...", "subtext": "...", "emoji": "...", "bg_style": "gradient_warm" },
    { "slide_number": 3, "headline": "...", "subtext": "...", "emoji": "...", "bg_style": "dark_purple" },
    { "slide_number": 4, "headline": "...", "subtext": "...", "emoji": "...", "bg_style": "gradient_warm" },
    { "slide_number": 5, "headline": "...", "subtext": "...", "emoji": "...", "bg_style": "gradient_purple" },
    { "slide_number": 6, "headline": "...", "subtext": "...", "emoji": "...", "bg_style": "dark_purple" }
  ]
}
For POST:
{
  "format": "post",
  "headline": "...",
  "subtext": "...",
  "emoji": "...",
  "bg_style": "gradient_purple"
}
For STORY:
{
  "format": "story",
  "headline": "...",
  "subtext": "...",
  "emoji": "...",
  "bg_style": "gradient_purple",
  "cta": "..."
}`;

async function callGrok(messages) {
  const endpoint = "/api/generate";

  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      stream: false,
      temperature: 0.7,
    }),
  });

  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Non-JSON response from API (${response.status}).`);
  }

  if (!response.ok) {
    console.error("API Error Details:", data);
    throw new Error(data.error?.message || "API Error");
  }

  try {
    const content = data.choices[0].message.content;
    const cleanJson = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Parsing error. Content was:", data.choices[0].message.content);
    throw new Error("AI returned wrong format. Please try again.");
  }
}

export async function generateContent(idea, format) {
  return await callGrok([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Create a ${format} for Cuemath about: ${idea}` }
  ]);
}

export async function regenerateSlide(slide, idea, format) {
  return await callGrok([
    { role: "system", content: "Respond with ONE slide JSON object ONLY." },
    { role: "user", content: `Regenerate slide ${slide.slide_number} for: ${idea}` }
  ]);
}

export async function generateCaption(idea, result) {
  return await callGrok([
    { role: "system", content: "Respond with JSON ONLY: { 'full': '...', 'hashtags': [] }" },
    { role: "user", content: `Write an Instagram caption for: ${idea}` }
  ]);
}
