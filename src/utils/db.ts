import mongoose from "mongoose";
import {logger} from "./logger";

const MONGODB_URI = process.env.MONGODB_URI;
// Migration function to add topic field to existing sessions
const runTopicFieldMigration = async () => {
  try {
    // Import ChatSession model here to avoid circular imports
    const { ChatSession } = await import('../models/ChatSession');
    
    // Check if migration is needed
    const sessionWithoutTopic = await ChatSession.findOne({ topic: { $exists: false } });
    
    if (sessionWithoutTopic) {
      logger.info("Running topic field migration for existing chat sessions...");
      
      const result = await ChatSession.updateMany(
        { topic: { $exists: false } },
        { $set: { topic: null } }
      );
      
      logger.info(`Topic field migration completed: ${result.modifiedCount} documents updated`);
    } else {
      logger.info("Topic field migration not needed - all sessions already have topic field");
    }
  } catch (error) {
    logger.error("Topic field migration failed:", error);
    // Don't exit the process - let the app continue running
  }
};

export const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    // Check if MONGODB_URI is defined
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};