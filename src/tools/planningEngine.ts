import OpenAI from "openai";
import dotenv from "dotenv";
import { vectorSystemPrompt } from "../vector";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface PlanStep {
  number: number;
  description: string;
  tool: string | null;
}

export interface GeneratedPlan {
  goal: string;
  steps: PlanStep[];
}

export async function generatePlan(goal: string): Promise<any> {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
${vectorSystemPrompt}

When creating a plan, ALWAYS output valid JSON in the following structure:

{
  "goal": "<string>",
  "steps": [
    {
      "number": <int>,
      "description": "<string>",
      "tool": "<string|null>"
    }
  ]
}

Rules:
- "tool" must be one of: "fileWriterTool", "fileReaderTool", "fileUpdaterTool", "webSearchTool", "memory", or null.
- If no tool is required, set "tool": null.
- Do NOT include commentary outside the JSON.
- Do NOT wrap JSON in backticks.
        `
      },
      {
        role: "user",
        content: `Create a structured multi-step plan for this goal: ${goal}`
      }
    ]
  });

  return completion.choices[0].message;
}
