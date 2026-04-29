let hasFailed = false;

export interface FlakyToolResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function flakyTool(): Promise<FlakyToolResult> {
  if (!hasFailed) {
    hasFailed = true;
    return {
      success: false,
      error: "Intentional failure on first attempt"
    };
  }

  return {
    success: true,
    message: "Flaky tool succeeded on retry"
  };
}
