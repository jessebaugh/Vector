export interface SkipToolResult {
  success: boolean;
  message: string;
}

export async function skipTool(
  description: string = "Step skipped"
): Promise<SkipToolResult> {
  return {
    success: true,
    message: description
  };
}
