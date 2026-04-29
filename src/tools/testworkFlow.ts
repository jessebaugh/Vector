import { executePlan } from "./workflowEngine";

async function main(): Promise<void> {
  const testPlan: any = {
    optimize: false,
    parallel: false,
    autofix: false,   // disable plan-level autofix
    steps: [
      {
        number: 1,
        tool: "fileWriterTool",
        description: "This step is missing required fields and should trigger autofix",
        filename: null,   // present but invalid → passes plan-level validation
        content: null,    // present but invalid → triggers step-level autofix
        autofix: true     // enable step-level autofix
      }
    ]
  };

  try {
    const results = await executePlan(testPlan);
    console.log("AUTOFIX TEST RESULTS:");
    console.dir(results, { depth: null });
  } catch (err) {
    console.error("EXECUTION ERROR:");
    console.error(err);
  }
}

main();
