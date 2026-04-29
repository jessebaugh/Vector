import fs from "fs/promises";
import path from "path";

export interface FileWriterResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function fileWriterTool(
  filename: string,
  content: string
): Promise<FileWriterResult> {
  try {
    const filePath = path.join(process.cwd(), "vector_output", filename);

    // Ensure the output folder exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Write the file
    await fs.writeFile(filePath, content, "utf8");

    return {
      success: true,
      message: `File created at ${filePath}`
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
