// Migration script to add userId to existing challenges
// Run this once to migrate existing challenges to the new schema

import mongoose from 'mongoose';
import Challenge from '../models/challenge.model.js';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrateChallenges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tsbackend');
    console.log('Connected to MongoDB');

    // Get the first user as default owner for existing challenges
    const firstUser = await User.findOne();
    
    if (!firstUser) {
      console.log('No users found. Please create a user first.');
      return;
    }

    console.log(`Using user ${firstUser.email} as default owner for existing challenges`);

    // Find challenges without userId
    const challengesWithoutUserId = await Challenge.find({ userId: { $exists: false } });
    
    console.log(`Found ${challengesWithoutUserId.length} challenges without userId`);

    if (challengesWithoutUserId.length > 0) {
      // Update all challenges without userId to belong to the first user
      const result = await Challenge.updateMany(
        { userId: { $exists: false } },
        { $set: { userId: firstUser._id } }
      );

      console.log(`Updated ${result.modifiedCount} challenges with userId: ${firstUser._id}`);
    } else {
      console.log('All challenges already have userId assigned');
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateChallenges();
}

export default migrateChallenges;
