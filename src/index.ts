/**
 * ------------------------------------------------------------
 *  VECTOR WORKFLOW ENGINE — MAIN SERVER ENTRY POINT
 * ------------------------------------------------------------
 *  This file exposes a single POST endpoint `/vector` that acts
 *  as the command router for the entire Vector system.
 *
 *  Responsibilities:
 *   - Accept user messages
 *   - Detect command type (search, file ops, memory ops, planning, execution)
 *   - Delegate work to the appropriate tool
 *   - Fall back to OpenAI chat when no command is matched
 *
 *  This file intentionally contains no business logic — only
 *  routing, validation, and orchestration.
 * ------------------------------------------------------------
 */

console.log("VECTOR INDEX FILE LOADED");

import express, { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

// -----------------------------
// TOOL IMPORTS
// -----------------------------
import { webSearchTool } from "./tools/webSearchTool";
import { fileWriterTool } from "./tools/fileWriterTool";
import { fileReaderTool } from "./tools/fileReaderTool";
import { fileUpdaterTool } from "./tools/fileUpdaterTool";
import { generatePlan } from "./tools/planningEngine";
import { executePlan } from "./tools/workflowEngine";
import {
  saveMemory,
  getMemory,
  getAllMemories,
  deleteMemory,
  savePlan,
  getPlans,
  deletePlan
} from "./tools/memoryTool";

// System prompt for fallback LLM chat mode
import { vectorSystemPrompt } from "./vector";

dotenv.config();

const app = express();
app.use(express.json());

// -----------------------------
// OPENAI CLIENT INITIALIZATION
// -----------------------------
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// =============================================================
//  VECTOR ENDPOINT — MAIN ROUTER
// =============================================================
app.post("/vector", async (req: Request, res: Response) => {
  try {
    const userMessage: string = req.body.message;
    console.log("RAW USER MESSAGE:", JSON.stringify(userMessage));

    const lower = userMessage.toLowerCase();

    // =============================================================
    //  SEARCH COMMAND
    //  Format: search: query
    // =============================================================
    if (lower.startsWith("search:")) {
      const query = userMessage.replace("search:", "").trim();
      const result = await webSearchTool(query);
      return res.json({ reply: result });
    }

    // =============================================================
    //  FILE WRITER
    //  Format: writefile: filename | content
    // =============================================================
    if (lower.startsWith("writefile:")) {
      const parts = userMessage.replace("writefile:", "").trim().split("|");
      const filename = parts[0]?.trim();
      const content = parts[1]?.trim();

      if (!filename || !content) {
        return res.json({ error: "Format: writefile: filename | content" });
      }

      const result = await fileWriterTool(filename, content);
      return res.json({ reply: result });
    }

    // =============================================================
    //  FILE READER
    //  Format: readfile: filename
    // =============================================================
    if (lower.startsWith("readfile:")) {
      const filename = userMessage.replace("readfile:", "").trim();

      if (!filename) {
        return res.json({ error: "Format: readfile: filename" });
      }

      const result = await fileReaderTool(filename);
      return res.json({ reply: result });
    }

    // =============================================================
    //  FILE UPDATER
    //  Format: updatefile: filename | new content | mode(optional)
    //  Modes: append (default), overwrite, prepend
    // =============================================================
    if (lower.startsWith("updatefile:")) {
      const parts = userMessage.replace("updatefile:", "").trim().split("|");
      const filename = parts[0]?.trim();
      const newContent = parts[1]?.trim();

      // Normalize mode
      const rawMode = parts[2]?.trim()?.toLowerCase();
      const mode: "append" | "overwrite" | "prepend" =
        rawMode === "overwrite"
          ? "overwrite"
          : rawMode === "prepend"
          ? "prepend"
          : "append";

      if (!filename || !newContent) {
        return res.json({
          error: "Format: updatefile: filename | new content | mode(optional)"
        });
      }

      const result = await fileUpdaterTool(filename, newContent, mode);
      return res.json({ reply: result });
    }

    // =============================================================
    //  MEMORY SAVE
    //  Format: remember: key | value
    // =============================================================
    if (lower.startsWith("remember:")) {
      const parts = userMessage.replace("remember:", "").trim().split("|");
      const key = parts[0]?.trim();
      const value = parts[1]?.trim();

      if (!key || !value) {
        return res.json({ error: "Format: remember: key | value" });
      }

      const result = await saveMemory(key, value);
      return res.json({ reply: result });
    }

    // =============================================================
    //  MEMORY RECALL
    //  Format: recall: key   OR   recall: all
    // =============================================================
    if (lower.startsWith("recall:")) {
      const key = userMessage.replace("recall:", "").trim();

      if (key === "all") {
        const result = await getAllMemories();
        return res.json({ reply: result });
      }

      const result = await getMemory(key);
      return res.json({ reply: result });
    }

    // =============================================================
    //  MEMORY DELETE
    //  Format: forget: key
    // =============================================================
    if (lower.startsWith("forget:")) {
      const key = userMessage.replace("forget:", "").trim();
      const result = await deleteMemory(key);
      return res.json({ reply: result });
    }

    // =============================================================
    //  PLAN GENERATION
    //  Format: plan: goal description
    // =============================================================
    if (lower.startsWith("plan:")) {
      const goal = userMessage.replace("plan:", "").trim();
      const plan = await generatePlan(goal);
      return res.json({ reply: plan });
    }

    // =============================================================
    //  SAVE PLAN
    //  Format: saveplan: { ...json... }
    // =============================================================
    if (lower.startsWith("saveplan:")) {
      const planJson = userMessage.replace("saveplan:", "").trim();
      try {
        const plan = JSON.parse(planJson);
        const result = await savePlan(plan);
        return res.json({ reply: result });
      } catch {
        return res.json({ error: "Invalid JSON. Format: saveplan: { ... }" });
      }
    }

    // =============================================================
    //  LIST PLANS
    // =============================================================
    if (lower === "list plans") {
      const plans = await getPlans();
      return res.json({ reply: plans });
    }

    // =============================================================
    //  DELETE PLAN
    //  Format: deleteplan: index
    // =============================================================
    if (lower.startsWith("deleteplan:")) {
      const index = parseInt(userMessage.replace("deleteplan:", "").trim());
      const result = await deletePlan(index);
      return res.json({ reply: result });
    }

    // =============================================================
    //  PLAN + EXECUTE (AUTO)
    //  Format: planexecute: goal
    // =============================================================
    if (lower.startsWith("planexecute:")) {
      try {
        const goal = userMessage.replace("planexecute:", "").trim();

        const plan = await generatePlan(goal);
        const parsedPlan = JSON.parse(plan.content);

        const results = await executePlan(parsedPlan);

        return res.json({
          reply: {
            plan: parsedPlan,
            execution: results
          }
        });
      } catch (err) {
        console.error("AUTO EXEC ERROR:", err);
        return res.json({
          error: "Automatic execution failed. Check plan format."
        });
      }
    }

    // =============================================================
    //  MANUAL EXECUTE PLAN
    //  Format: executeplan: { ...plan json... }
    // =============================================================
    if (lower.startsWith("executeplan:")) {
      try {
        const planJson = userMessage.replace("executeplan:", "").trim();
        const parsedPlan = JSON.parse(planJson);

        const results = await executePlan(parsedPlan);

        return res.json({ reply: results });
      } catch (err) {
        console.error("EXECUTEPLAN ERROR:", err);
        return res.json({
          error: "Invalid plan JSON or execution failed."
        });
      }
    }

    // =============================================================
    //  DEFAULT MODE — FALLBACK TO OPENAI CHAT
    // =============================================================
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: vectorSystemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message;
    return res.json({ reply });

  } catch (error) {
    console.error("VECTOR ERROR:", error);
    return res.status(500).json({ error: "Vector encountered an error." });
  }
});

// =============================================================
//  START SERVER
// =============================================================
app.listen(3000, () => {
  console.log("Vector is running on http://localhost:3000/vector");
});
