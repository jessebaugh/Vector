import fs from "fs/promises";
import path from "path";

export interface FileUpdaterResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function fileUpdaterTool(
  filename: string,
  newContent: string,
  mode: "append" | "overwrite" | "prepend" = "append"
): Promise<FileUpdaterResult> {
  try {
    const filePath = path.join(process.cwd(), "vector_output", filename);

    // Read existing content (if any)
    let existing = "";
    try {
      existing = await fs.readFile(filePath, "utf8");
    } catch {
      existing = "";
    }

    let updated = "";

    if (mode === "append") {
      updated = existing + "\n" + newContent;
    } else if (mode === "overwrite") {
      updated = newContent;
    } else if (mode === "prepend") {
      updated = newContent + "\n" + existing;
    } else {
      return {
        success: false,
        error: "Invalid mode. Use append, overwrite, or prepend."
      };
    }

    await fs.writeFile(filePath, updated, "utf8");

    return {
      success: true,
      message: `File updated (${mode}) at ${filePath}`
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
