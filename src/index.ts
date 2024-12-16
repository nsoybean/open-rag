import readline from "readline";
import { agent } from "./agent";
import { chat } from "./chat";
import { initAndSeedDatabase, stopDatabase } from "./database";
import { startServer } from "./server";

// Create an async interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask questions asynchronously
function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

// CLI interface
async function main() {
  // Initialize the database
  await initAndSeedDatabase();
  console.log("Open Rag is online");

  let inputQn: string | null = null;

  try {
    do {
      inputQn = await askQuestion("Input question: ");
      if (!inputQn) break;

      const response = await chat.invoke({
        input: inputQn,
      });

      console.log("Response:", response);
    } while (inputQn);
  } finally {
    // Ensure the readline interface closes properly
    rl.close();
    await stopDatabase();
    console.log("Main interaction finished.");
  }
}

// Run main() and startServer() concurrently
function run() {
  // Start the server
  startServer();

  // Run the main interaction logic
  main().catch((err) => {
    console.error("Error in main:", err);
    process.exit(1);
  });
}

run();
