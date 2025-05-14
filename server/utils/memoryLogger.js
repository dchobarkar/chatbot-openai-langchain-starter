export async function memoryLogger(inputs, outputs, memory) {
  const state = await memory.loadMemoryVariables();
  console.log("\n\n[DEBUG] Current Memory State:");
  console.dir(state, { depth: null });
  console.log("\nInput:", inputs.input);
  console.log("Output:", outputs.response);
}
