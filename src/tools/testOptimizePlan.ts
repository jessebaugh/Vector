import { executePlan } from "./workflowEngine";

async function main(): Promise<void> {
  const testPlan: any = {
    optimize: true,
    parallel: true,
    autofix: false,
    steps: [
      {
        number: 1,
        tool: "fileWriterTool",
        description: "Write A",
        filename: "phase2.txt",
        content: "A",
        autofix: false
      },
      {
        number: 2,
        tool: "fileReaderTool",
        description: "Read A",
        filename: "phase2.txt",
        autofix: false
      },
      {
        number: 3,
        tool: "fileWriterTool",
        description: "Write B",
        filename: "other.txt",
        content: "B",
        autofix: false
      }
    ]
  };

  const results = await executePlan(testPlan);
  console.log("PHASE 2 TEST RESULTS:");
  console.dir(results, { depth: null });
}

main();
