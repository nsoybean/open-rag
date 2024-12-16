import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { seedSocialMediaPosts, seedWritingStyle } from "./seed";

let mongodb: mongoose.Mongoose | null = null;
let mongoServer: MongoMemoryServer | null = null; // Singleton for MongoMemoryServer

// Initialize the in-memory database and seed data
export async function initAndSeedDatabase() {
  try {
    // Create and start a new in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();

    // Connect mongoose to the in-memory MongoDB
    mongodb = await mongoose.connect(mongoServer.getUri());

    console.log("Connected to in-memory MongoDB instance");

    // Seed your database with initial data
    await seedData();
    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error initializing in-memory database:", err);
    throw err;
  }
}

// Seed function where actual data is inserted
async function seedData() {
  // Example: Insert social media post data
  const socialMediaPost = mongoose.model(
    "social-media-post",
    new mongoose.Schema({ title: String, commentary: String })
  );
  await socialMediaPost.insertMany(seedSocialMediaPosts);
  console.log("Sample social media posts inserted:", seedSocialMediaPosts);

  // Example: Insert writing style data
  const writingStyle = mongoose.model(
    "writing-style",
    new mongoose.Schema({ title: String, description: String })
  );
  await writingStyle.insertMany(seedWritingStyle);
  console.log("Sample writing style inserted:", seedWritingStyle);
}

// Cleanup function to stop the in-memory database
export async function stopDatabase() {
  try {
    if (mongoServer) await mongoServer.stop();
    console.log("In-memory MongoDB instance stopped and cleaned up");
  } catch (err) {
    console.error("Error stopping in-memory database:", err);
  }
}
