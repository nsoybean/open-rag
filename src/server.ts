// Import the 'express' module
import express from "express";
import { stopDatabase } from "./database";

// Create an Express application
const app = express();

// Set the port number for the server
const port = 3000;

// Define a route for the root path ('/')
app.get("/", (req, res) => {
  // Send a response to the client
  res.send("Hello, TypeScript + Node.js + Express!!!");
});

// Start the server
export function startServer() {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// terminate
process.on("SIGINT", async () => {
  console.log("Open Rag is shutting down");
  await stopDatabase();
  process.exit(1);
});
