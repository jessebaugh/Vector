import fs from "fs/promises";
import path from "path";

const memoryPath = path.join(process.cwd(), "vector_memory", "memory.json");

// Shape of the memory.json file
export interface MemoryData {
  [key: string]: any;
  plans?: any[];
}

// Generic result for save/delete operations
export interface MemoryResult {
  success: boolean;
  message?: string;
  error?: string;
}

// -----------------------------
// Internal helpers
// -----------------------------

async function loadMemory(): Promise<MemoryData> {
  try {
    const data = await fs.readFile(memoryPath, "utf8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveMemoryFile(memory: MemoryData): Promise<void> {
  await fs.writeFile(memoryPath, JSON.stringify(memory, null, 2), "utf8");
}

// -----------------------------
// Public API
// -----------------------------

export async function saveMemory(key: string, value: any): Promise<MemoryResult> {
  const memory = await loadMemory();
  memory[key] = value;
  await saveMemoryFile(memory);
  return { success: true, message: `Saved memory: ${key}` };
}

export async function getMemory(key: string): Promise<any> {
  const memory = await loadMemory();
  return memory[key] ?? null;
}

export async function getAllMemories(): Promise<MemoryData> {
  return await loadMemory();
}

export async function deleteMemory(key: string): Promise<MemoryResult> {
  const memory = await loadMemory();
  delete memory[key];
  await saveMemoryFile(memory);
  return { success: true, message: `Deleted memory: ${key}` };
}

// -----------------------------
// Plan-specific helpers
// -----------------------------

export async function savePlan(plan: any): Promise<MemoryResult> {
  const memory = await loadMemory();
  if (!Array.isArray(memory.plans)) memory.plans = [];
  memory.plans.push(plan);
  await saveMemoryFile(memory);
  return { success: true, message: "Plan saved" };
}

export async function getPlans(): Promise<any[]> {
  const memory = await loadMemory();
  return memory.plans ?? [];
}

export async function deletePlan(index: number): Promise<MemoryResult> {
  const memory = await loadMemory();

  if (!Array.isArray(memory.plans) || !memory.plans[index]) {
    return { success: false, message: "Plan not found" };
  }

  memory.plans.splice(index, 1);
  await saveMemoryFile(memory);

  return { success: true, message: "Plan deleted" };
}
