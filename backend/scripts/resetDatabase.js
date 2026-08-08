const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Load from backend root

const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Story = require('../models/Story');
const GameSession = require('../models/GameSession');
const GroupGameSettings = require('../models/GroupGameSettings');
const PlayerGameStats = require('../models/PlayerGameStats');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI is not defined in .env');
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const resetDatabase = async () => {
  try {
    await connectDB();
    console.log('\n⚠️  WARNING: You are about to delete all user data from the database. ⚠️\n');

    // Delete all users EXCEPT system bots
    const deletedUsers = await User.deleteMany({ role: { $ne: 'system_bot' } });
    console.log(`✅ Deleted ${deletedUsers.deletedCount} normal users (System bots were kept)`);

    // Delete all chats
    const deletedChats = await Chat.deleteMany({});
    console.log(`✅ Deleted ${deletedChats.deletedCount} chats`);

    // Delete all messages
    const deletedMessages = await Message.deleteMany({});
    console.log(`✅ Deleted ${deletedMessages.deletedCount} messages`);

    // Delete all stories
    const deletedStories = await Story.deleteMany({});
    console.log(`✅ Deleted ${deletedStories.deletedCount} stories`);

    // Delete all game sessions
    const deletedSessions = await GameSession.deleteMany({});
    console.log(`✅ Deleted ${deletedSessions.deletedCount} game sessions`);

    // Delete all group game settings
    const deletedSettings = await GroupGameSettings.deleteMany({});
    console.log(`✅ Deleted ${deletedSettings.deletedCount} group game settings`);

    // Delete all player game stats
    const deletedStats = await PlayerGameStats.deleteMany({});
    console.log(`✅ Deleted ${deletedStats.deletedCount} player game stats`);

    console.log('\n🎉 Database reset complete! The app is now completely fresh.');
    process.exit();
  } catch (error) {
    console.error(`Error resetting database: ${error.message}`);
    process.exit(1);
  }
};

resetDatabase();
