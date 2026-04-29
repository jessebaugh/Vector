import fs from "fs/promises";
import path from "path";

export interface FileReaderResult {
  success: boolean;
  filename?: string;
  content?: string;
  error?: string;
}

export async function fileReaderTool(filename: string): Promise<FileReaderResult> {
  try {
    const filePath = path.join(process.cwd(), "vector_output", filename);

    const content = await fs.readFile(filePath, "utf8");

    return {
      success: true,
      filename,
      content
    };

  } catch (error: any) {
    return {
      success: false,
      error: `Could not read file: ${error.message}`
    };
  }
}
