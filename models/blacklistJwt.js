// blacklistModel.js

import  {db} from "../config/db.js";

// Function to add a token to the blacklist
export const addToBlacklist = async (token) => {
  try {
    
    await db.collection('blacklist').insertOne({ token });
  } catch (error) {
    throw new Error('Error adding token to blacklist');
  }
};

// Function to check if a token is blacklisted
export const isTokenBlacklisted = async (token) => {
  try {
    
    const blacklistedToken = await db.collection('blacklist').findOne({ token });
    return !!blacklistedToken;
  } catch (error) {
    throw new Error('Error checking token blacklist');
  }
};
